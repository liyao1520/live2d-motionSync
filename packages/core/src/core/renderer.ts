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
  private model: Live2DModel;
  private app: Application;
  private modelRatio: number = 1;
  constructor(
    private readonly onRenderBefore: () => void,
    private readonly loadLive2DModel: () => Promise<typeof Live2DModel>
  ) {}
  async render(
    canvas: HTMLCanvasElement,
    options: IRenderOptions
  ): Promise<Live2dRender> {
    this.onRenderBefore();
    const { modelURL, autoInteract, ...rest } = options;
    if (autoInteract) {
      const { InteractionManager } = await import("@pixi/interaction");
      extensions.add(InteractionManager);
    }
    const app = new Application({
      view: canvas,
      resizeTo: canvas.parentElement,
      ...rest,
    });

    const MotionSync = await import("./core").then((m) => m.MotionSync);

    const Live2DModel = await this.loadLive2DModel();

    // 在新版本中，Ticker通常会自动注册，如果仍需要手动注册
    if (Live2DModel.registerTicker) {
      Live2DModel.registerTicker(Ticker);
    }

    const model = await Live2DModel.from(modelURL, {
      autoInteract: autoInteract,
    });

    const motionSync = new MotionSync(model.internalModel);
    await motionSync.loadMotionSync();

    app.stage.addChild(model);

    this.model = model;
    this.app = app;

    this.modelRatio = model.width / model.height;
    this.centerModel();

    return {
      app,
      motionSync,
      model,
    };
  }
  centerModel() {
    if (!this.model) return;
    const { app, model } = this;

    model.height = app.view.height;
    model.width = model.height * this.modelRatio;
    model.x = app.view.width / 2 - model.width / 2;
    model.y = app.view.height / 2 - model.height / 2;
  }
}
