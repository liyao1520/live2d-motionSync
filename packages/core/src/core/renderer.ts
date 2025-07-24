import type { Live2DModel } from "pixi-live2d-display";
import { Application, IApplicationOptions } from "@pixi/app";
import type { MotionSync } from "./core";
import { Ticker } from "@pixi/ticker";
import { extensions } from "@pixi/core";

import { TickerPlugin } from "@pixi/ticker";
// 使用新的扩展系统注册插件

extensions.add(TickerPlugin);

export interface IRenderOptions extends Partial<IApplicationOptions> {
  /**
   * live2d模型配置文件路径
   */
  modelURL: string;
  /**
   * 自动交互 默认 false
   */
  autoInteract?: boolean;
}

export interface Live2dRender {
  app: Application;
  motionSync: MotionSync;
  model: Live2DModel;
}

export class Live2dRenderer {
  constructor(
    private readonly onRenderBefore: () => void,
    private readonly loadLive2DModel: () => Promise<typeof Live2DModel>
  ) {}
  async render(canvas: HTMLCanvasElement, options: IRenderOptions) {
    this.onRenderBefore();
    const { autoInteract } = options;
    if (autoInteract) {
      const { InteractionManager } = await import("@pixi/interaction");
      extensions.add(InteractionManager);
    }

    const MotionSync = await import("./core").then((m) => m.MotionSync);

    const Live2DModel = await this.loadLive2DModel();

    // 在新版本中，Ticker通常会自动注册，如果仍需要手动注册
    if (Live2DModel.registerTicker) {
      Live2DModel.registerTicker(Ticker);
    }

    const live2dMotionSync = new Live2dMotionSync(
      canvas,
      options,
      Live2DModel,
      MotionSync
    );
    await live2dMotionSync.render();

    return live2dMotionSync;
  }
}

export class Live2dMotionSync {
  private readonly Live2DModel: typeof Live2DModel;
  private readonly MotionSync: typeof MotionSync;
  private readonly canvas: HTMLCanvasElement;
  private readonly options: IRenderOptions;
  public app: Application;
  public model: Live2DModel;
  public motionSync: MotionSync;
  public modelRatio: number;
  private resizeObserver: ResizeObserver;
  constructor(
    canvas: HTMLCanvasElement,
    options: IRenderOptions,
    Live2DModelConstructor: any,
    MotionSyncConstructor: any
  ) {
    this.canvas = canvas;
    this.options = options;
    this.Live2DModel = Live2DModelConstructor;
    this.MotionSync = MotionSyncConstructor;
    const { modelURL, autoInteract, ...rest } = options;
  }
  enableAutoResize() {
    if (this.resizeObserver) return;
    this.resizeObserver = new ResizeObserver(() => {
      this.centerModel();
    });
    this.resizeObserver.observe(this.canvas);
  }
  disableAutoResize() {
    this.resizeObserver.disconnect();
    this.resizeObserver = null;
  }
  async render() {
    const { modelURL, autoInteract, ...rest } = this.options;
    const app = new Application({
      view: this.canvas,
      resizeTo: this.canvas.parentElement,
      ...rest,
    });
    const model = await this.Live2DModel.from(modelURL, {
      autoInteract: autoInteract,
    });

    const motionSync = new this.MotionSync(model.internalModel);

    await motionSync.loadMotionSync();

    this.model = model;
    this.app = app;
    this.motionSync = motionSync;

    const bounds = model.getBounds();

    this.modelRatio = bounds.width / bounds.height;

    app.stage.addChild(model);

    setTimeout(() => {
      this.centerModel();
    }, 0);
  }

  centerModel() {
    const { app, model, modelRatio } = this;
    if (!app || !model) return;
    const devicePixelRatio = app.renderer.resolution;
    const appViewRatio = app.view.width / app.view.height;
    if (appViewRatio > modelRatio) {
      model.height = app.view.height / devicePixelRatio;
      model.width = model.height * modelRatio;
      model.x = app.view.width / devicePixelRatio / 2 - model.width / 2;
      model.y = 0;
    } else {
      model.width = app.view.width / devicePixelRatio;
      model.height = model.width / modelRatio;
      model.x = 0;
      model.y = app.view.height / devicePixelRatio / 2 - model.height / 2;
    }
  }

  /**
   * 清理资源
   */
  destroy() {
    if (this.app) {
      this.app.destroy(false, {
        baseTexture: true,
        children: true,
        texture: true,
      });
    }
    if (this.model) {
      this.model.destroy({
        baseTexture: true,
        children: true,
        texture: true,
      });
    }
    this.model = null;
    this.app = null;
  }
}
