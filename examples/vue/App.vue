<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { createPlayer } from '@live2d-motionsync/core';
const canvas = ref(null),
  status = ref('加载中'),
  ready = ref(false);
const controller = new AbortController();
let player;
onMounted(async () => {
  try {
    const instance = await createPlayer({
      canvas: canvas.value,
      model: '/models/kei_vowels_pro/kei_vowels_pro.model3.json',
      signal: controller.signal,
    });
    if (controller.signal.aborted) {
      await instance.destroy();
      return;
    }
    player = instance;
    ready.value = true;
    status.value = '就绪';
    player.on('error', (e) => (status.value = e.message));
  } catch (e) {
    if (!controller.signal.aborted) status.value = e.message;
  }
});
onBeforeUnmount(() => {
  controller.abort();
  void player?.destroy();
});
async function play() {
  try {
    if (!player) return;
    await player.unlockAudio();
    await player.play('/demo.wav').finished;
  } catch (e) {
    status.value = e.message;
  }
}
</script>
<template>
  <div style="height: 70vh"><canvas ref="canvas" /></div>
  <button :disabled="!ready" @click="play">播放</button>
  <button @click="player?.stop()">停止</button><output>{{ status }}</output>
</template>
