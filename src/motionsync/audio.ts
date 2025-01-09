let audioContext: AudioContext;

export function initAudioContext() {
  const events = ["click", "keydown", "touchstart", "mousedown", "pointerdown"];
  audioContext = new AudioContext();
  const handler = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("Audio context resumed");
      });
    }
  };
  events.forEach((event) => {
    window.addEventListener(event, handler, { capture: true });
  });
}

export function getAudioContext() {
  return audioContext;
}
