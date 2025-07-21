import { defineConfig } from "tsup";
import path from "path";
import { raw } from "esbuild-raw-plugin";
export default defineConfig({
  entry: ["src/index.ts", "!**/*?raw"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: false,
  clean: true,
  minify: false,
  esbuildPlugins: [raw()],
  esbuildOptions(options, context) {
    options.alias = {
      "@cubism": path.resolve(__dirname, "../../libs/cubism/src"),
    };
  },
});
