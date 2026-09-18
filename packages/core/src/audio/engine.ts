import { fetchBytes } from '../assets/bundle';
import { asError, check } from '../errors';
import type { Events } from '../events';
import type {
  AudioSource,
  PcmOptions,
  PcmStream,
  Playback,
  PlayerEvents,
  PlayerOptions,
} from '../types';
import { decodePcm, downmix, validatePcm } from './pcm';
import { Session, SessionQueue } from './session';

interface Packet {
  session: Session;
  node: AudioBufferSourceNode;
  samples: Float32Array;
  rate: number;
  start: number;
  position: number;
}
const captureCode = `class Capture extends AudioWorkletProcessor {
  constructor(){super();this.frames=[];this.length=0;this.alive=true;this.port.onmessage=e=>{if(e.data==='stop')this.alive=false}}
  process(inputs){if(!this.alive)return false;const channels=inputs[0];if(!channels?.length)return true;
    const mono=new Float32Array(channels[0].length);for(const c of channels)for(let i=0;i<mono.length;i++)mono[i]+=c[i]/channels.length;
    this.frames.push(mono);this.length+=mono.length;
    if(this.length>=1024){const data=new Float32Array(this.length);let n=0;for(const f of this.frames){data.set(f,n);n+=f.length}this.port.postMessage({data,time:currentTime},[data.buffer]);this.frames=[];this.length=0}return true;
  }}registerProcessor('motionsync-capture-v2',Capture);`;

export class AudioEngine {
  private context?: AudioContext;
  private packets: Packet[] = [];
  private capture: { data: Float32Array; time: number; session: Session }[] = [];
  private destroyed = false;
  private hidden = false;
  private fileState?: {
    session: Session;
    buffer: AudioBuffer;
    mono: Float32Array;
    offset: number;
    start: number;
    node?: AudioBufferSourceNode;
  };
  private worklet?: Promise<void>;
  private currentInput?: Session;
  private discardPcm?: () => void;
  private nodes = new Map<Session, Set<AudioBufferSourceNode>>();
  private readonly queue: SessionQueue;
  private readonly maxBuffered: number;
  constructor(
    private options: PlayerOptions['audio'],
    private runtime: PlayerOptions['runtime'],
    private events: Events<PlayerEvents>,
    private consume: (pcm: Float32Array, rate: number) => void,
    private reset: () => void,
  ) {
    this.maxBuffered = options?.maxBufferedSeconds ?? 2;
    check(
      Number.isFinite(this.maxBuffered) && this.maxBuffered >= 0.1 && this.maxBuffered <= 30,
      'INVALID_OPTIONS',
      'maxBufferedSeconds must be 0.1–30',
    );
    check(
      Number.isInteger(options?.maxQueueLength ?? 32) && (options?.maxQueueLength ?? 32) > 0,
      'INVALID_OPTIONS',
      'maxQueueLength must be a positive integer',
    );
    check(
      Number.isFinite(options?.maxFileBytes ?? 1) && (options?.maxFileBytes ?? 1) > 0,
      'INVALID_OPTIONS',
      'maxFileBytes must be positive',
    );
    this.queue = new SessionQueue(() => {
      if (!this.destroyed) {
        this.reset();
        this.events.emit('statechange', { state: 'idle' });
      }
    });
  }
  private alive(): void {
    check(!this.destroyed, 'DESTROYED', 'Player has been destroyed');
  }
  async unlock(): Promise<void> {
    this.alive();
    this.context ??= new AudioContext({ latencyHint: 'interactive' });
    await this.context.resume();
    this.alive();
    check(this.context.state === 'running', 'AUDIO_LOCKED', 'Audio needs a user gesture');
    if (!this.hidden && this.fileState && !this.fileState.node) this.startFile(this.fileState);
  }
  private audioContext(): AudioContext {
    this.alive();
    check(
      this.context?.state === 'running',
      'AUDIO_LOCKED',
      'Call unlockAudio() inside a user gesture before playback',
    );
    return this.context;
  }
  private start(session: Session): void {
    this.reset();
    this.currentInput = session;
    session.addCleanup(() => {
      for (const node of this.nodes.get(session) ?? []) {
        node.onended = null;
        node.stop();
        node.disconnect();
      }
      this.nodes.delete(session);
      this.packets = this.packets.filter((p) => p.session !== session);
      this.capture = this.capture.filter((p) => p.session !== session);
      if (this.fileState?.session === session) this.fileState = undefined;
      if (this.currentInput === session) {
        this.currentInput = undefined;
        this.reset();
      }
    });
  }
  private fail(session: Session, error: unknown): void {
    if (session.settled) return;
    const failure = asError(error, 'AUDIO_FAILED');
    session.fail(failure);
    this.events.emit('error', failure);
  }
  play(source: AudioSource, replace = true): Playback {
    this.alive();
    check(
      replace || this.queue.length < (this.options?.maxQueueLength ?? 32),
      'QUEUE_FULL',
      'Audio queue is full',
    );
    return this.queue.add((session) => {
      this.start(session);
      this.events.emit('statechange', { state: 'loading' });
      void (async () => {
        const context = this.audioContext();
        const limit = this.options?.maxFileBytes ?? 64 * 1024 ** 2;
        let buffer: AudioBuffer;
        if (typeof source === 'string')
          buffer = await context.decodeAudioData(
            (await fetchBytes(source, limit, session.controller.signal)).buffer,
          );
        else if (source instanceof Blob) {
          check(source.size <= limit, 'RESOURCE_TOO_LARGE', 'Audio file exceeds limit');
          buffer = await context.decodeAudioData(await source.arrayBuffer());
        } else buffer = source;
        if (session.settled) return;
        check(
          buffer.length > 0 && buffer.sampleRate >= 16000 && buffer.sampleRate <= 128000,
          'INVALID_AUDIO',
          'Unsupported sample rate or empty audio',
        );
        const state = { session, buffer, mono: downmix(buffer), offset: 0, start: 0 };
        this.fileState = state;
        if (!this.hidden) this.startFile(state);
      })().catch((error) => this.fail(session, error));
    }, replace);
  }
  private startFile(state: NonNullable<AudioEngine['fileState']>): void {
    if (state.session.settled || this.hidden || state.node) return;
    if (state.offset >= state.buffer.duration) {
      state.session.complete();
      return;
    }
    const context = this.audioContext();
    const node = context.createBufferSource();
    node.buffer = state.buffer;
    this.trackNode(state.session, node);
    state.node = node;
    state.start = context.currentTime;
    node.connect(context.destination);
    const packet: Packet = {
      session: state.session,
      node,
      samples: state.mono,
      rate: state.buffer.sampleRate,
      start: state.start - state.offset,
      position: Math.floor(state.offset * state.buffer.sampleRate),
    };
    this.packets.push(packet);
    node.onended = () => {
      if (state.node !== node || state.session.settled) return;
      try {
        this.tick();
      } catch (error) {
        this.fail(state.session, error);
        return;
      }
      node.disconnect();
      this.nodes.get(state.session)?.delete(node);
      state.session.complete();
    };
    node.start(0, state.offset);
    this.events.emit('statechange', { state: 'playing' });
  }
  createPcmStream(options: PcmOptions): PcmStream {
    this.alive();
    validatePcm(options);
    const context = this.audioContext();
    let nextTime = context.currentTime;
    let ended = false;
    let writing = false;
    let outstanding = 0;
    const session = this.queue.add((s) => this.start(s), true);
    const complete = () => {
      if (ended && outstanding === 0 && !writing && !session.settled) {
        try {
          this.tick();
          session.complete();
        } catch (error) {
          this.fail(session, error);
        }
      }
    };
    const discard = () => {
      for (const node of this.nodes.get(session) ?? []) {
        node.onended = null;
        node.stop();
        node.disconnect();
      }
      this.nodes.get(session)?.clear();
      this.packets = this.packets.filter((p) => p.session !== session);
      outstanding = 0;
      nextTime = context.currentTime;
      complete();
    };
    this.discardPcm = discard;
    session.addCleanup(() => {
      if (this.discardPcm === discard) this.discardPcm = undefined;
    });
    const write = async (chunk: Float32Array | Uint8Array | ArrayBuffer): Promise<void> => {
      check(!session.settled && !ended, 'STREAM_CLOSED', 'PCM input is closed');
      check(!writing, 'BACKPRESSURE', 'Await the previous write before writing another chunk');
      check(
        chunk.byteLength <= 8 * 1024 ** 2,
        'INVALID_PCM',
        'Write PCM in chunks smaller than 8 MiB',
      );
      writing = true;
      try {
        check(
          this.hidden || context.state === 'running',
          'AUDIO_LOCKED',
          'Audio context interrupted; unlock before starting a new stream',
        );
        const mono = decodePcm(chunk, options);
        const maxFrames = Math.max(1, Math.floor((this.maxBuffered * options.sampleRate) / 2));
        for (let offset = 0; offset < mono.length; offset += maxFrames) {
          check(!session.settled, 'STREAM_CLOSED', 'PCM session was cancelled');
          const count = Math.min(maxFrames, mono.length - offset);
          const duration = count / options.sampleRate;
          while (!this.hidden && nextTime + duration - context.currentTime > this.maxBuffered) {
            await new Promise<void>((resolve) => setTimeout(resolve, 10));
            check(!session.settled, 'STREAM_CLOSED', 'PCM session was cancelled');
            check(
              context.state === 'running',
              'AUDIO_LOCKED',
              'Audio context interrupted; unlock before starting a new stream',
            );
          }
          if (this.hidden) {
            nextTime = context.currentTime;
            continue;
          }
          const buffer = context.createBuffer(1, count, options.sampleRate);
          buffer.copyToChannel(mono.subarray(offset, offset + count), 0);
          const node = context.createBufferSource();
          node.buffer = buffer;
          node.connect(context.destination);
          this.trackNode(session, node);
          const start = Math.max(nextTime, context.currentTime + (outstanding === 0 ? 0.025 : 0));
          nextTime = start + duration;
          outstanding++;
          this.packets.push({
            session,
            node,
            samples: buffer.getChannelData(0),
            rate: options.sampleRate,
            start,
            position: 0,
          });
          node.onended = () => {
            if (session.settled) return;
            try {
              this.tick();
            } catch (error) {
              this.fail(session, error);
              return;
            }
            outstanding--;
            node.disconnect();
            this.nodes.get(session)?.delete(node);
            complete();
          };
          node.start(start);
          this.events.emit('statechange', { state: 'playing' });
        }
      } catch (error) {
        this.fail(session, error);
        throw error;
      } finally {
        writing = false;
        complete();
      }
    };
    return {
      finished: session.finished,
      stop: () => session.stop(),
      write,
      end: () => {
        ended = true;
        complete();
        return session.finished;
      },
    };
  }
  attachStream(stream: MediaStream): Playback {
    this.alive();
    const context = this.audioContext();
    return this.queue.add((session) => {
      this.start(session);
      void (async () => {
        check(
          stream.getAudioTracks().some((track) => track.readyState === 'live'),
          'INVALID_STREAM',
          'MediaStream has no live audio track',
        );
        if (!this.worklet) {
          const url =
            this.runtime?.workletUrl ??
            URL.createObjectURL(new Blob([captureCode], { type: 'text/javascript' }));
          this.worklet = context.audioWorklet
            .addModule(url)
            .finally(() => {
              if (!this.runtime?.workletUrl) URL.revokeObjectURL(url);
            })
            .catch((error) => {
              this.worklet = undefined;
              throw error;
            });
        }
        await this.worklet;
        if (session.settled) return;
        const input = context.createMediaStreamSource(stream);
        const capture = new AudioWorkletNode(context, 'motionsync-capture-v2');
        const silent = context.createGain();
        silent.gain.value = 0;
        input.connect(capture);
        capture.connect(silent);
        silent.connect(context.destination);
        capture.port.onmessage = (event: MessageEvent<{ data: Float32Array; time: number }>) => {
          if (session.settled || this.hidden) return;
          if (this.capture.length >= 8) this.capture.shift();
          this.capture.push({ ...event.data, session });
        };
        const tracks = stream.getAudioTracks();
        const onEnded = () => {
          if (tracks.every((track) => track.readyState === 'ended')) session.complete();
        };
        tracks.forEach((track) => track.addEventListener('ended', onEnded));
        session.addCleanup(() => {
          capture.port.onmessage = null;
          capture.port.postMessage('stop');
          capture.port.close();
          input.disconnect();
          capture.disconnect();
          silent.disconnect();
          tracks.forEach((track) => track.removeEventListener('ended', onEnded));
        });
        this.events.emit('statechange', { state: 'playing' });
      })().catch((error) => this.fail(session, error));
    }, true);
  }
  tick(): void {
    if (!this.context || this.hidden) return;
    const now = this.context.currentTime;
    for (const packet of this.packets) {
      if (packet.session.settled) continue;
      const end = Math.min(
        packet.samples.length,
        Math.max(0, Math.floor((now - packet.start) * packet.rate)),
      );
      if (end > packet.position) {
        this.consume(packet.samples.subarray(packet.position, end), packet.rate);
        packet.position = end;
      }
    }
    this.packets = this.packets.filter((p) => p.position < p.samples.length);
    for (const packet of this.capture.splice(0))
      if (!packet.session.settled && now - packet.time < 0.25)
        this.consume(packet.data, this.context.sampleRate);
  }
  private trackNode(session: Session, node: AudioBufferSourceNode): void {
    let nodes = this.nodes.get(session);
    if (!nodes) this.nodes.set(session, (nodes = new Set()));
    nodes.add(node);
  }
  setHidden(hidden: boolean): void {
    if (this.hidden === hidden) return;
    this.tick();
    this.hidden = hidden;
    this.capture = [];
    this.reset();
    const state = this.fileState;
    if (hidden && state?.node && this.context) {
      state.offset += this.context.currentTime - state.start;
      this.nodes.get(state.session)?.delete(state.node);
      state.node.onended = null;
      state.node.stop();
      state.node.disconnect();
      state.node = undefined;
      this.packets = this.packets.filter((p) => p.session !== state.session);
    } else if (!hidden && state && !state.node) {
      if (this.context?.state === 'running') this.startFile(state);
      else this.events.emit('statechange', { state: 'waiting-for-gesture' });
    }
    if (hidden) this.discardPcm?.();
  }
  stop(): void {
    this.queue.stop();
  }
  async destroy(): Promise<void> {
    if (this.destroyed) return;
    this.destroyed = true;
    this.queue.stop();
    if (this.context && this.context.state !== 'closed') await this.context.close();
  }
}
