import React, { useEffect, useRef } from "react";
import renderer, { Live2dMotionSync } from "@live2d-motionsync/core";
export default function App() {
  const canvasRef = useRef(null);
  const live2dMotionSync = useRef<Live2dMotionSync | null>(null);
  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      live2dMotionSync.current = await renderer.render(canvas, {
        modelURL:
          "https://cdn.jsdmirror.com/gh/liyao1520/live2d-motionSync/examples/public/models/kei_vowels_pro/kei_vowels_pro.model3.json",
        backgroundAlpha: 0,
      });
      live2dMotionSync.current.enableAutoResize();
    };
    render();
    return () => {
      live2dMotionSync.current?.destroy();
    };
  }, []);
  const playAudio = () => {
    live2dMotionSync.current?.motionSync.play("");
  };
  const stopAudio = () => {
    live2dMotionSync.current?.motionSync.stop();
  };
  return (
    <div className="flex flex-col size-full overflow-hidden">
      <div className="h-[100px] bg-red-500 flex gap-2">
        <button onClick={playAudio}>play audio</button>
        <button onClick={stopAudio}>stop audio</button>
      </div>
      <div className="flex-1 w-full">
        <canvas className="size-full" ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
