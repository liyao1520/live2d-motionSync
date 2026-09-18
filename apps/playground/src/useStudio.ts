import { useCallback, useEffect, useRef, useState } from 'react';
import { createPlayer, type Player, type ModelSource } from '@live2d-motionsync/core';

export function useStudio() {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<Player | undefined>(undefined);
  const microphone = useRef<MediaStream | undefined>(undefined);
  const loadController = useRef<AbortController | undefined>(undefined);
  const generation = useRef(0);
  const audioGeneration = useRef(0);
  const mounted = useRef(true);
  const [instance, setInstance] = useState<Player>();
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('准备加载');
  const [error, setError] = useState(false);
  const [modelName, setModelName] = useState('未加载模型');
  const [playing, setPlaying] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const report = useCallback((e: unknown) => {
    if (!mounted.current) return;
    setError(true);
    setStatus(e instanceof Error ? e.message : String(e));
  }, []);
  const stopMic = useCallback(() => {
    microphone.current?.getTracks().forEach((t) => t.stop());
    microphone.current = undefined;
    if (mounted.current) setMicActive(false);
  }, []);
  const stop = useCallback(() => {
    audioGeneration.current++;
    player.current?.stop();
    stopMic();
    if (mounted.current) setPlaying(false);
  }, [stopMic]);
  const unload = useCallback(async () => {
    generation.current++;
    loadController.current?.abort();
    stop();
    const previous = player.current;
    player.current = undefined;
    setInstance(undefined);
    setBusy(false);
    await previous?.destroy();
    if (mounted.current) {
      setStatus('已卸载');
      setError(false);
      setModelName('未加载模型');
    }
  }, [stop]);
  const load = useCallback(
    async (source: ModelSource, name: string) => {
      const ticket = ++generation.current;
      loadController.current?.abort();
      stop();
      const controller = new AbortController();
      loadController.current = controller;
      const previous = player.current;
      player.current = undefined;
      setInstance(undefined);
      setBusy(true);
      setError(false);
      setStatus('正在加载模型…');
      try {
        await previous?.destroy();
        if (ticket !== generation.current || !host.current) return;
        const canvas = document.createElement('canvas');
        canvas.id = 'live2d';
        host.current.replaceChildren(canvas);
        const p = await createPlayer({
          canvas,
          model: source,
          signal: controller.signal,
          interaction: { lookAtPointer: true },
        });
        if (ticket !== generation.current || !mounted.current) {
          await p.destroy();
          return;
        }
        player.current = p;
        setInstance(p);
        setModelName(name);
        setStatus('模型已就绪 · ' + p.capabilities.lipSync);
        p.on('error', (e) => {
          if (player.current === p) report(e);
        });
        p.on('hit', ({ areas }) => {
          if (player.current === p) setStatus('点击：' + areas.join(', '));
        });
        p.on('statechange', ({ state }) => {
          if (player.current !== p || !mounted.current) return;
          setPlaying(state === 'playing');
          setStatus(p.capabilities.lipSync + ' · ' + state);
        });
      } catch (e) {
        if (!controller.signal.aborted && ticket === generation.current) report(e);
      } finally {
        if (ticket === generation.current && mounted.current) setBusy(false);
      }
    },
    [report, stop],
  );

  const run = useCallback(
    (action: () => unknown) => {
      // Invoke synchronously so unlockAudio retains the user's gesture.
      try {
        Promise.resolve(action()).catch(report);
      } catch (e) {
        report(e);
      }
    },
    [report],
  );
  const current = () => {
    if (!player.current) throw new Error('请先加载模型');
    return player.current;
  };
  async function play(source: string | File, queue = false) {
    const p = current();
    await p.unlockAudio();
    if (p !== player.current) return;
    setError(false);
    if (queue) p.enqueue(source);
    else {
      audioGeneration.current++;
      stopMic();
      p.play(source);
    }
  }
  async function mic() {
    if (microphone.current) {
      stop();
      return;
    }
    const p = current();
    const ticket = ++audioGeneration.current;
    await p.unlockAudio();
    stopMic();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    if (ticket !== audioGeneration.current || p !== player.current || !mounted.current) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    microphone.current = stream;
    setMicActive(true);
    try {
      p.attachStream(stream);
    } catch (e) {
      stopMic();
      throw e;
    }
  }
  async function pcm() {
    const p = current();
    const ticket = ++audioGeneration.current;
    await p.unlockAudio();
    stopMic();
    p.stop();
    const context = new AudioContext();
    try {
      const response = await fetch('/demo.wav');
      if (!response.ok) throw new Error('演示音频加载失败');
      const buffer = await context.decodeAudioData(await response.arrayBuffer());
      if (ticket !== audioGeneration.current || p !== player.current) return;
      const speech = p.createPcmStream({
        sampleRate: buffer.sampleRate,
        channels: 1,
        format: 'f32',
      });
      const samples = buffer.getChannelData(0);
      for (let i = 0; i < samples.length; i += 2400) {
        if (ticket !== audioGeneration.current) {
          speech.stop();
          return;
        }
        await speech.write(samples.slice(i, i + 2400));
      }
      await speech.end();
    } catch (e) {
      if (ticket === audioGeneration.current) throw e;
    } finally {
      await context.close();
    }
  }

  useEffect(() => {
    mounted.current = true;
    const cleanup = () => {
      generation.current++;
      audioGeneration.current++;
      loadController.current?.abort();
      microphone.current?.getTracks().forEach((t) => t.stop());
      microphone.current = undefined;
      const p = player.current;
      player.current = undefined;
      void p?.destroy();
    };
    // Integration tests use the same public SDK as consumers; no renderer is exported.
    Object.assign(window, { sdk: { createPlayer }, getPlayer: () => player.current });
    window.addEventListener('pagehide', cleanup);
    return () => {
      mounted.current = false;
      window.removeEventListener('pagehide', cleanup);
      cleanup();
    };
  }, []);

  return {
    host,
    instance,
    busy,
    status,
    error,
    modelName,
    playing,
    micActive,
    load,
    unload,
    stop,
    play,
    mic,
    pcm,
    run,
  };
}
