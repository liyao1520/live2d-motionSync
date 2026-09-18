import { createPlayer } from '@live2d-motionsync/core';
const output = document.querySelector('output');
const controller = new AbortController();
let player;
window.addEventListener('pagehide', () => {
  controller.abort();
  void player?.destroy();
});
try {
  player = await createPlayer({
    canvas: document.querySelector('canvas'),
    model: '/models/kei_vowels_pro/kei_vowels_pro.model3.json',
    signal: controller.signal,
  });
  player.on('error', (e) => (output.textContent = e.message));
  document.querySelector('#play').disabled = false;
  document.querySelector('#play').onclick = async () => {
    try {
      await player.unlockAudio();
      await player.play('/demo.wav').finished;
    } catch (e) {
      output.textContent = e.message;
    }
  };
  document.querySelector('#stop').onclick = () => player.stop();
  output.textContent = '就绪';
} catch (e) {
  output.textContent = e.message;
}
