import { AudioEngine } from './audio/engine';
import { ModelBundle } from './assets/bundle';
import { aborted, asError, check } from './errors';
import { Events } from './events';
import { LipSyncDriver } from './lipsync/driver';
import { Renderer } from './renderer/untitled';
import { loadRuntime } from './runtime/loader';
import type {
  AudioSource,
  ModelControls,
  PcmOptions,
  PcmStream,
  Playback,
  PlayerEvents,
  PlayerOptions,
  LipSyncMode,
} from './types';
const ownedCanvases = new WeakSet<HTMLCanvasElement>();

export class Player {
  readonly model: ModelControls;
  readonly capabilities: Readonly<{ lipSync: LipSyncMode }>;
  private destroyed = false;
  private destroyPromise?: Promise<void>;
  private constructor(
    private bundle: ModelBundle,
    private renderer: Renderer,
    private driver: LipSyncDriver,
    private audio: AudioEngine,
    private events: Events<PlayerEvents>,
  ) {
    this.model = renderer.controls;
    this.capabilities = Object.freeze({ lipSync: driver.mode });
    renderer.setUpdate(() => {
      try {
        audio.tick();
        driver.apply(renderer.write);
      } catch (error) {
        audio.stop();
        events.emit('error', asError(error));
      }
    });
    document.addEventListener('visibilitychange', this.visibility);
    this.visibility();
  }
  static async create(options: PlayerOptions): Promise<Player> {
    check(
      typeof HTMLCanvasElement !== 'undefined' && options.canvas instanceof HTMLCanvasElement,
      'INVALID_CANVAS',
      'A browser canvas element is required',
    );
    check(
      !ownedCanvases.has(options.canvas),
      'CANVAS_IN_USE',
      'Destroy the existing player before reusing this canvas',
    );
    ownedCanvases.add(options.canvas);
    try {
      return await Player.initialize(options);
    } catch (error) {
      ownedCanvases.delete(options.canvas);
      throw error;
    }
  }
  private static async initialize(options: PlayerOptions): Promise<Player> {
    check(
      typeof window !== 'undefined' && typeof HTMLCanvasElement !== 'undefined',
      'BROWSER_REQUIRED',
      'createPlayer must run in a browser',
    );
    check(
      options.canvas instanceof HTMLCanvasElement,
      'INVALID_CANVAS',
      'A canvas element is required',
    );
    aborted(options.signal);
    const events = new Events<PlayerEvents>();
    const bundle = await ModelBundle.open(options.model, options.imports, options.signal);
    let renderer: Renderer | undefined;
    let driver: LipSyncDriver | undefined;
    let audio: AudioEngine | undefined;
    try {
      const configPath = bundle.json.FileReferences.MotionSync;
      const configuration =
        configPath && options.lipSync?.mode !== 'amplitude'
          ? await bundle.jsonResource(configPath)
          : undefined;
      if (configuration !== undefined)
        await loadRuntime('Live2DCubismMotionSyncCore', options.runtime?.motionSyncUrl);
      aborted(options.signal);
      renderer = await Renderer.create(options, bundle, (areas) => events.emit('hit', { areas }));
      driver = new LipSyncDriver(
        renderer.parameters,
        configuration,
        options.lipSync,
        bundle.json.Groups?.find((g) => g.Name === 'LipSync')?.Ids ?? [],
      );
      const mouth = driver;
      audio = new AudioEngine(
        options.audio,
        options.runtime,
        events,
        (samples, rate) => mouth.push(samples, rate),
        () => mouth.reset(),
      );
      aborted(options.signal);
      const player = new Player(bundle, renderer, driver, audio, events);
      player.canvas = options.canvas;
      return player;
    } catch (error) {
      await Promise.allSettled([
        Promise.resolve().then(() => audio?.destroy()),
        Promise.resolve().then(() => driver?.destroy()),
        Promise.resolve().then(() => renderer?.destroy()),
      ]);
      bundle.dispose();
      aborted(options.signal);
      throw asError(error, 'MODEL_LOAD_FAILED');
    }
  }
  private canvas?: HTMLCanvasElement;
  on<K extends keyof PlayerEvents>(
    name: K,
    listener: (event: PlayerEvents[K]) => void,
  ): () => void {
    check(!this.destroyed, 'DESTROYED', 'Player destroyed');
    return this.events.on(name, listener);
  }
  unlockAudio(): Promise<void> {
    return this.audio.unlock();
  }
  play(source: AudioSource): Playback {
    return this.audio.play(source, true);
  }
  enqueue(source: AudioSource): Playback {
    return this.audio.play(source, false);
  }
  createPcmStream(options: PcmOptions): PcmStream {
    return this.audio.createPcmStream(options);
  }
  attachStream(stream: MediaStream): Playback {
    return this.audio.attachStream(stream);
  }
  stop(): void {
    if (!this.destroyed) this.audio.stop();
  }
  private visibility = (): void => {
    this.audio.setHidden(document.hidden);
    this.renderer.setHidden(document.hidden);
  };
  destroy(): Promise<void> {
    if (this.destroyPromise) return this.destroyPromise;
    this.destroyed = true;
    document.removeEventListener('visibilitychange', this.visibility);
    this.destroyPromise = (async () => {
      try {
        await this.audio.destroy();
      } finally {
        try {
          try {
            this.driver.destroy();
          } finally {
            await this.renderer.destroy();
          }
        } finally {
          this.bundle.dispose();
          if (this.canvas) ownedCanvases.delete(this.canvas);
          this.events.emit('statechange', { state: 'destroyed' });
          this.events.clear();
        }
      }
    })();
    return this.destroyPromise;
  }
}
export function createPlayer(options: PlayerOptions): Promise<Player> {
  return Player.create(options);
}
