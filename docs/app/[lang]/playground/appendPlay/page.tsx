"use client";
import React, { useEffect, useRef } from "react";
import renderer, { Live2dMotionSync } from "@live2d-motionsync/core";
const BASE_URL =
  "https://cdn.jsdmirror.com/gh/liyao1520/live2d-motionSync@main/docs/public";
export default function App() {
  const canvasRef = useRef(null);
  const live2dMotionSync = useRef<Live2dMotionSync | null>(null);

  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      live2dMotionSync.current = await renderer.render(canvas, {
        modelURL: `${BASE_URL}/models/kei_vowels_pro/kei_vowels_pro.model3.json`,
        backgroundAlpha: 0,
      });
      live2dMotionSync.current.enableAutoResize();
    };
    render();
    return () => {
      live2dMotionSync.current?.destroy();
    };
  }, []);
  const playAudio = async () => {
    const audios = [
      `${BASE_URL}/clip/1.wav`,
      `${BASE_URL}/clip/2.wav`,
      `${BASE_URL}/clip/3.wav`,
    ];
    for (const audio of audios) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      live2dMotionSync.current?.motionSync.appendPlay(audio);
    }
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
      <div className="flex justify-center gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
          onClick={playAudio}
        >
          play audio
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={stopAudio}
        >
          stop audio
        </button>
      </div>
      <div style={{ flex: 1, width: "100%", overflow: "hidden" }}>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
