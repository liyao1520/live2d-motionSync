import script from "./assets/live2dcubismmotionsynccore?raw";

// 注入live2dcubismmotionsynccore脚本
export function injectScript() {
  if (document.getElementById("live2dcubismmotionsynccore")) return;
  const scriptTag = document.createElement("script");
  scriptTag.id = "live2dcubismmotionsynccore";
  scriptTag.type = "text/javascript";
  scriptTag.innerHTML = script;
  document.body.appendChild(scriptTag);
}
