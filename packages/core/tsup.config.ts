import { defineConfig } from "tsup";
import path from "path";
import { raw } from "esbuild-raw-plugin";
import pkg from "./package.json";
export default defineConfig([
  {
    entry: ["src/index.ts", "!**/*?raw"],
    target: "es2022",
    platform: "browser",
    treeshake: true,
    minify: true,
    dts: true,
    external: ["react", "react-dom"],
    noExternal: [...Object.keys(pkg.dependencies || {})],
    clean: true,
    outDir: "dist/sandpack",
    esbuildPlugins: [raw()],
    esbuildOptions(options, context) {
      options.alias = {
        "@cubism": path.resolve(__dirname, "../../libs/cubism/src"),
      };
    },
  },
  {
    entry: ["src/index.ts", "!**/*?raw"],
    target: "es2022",
    platform: "browser",
    treeshake: true,
    format: ["esm", "cjs"],
    minify: true,
    dts: true,
    external: ["react", "react-dom"],
    clean: true,
    outDir: "dist",
    esbuildPlugins: [raw()],
    esbuildOptions(options, context) {
      options.alias = {
        "@cubism": path.resolve(__dirname, "../../libs/cubism/src"),
      };
    },
  },
]);
