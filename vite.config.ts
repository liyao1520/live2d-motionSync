import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    // console
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    lib: {
      entry: ["./src/index.ts", "./src/stream.ts"],
      name: "Live2dLipSync",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        return `${entryName}.${format}.js`;
      },
    },
  },
  plugins: [dts({ rollupTypes: true })],
});
