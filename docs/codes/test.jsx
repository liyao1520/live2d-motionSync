import React, { useEffect, useRef } from "react";
import live2dMotionsyncCore from "@live2d-motionsync/core";
export default function App() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      await live2dMotionsyncCore.render(canvas, {
        modelURL:
          "https://cdn.jsdelivr.net/gh/liyao1520/live2d-motionSync/examples/public/models/kei_vowels_pro/kei_vowels_pro.model3.json",
        backgroundAlpha: 0,
      });
    };
    render();
  }, []);
  return (
    <canvas style={{ width: "100%", height: "100%" }} ref={canvasRef}></canvas>
  );
}
