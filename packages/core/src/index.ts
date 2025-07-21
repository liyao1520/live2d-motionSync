import { injectScript } from "./core/inject";
import { Live2dRenderer } from "./core";
import script1 from "./assets/live2d.min.js?raw";
import script2 from "./assets/live2dcubismcore.min.js?raw";
import script3 from "./assets/live2dcubismmotionsynccore.min.js?raw";

const renderer = new Live2dRenderer(
  () => {
    injectScript(script1, "live2d-min");
    injectScript(script2, "live2dcubismcore-min");
    injectScript(script3, "live2dcubismmotionsynccore");
  },
  () => import("pixi-live2d-display").then((m) => m.Live2DModel)
);

export default renderer;

export type * from "./core";
