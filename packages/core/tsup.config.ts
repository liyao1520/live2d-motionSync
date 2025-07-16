import { defineConfig } from "tsup";
import path from "path";
import RawPlugin from "esbuild-plugin-raw";
export default defineConfig({
  entry: ["src/index.ts"],
  outDir: "dist",
  format: ["esm", "cjs"],
  dts: true,
  splitting: true,
  sourcemap: true,
  clean: true,
  esbuildOptions(options, context) {
    options.alias = {
      "@cubism": path.resolve(__dirname, "../../libs/cubism/src"),
    };
    options.plugins = options.plugins
      ? [...options.plugins, RawPlugin()]
      : [RawPlugin()];
  },
});
