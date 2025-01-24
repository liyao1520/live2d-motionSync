import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useRef, useState } from "react";
import { MotionSync } from "../../../src/motionsync/stream";
import { Button, Spin } from "antd";
import { modelMap } from "../models";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PIXI = PIXI;

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const motionSync = useRef<MotionSync>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let app: PIXI.Application;
    let model: Live2DModel;
    const loadModel = async () => {
      if (!canvasRef.current) return;
      setLoading(true);
      const modelName = "kei_vowels_pro";
      const modelUrl = modelMap[modelName];
      app = new PIXI.Application({
        view: canvasRef.current,
        resizeTo: canvasRef.current.parentElement || undefined,
        backgroundAlpha: 0,
      });
      model = await Live2DModel.from(modelUrl, { autoInteract: false });

      // 获取模型横纵比
      const modelRatio = model.width / model.height;
      const centerModel = () => {
        // 让模型height为画布一半
        model.height = app.view.height;
        model.width = model.height * modelRatio;
        model.x = (app.view.width - model.width) / 2;
        model.y = 0;
      };

      centerModel();
      app.stage.addChild(model as unknown as PIXI.DisplayObject);

      motionSync.current = new MotionSync(model.internalModel);
      motionSync.current.loadMotionSyncFromUrl(
        modelUrl.replace(/.model(.)?.json/, ".motionsync3.json")
      );
      setLoading(false);
      play();
    };
    loadModel();
    return () => {
      app?.destroy();
      model?.destroy();
    };
  }, []);
  const mediaStreamRef = useRef<MediaStream>();
  const play = async () => {
    if (!motionSync.current) return;
    mediaStreamRef.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    motionSync.current.play(mediaStreamRef.current);
  };

  const stop = () => {
    if (!motionSync.current) return;
    motionSync.current.reset();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
  };

  return (
    <div className="size-full flex">
      <div className="w-[600px] relative">
        <canvas ref={canvasRef} />
        {loading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Spin />
          </div>
        )}
      </div>
      <div className="flex-1 flex items-center justify-center gap-[20px]">
        <Button type="primary" onClick={play}>
          play
        </Button>
        <Button type="primary" onClick={stop}>
          reset
        </Button>
      </div>
    </div>
  );
}
