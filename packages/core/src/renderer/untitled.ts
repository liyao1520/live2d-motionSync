import { Application, Assets, extensions } from 'pixi.js';
import type { CubismInternalModel, Live2DModel } from 'untitled-pixi-live2d-engine/cubism';
import type { ModelBundle } from '../assets/bundle';
import type { ModelControls, Parameter, PlayerOptions } from '../types';
import { aborted, check } from '../errors';
import { loadRuntime } from '../runtime/loader';

// Pixi deliberately loses the context on destroy. Keep the canvas reusable without retaining GPU resources.
const retiredCanvases = new WeakMap<
  HTMLCanvasElement,
  {
    gl: WebGLRenderingContext | WebGL2RenderingContext;
    extension: WEBGL_lose_context;
    lost: Promise<void>;
  }
>();
async function restoreCanvas(canvas: HTMLCanvasElement): Promise<void> {
  const retired = retiredCanvases.get(canvas);
  if (!retired) return;
  await retired.lost;
  if (retired.gl.isContextLost())
    await new Promise<void>((resolve, reject) => {
      const finish = (error?: Error) => {
        clearTimeout(timer);
        canvas.removeEventListener('webglcontextrestored', restored);
        if (error) reject(error);
        else resolve();
      };
      const restored = () => finish();
      const timer = setTimeout(
        () => finish(new Error('WebGL context could not be restored; use a new canvas')),
        5000,
      );
      canvas.addEventListener('webglcontextrestored', restored, { once: true });
      retired.extension.restoreContext();
    });
  retiredCanvases.delete(canvas);
}
function destroyApplication(app: Application, canvas: HTMLCanvasElement): void {
  const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
  const extension = gl?.getExtension('WEBGL_lose_context');
  if (gl && extension) {
    const lost = new Promise<void>((resolve) => {
      const done = (event?: Event) => {
        event?.preventDefault();
        clearTimeout(timer);
        canvas.removeEventListener('webglcontextlost', done);
        resolve();
      };
      const timer = setTimeout(done, 1000);
      canvas.addEventListener('webglcontextlost', done, { once: true });
    });
    retiredCanvases.set(canvas, { gl, extension, lost });
  }
  app.destroy(false, { children: false });
}

export class Renderer {
  private observer?: ResizeObserver;
  private resizeFrame = 0;
  private destroyed = false;
  private tick: () => void = () => {};
  private readonly internal: CubismInternalModel;
  private readonly baseWidth: number;
  private readonly baseHeight: number;
  private readonly textureUrls: string[];
  readonly parameters: Parameter[];
  readonly controls: ModelControls;
  private constructor(
    private app: Application,
    private model: Live2DModel,
    private options: PlayerOptions,
    bundle: ModelBundle,
    onHit: (areas: string[]) => void,
  ) {
    this.internal = model.internalModel as CubismInternalModel;
    this.textureUrls = bundle.json.FileReferences.Textures.map((path) => bundle.resolve(path));
    this.internal.lipSync = false;
    const core = this.internal.coreModel;
    this.parameters = Array.from({ length: core.getParameterCount() }, (_, index) => ({
      id: core.getParameterId(index).getString().s,
      index,
      min: core.getParameterMinimumValue(index),
      max: core.getParameterMaximumValue(index),
      defaultValue: core.getParameterDefaultValue(index),
    }));
    this.baseWidth = model.width;
    this.baseHeight = model.height;
    this.internal.on('beforeModelUpdate', this.beforeUpdate);
    model.on('hit', onHit);
    this.controls = {
      motions: Object.entries(bundle.json.FileReferences.Motions ?? {}).flatMap(
        ([group, motions]) => motions.map((_, index) => ({ group, index })),
      ),
      expressions: (bundle.json.FileReferences.Expressions ?? []).map((e) => e.Name),
      playMotion: async ({ group, index = 0 }) => {
        check(!this.destroyed, 'DESTROYED', 'Player destroyed');
        check(
          this.controls.motions.some((m) => m.group === group && m.index === index),
          'UNKNOWN_MOTION',
          `${group}/${index}`,
        );
        return model.motion(group, index);
      },
      setExpression: async (name) => {
        check(!this.destroyed, 'DESTROYED', 'Player destroyed');
        check(this.controls.expressions.includes(name), 'UNKNOWN_EXPRESSION', name);
        return model.expression(name);
      },
    };
    app.stage.addChild(model);
    this.resize();
    if (typeof ResizeObserver !== 'undefined') {
      this.observer = new ResizeObserver(() => {
        cancelAnimationFrame(this.resizeFrame);
        this.resizeFrame = requestAnimationFrame(() => this.resize());
      });
      this.observer.observe(options.canvas.parentElement ?? options.canvas);
    }
    if (options.interaction?.lookAtPointer)
      options.canvas.addEventListener('pointermove', this.pointerMove);
    if (options.interaction?.hitTest !== false)
      options.canvas.addEventListener('pointerdown', this.pointerDown);
    options.canvas.addEventListener('webglcontextlost', this.contextLost);
    options.canvas.addEventListener('webglcontextrestored', this.contextRestored);
  }
  static async create(
    options: PlayerOptions,
    bundle: ModelBundle,
    onHit: (areas: string[]) => void,
  ): Promise<Renderer> {
    check(
      Number.isFinite(options.layout?.resolution ?? 1) &&
        (options.layout?.resolution ?? 1) > 0 &&
        (options.layout?.resolution ?? 1) <= 4,
      'INVALID_OPTIONS',
      'resolution must be greater than 0 and at most 4',
    );
    await loadRuntime('Live2DCubismCore', options.runtime?.cubismUrl);
    aborted(options.signal);
    const { Live2DModel, Live2DPlugin, CubismModelSettings } =
      await import('untitled-pixi-live2d-engine/cubism');
    extensions.add(Live2DPlugin);
    const app = new Application();
    let model: Live2DModel | undefined;
    const textures = bundle.json.FileReferences.Textures.map((path) => bundle.resolve(path));
    try {
      await restoreCanvas(options.canvas);
      aborted(options.signal);
      await app.init({
        canvas: options.canvas,
        preference: 'webgl',
        backgroundAlpha: 0,
        autoDensity: true,
        resolution: options.layout?.resolution ?? Math.min(globalThis.devicePixelRatio || 1, 2),
        width: 1,
        height: 1,
      });
      aborted(options.signal);
      // Blob URLs carry no extension; select Pixi's image parser explicitly before upstream requests them.
      for (const src of textures) {
        await Assets.load({ src, parser: 'loadTextures' });
        aborted(options.signal);
      }
      // Model motion audio belongs to AudioEngine. Never let upstream start a second audio pipeline.
      const json = structuredClone(bundle.json);
      for (const motion of Object.values(json.FileReferences.Motions ?? {}).flat())
        delete motion.Sound;
      const settings = new CubismModelSettings({
        ...json,
        url: bundle.entry,
      } as ConstructorParameters<typeof CubismModelSettings>[0]);
      settings.resolveURL = (path) => bundle.resolve(path);
      model = await Live2DModel.from(settings, {
        ticker: app.ticker,
        autoUpdate: true,
        autoHitTest: false,
        autoFocus: false,
        idleMotionGroup: options.interaction?.idle === false ? '__disabled__' : undefined,
      });
      aborted(options.signal);
      return new Renderer(app, model, options, bundle, onHit);
    } catch (error) {
      try {
        model?.destroy();
      } finally {
        try {
          await Assets.unload(textures);
        } finally {
          if (app.renderer) destroyApplication(app, options.canvas);
        }
      }
      throw error;
    }
  }
  private beforeUpdate = (): void => this.tick();
  setUpdate(fn: () => void): void {
    this.tick = fn;
  }
  write = (index: number, value: number): void =>
    this.internal.coreModel.setParameterValueByIndex(index, value);
  private pointerPosition(event: PointerEvent): [number, number] {
    const rect = this.options.canvas.getBoundingClientRect();
    return [
      ((event.clientX - rect.left) * this.app.screen.width) / rect.width,
      ((event.clientY - rect.top) * this.app.screen.height) / rect.height,
    ];
  }
  private pointerMove = (event: PointerEvent): void => {
    const [x, y] = this.pointerPosition(event);
    this.model.focus(x, y);
  };
  private pointerDown = (event: PointerEvent): void => {
    const [x, y] = this.pointerPosition(event);
    this.model.tap(x, y);
  };
  private contextLost = (event: Event): void => {
    event.preventDefault();
    this.app.stop();
  };
  private contextRestored = (): void => {
    if (!this.destroyed && !document.hidden) this.app.start();
  };
  private resize(): void {
    if (this.destroyed) return;
    const parent = this.options.canvas.parentElement;
    const width = Math.max(1, parent?.clientWidth ?? this.options.canvas.clientWidth);
    const height = Math.max(1, parent?.clientHeight ?? this.options.canvas.clientHeight);
    this.app.renderer.resize(width, height);
    const ratios = [width / this.baseWidth, height / this.baseHeight];
    this.model.scale.set(
      this.options.layout?.fit === 'cover' ? Math.max(...ratios) : Math.min(...ratios),
    );
    this.model.position.set((width - this.model.width) / 2, (height - this.model.height) / 2);
  }
  setHidden(hidden: boolean): void {
    if (hidden) this.app.stop();
    else if (!this.destroyed) this.app.start();
  }
  async destroy(): Promise<void> {
    if (this.destroyed) return;
    this.destroyed = true;
    this.app.stop();
    this.observer?.disconnect();
    cancelAnimationFrame(this.resizeFrame);
    this.options.canvas.removeEventListener('pointermove', this.pointerMove);
    this.options.canvas.removeEventListener('pointerdown', this.pointerDown);
    this.options.canvas.removeEventListener('webglcontextlost', this.contextLost);
    this.options.canvas.removeEventListener('webglcontextrestored', this.contextRestored);
    this.internal.off('beforeModelUpdate', this.beforeUpdate);
    this.app.stage.removeChild(this.model);
    try {
      this.model.destroy();
    } finally {
      try {
        await Assets.unload(this.textureUrls);
      } finally {
        destroyApplication(this.app, this.options.canvas);
      }
    }
  }
}
