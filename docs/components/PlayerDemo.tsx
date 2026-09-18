'use client';
import { useEffect, useRef, useState } from 'react';
import type { Player } from '@live2d-motionsync/core';

export default function PlayerDemo({ queue = false }: { queue?: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const player = useRef<Player | null>(null);
  const [status, setStatus] = useState('加载模型…');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let instance: Player | undefined;
    // A fresh canvas per effect avoids StrictMode reusing a WebGL context during async teardown.
    const host = canvas.current!.parentElement!;
    const target = document.createElement('canvas');
    host.append(target);
    void import('@live2d-motionsync/core')
      .then(({ createPlayer }) =>
        createPlayer({
          canvas: target,
          model: '/models/kei_vowels_pro/kei_vowels_pro.model3.json',
          signal: controller.signal,
        }),
      )
      .then(async (p) => {
        instance = p;
        if (controller.signal.aborted) {
          await p.destroy();
          return;
        }
        player.current = p;
        setReady(true);
        setStatus(`就绪 · ${p.capabilities.lipSync}`);
        p.on('error', (error) => setStatus(error.message));
        p.on('statechange', ({ state }) => setStatus(state));
      })
      .catch((error) => {
        if (!controller.signal.aborted) setStatus(String(error));
      });
    return () => {
      controller.abort();
      player.current = null;
      void instance?.destroy();
      target.remove();
    };
  }, []);
  async function play() {
    try {
      const p = player.current;
      if (!p) return;
      await p.unlockAudio();
      const job = queue ? p.enqueue('/demo.wav') : p.play('/demo.wav');
      await job.finished;
    } catch (error) {
      setStatus(String(error));
    }
  }
  return (
    <main style={{ padding: 12 }}>
      <div style={{ height: 350, position: 'relative' }}>
        <canvas ref={canvas} hidden />
      </div>
      <button disabled={!ready} onClick={play}>
        {queue ? '加入队列' : '播放 / 打断'}
      </button>{' '}
      <button disabled={!ready} onClick={() => player.current?.stop()}>
        停止并清空队列
      </button>
      <p role="status">{status}</p>
    </main>
  );
}
