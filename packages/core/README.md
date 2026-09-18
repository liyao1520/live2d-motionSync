# @live2d-motionsync/core 2.0

Framework-independent Live2D rendering, official MotionSync and audio playback. Breaking replacement for the v1 API.

```ts
import { createPlayer } from '@live2d-motionsync/core';
const player = await createPlayer({ canvas, model: '/avatar/avatar.model3.json' });
button.onclick = async () => {
  await player.unlockAudio();
  await player.play('/hello.wav').finished;
};
// On unmount: await player.destroy();
```

The canvas parent needs a nonzero size. Create the player on the browser client; unlock audio in a user gesture. Core scripts are lazily bundled, with no manual asset copying.

Use play for interruption, enqueue for explicit FIFO, stop to cancel and clear the queue. createPcmStream accepts raw f32/s16le PCM with awaited writes for backpressure. attachStream analyzes a caller-owned MediaStream without monitoring or stopping its tracks. Models can be a model3 URL, complete ZIP Blob, or path-preserving files.

See the [source repository](https://github.com/liyao1520/live2d-motionSync) for the Chinese API guide, JS/React/Vue examples, and exact validation matrix. Chromium core workflows are tested; physical mobile devices and all Cubism 4/5 features are not yet certified.

**This alpha is a local development build, not a public release.** Public npm redistribution of bundled proprietary Live2D runtimes remains unconfirmed. Local tgz installation is tested. See [third-party notices](THIRD_PARTY_NOTICES.md); the project MIT license does not relicense the proprietary Core or upstream-derived code.
