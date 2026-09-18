# Live2D MotionSync 2.0

One framework-independent TypeScript SDK for Live2D rendering, official MotionSync lip synchronization, files, MediaStream, and streaming PCM. Version **2.0.0-alpha.0** replaces the v1 API.

See the complete [Chinese guide](README_ZH.md), [examples](examples/README.md), and [validation matrix](docs/research/v2-validation.md).

```sh
pnpm install
pnpm build
pnpm dev
```

Requires Node 24.11+ and pnpm 10.30.3. The playground uses existing repository demo assets.

```ts
import { createPlayer } from '@live2d-motionsync/core';
const player = await createPlayer({ canvas, model: '/avatar/avatar.model3.json' });
button.onclick = async () => {
  await player.unlockAudio();
  await player.play('/hello.wav').finished;
};
// On unmount:
await player.destroy();
```

- play interrupts and clears pending work; enqueue is explicit FIFO for finite audio.
- Models can be a model3 URL, complete ZIP Blob, or a path-preserving file collection.
- PCM writers await write for backpressure; end drains; stop cancels.
- MediaStream analysis does not monitor/play back audio or stop caller-owned tracks.
- Background rendering stops, files pause internally, realtime audio is discarded.
- Official MotionSync requires a valid model configuration. Without one, auto uses amplitude-based fallback and reports its capability.
- Modern WebGL browsers are targeted. Chromium is tested; physical mobile devices and the complete Cubism 4/5 feature set are not yet certified.
- React/Vue/vanilla examples consume the same SDK. SSR imports work; creation is client-only.

Core scripts are bundled lazily; consumers do not copy runtime files. **Public npm redistribution of proprietary Live2D runtimes remains unconfirmed and publishing is gated.** Local tgz installation is tested, not a statement of redistribution permission. See [third-party notices](packages/core/THIRD_PARTY_NOTICES.md) and [runtime research](docs/research/v2-runtime-distribution.md).
