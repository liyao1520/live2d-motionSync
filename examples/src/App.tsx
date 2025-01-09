import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { useEffect, useRef, useState } from "react";
import { MotionSync } from "../../dist/live2d-motionsync.es";
import { Button, Card, Input, Select, Space, Spin } from "antd";
import { modelMap } from "./models";
import { tts } from "./tts";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).PIXI = PIXI;
async function arrayBufferToAudioBuffer(arrayBuffer: ArrayBuffer) {
  // 创建 AudioContext 实例
  const audioContext = new AudioContext();

  // 使用 decodeAudioData 解码 ArrayBuffer
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return audioBuffer;
}
export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [text, setText] = useState("");
  const motionSync = useRef<MotionSync>();
  const modelName =
    new URLSearchParams(window.location.search).get("model") ||
    "kei_vowels_pro";
  const [loading, setLoading] = useState(false);

  const play = async () => {
    if (!motionSync.current) return;
    const buffer = await tts(text);
    const audioBuffer = await arrayBufferToAudioBuffer(buffer);
    motionSync.current.play(audioBuffer);
  };
  useEffect(() => {
    let app: PIXI.Application;
    let model: Live2DModel;
    const loadModel = async () => {
      if (!canvasRef.current) return;
      setLoading(true);
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
    };
    loadModel();
    return () => {
      app?.destroy();
      model?.destroy();
    };
  }, [modelName]);

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
      <div className="flex-1 flex flex-col gap-2 justify-center">
        <Card title="config" className="max-w-[600px]">
          <div className="flex flex-col gap-2">
            <div>select model:</div>
            <Select
              className="w-full"
              value={modelName}
              onChange={(value) => {
                window.location.href = `/?model=${value}`;
              }}
              options={Object.keys(modelMap).map((modelName) => ({
                label: modelName,
                value: modelName,
              }))}
            />
            <div>default text:</div>
            <Space>
              <Button
                type="primary"
                onClick={() =>
                  motionSync.current?.play("/live2d-motionSync/sayhi.wav")
                }
              >
                Play
              </Button>
              <Button danger onClick={() => motionSync.current?.reset()}>
                Stop
              </Button>
            </Space>
            <div>input text:</div>
            <Space>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="input text"
              />
              <Button type="primary" onClick={play}>
                Play
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    </div>
  );
}
