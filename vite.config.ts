import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "Live2dLipSync",
      fileName: (format) => `live2d-motionsync.${format}.js`,
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
