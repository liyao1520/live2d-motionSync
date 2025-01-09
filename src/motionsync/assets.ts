import asset from "../assets/live2dcubismmotionsynccore.js?raw";

function injectScript(script: string) {
  const scriptTag = document.createElement("script");
  scriptTag.type = "text/javascript";
  scriptTag.innerHTML = script;
  document.body.appendChild(scriptTag);
}

injectScript(asset);
