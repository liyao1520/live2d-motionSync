import live2dMotionsync from "@live2d-motionsync/core";
import type { Live2dRender } from "@live2d-motionsync/core";
import { useRef } from "react";
import { useAsyncEffect } from "ahooks";
export default function Test1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const live2dRenderer = useRef<Live2dRender>(null);
  useAsyncEffect(async () => {
    if (!canvasRef.current) return;
    live2dRenderer.current = await live2dMotionsync.render(canvasRef.current, {
      modelURL: "/kei_vowels_pro/kei_vowels_pro.model3.json",
      backgroundAlpha: 0,
      autoInteract: true,
    });
  }, []);
  return (
    <div className="flex size-full items-center justify-center">
      <div className="size-full">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
