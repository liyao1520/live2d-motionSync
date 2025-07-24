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
          "https://cdn.jsdmirror.com/gh/liyao1520/live2d-motionSync@main/docs/public/models/kei_vowels_pro/kei_vowels_pro.model3.json",
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
    live2dMotionSync.current?.motionSync.play(
      "https://cdn.jsdmirror.com/gh/liyao1520/live2d-motionSync@main/docs/public/demo.wav"
    );
  };
  const stopAudio = () => {
    live2dMotionSync.current?.motionSync.stop();
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100px",
          backgroundColor: "#f56565",
          display: "flex",
          gap: "0.5rem" /* gap-2 = 0.5rem */,
        }}
      >
        <button onClick={playAudio}>play audio</button>
        <button onClick={stopAudio}>stop audio</button>
      </div>
      <div style={{ flex: 1, width: "100%" }}>
        <canvas
          style={{ width: "100%", height: "100%" }}
          ref={canvasRef}
        ></canvas>
      </div>
    </div>
  );
}
