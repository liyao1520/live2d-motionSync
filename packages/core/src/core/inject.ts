export function injectScript(script: string, id: string) {
  const hasScript = document.getElementById(id);
  if (hasScript) {
    return;
  }
  const scriptTag = document.createElement("script");
  scriptTag.id = id;
  scriptTag.type = "text/javascript";
  scriptTag.innerHTML = script;
  document.body.appendChild(scriptTag);
}
