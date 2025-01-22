import asset from "../assets/live2dcubismmotionsynccore.js?raw";

function injectScript(script: string) {
  if (document.getElementById("live2dcubismmotionsynccore")) return;
  const scriptTag = document.createElement("script");
  scriptTag.id = "live2dcubismmotionsynccore";
  scriptTag.type = "text/javascript";
  scriptTag.innerHTML = script;
  document.body.appendChild(scriptTag);
}

injectScript(asset);
