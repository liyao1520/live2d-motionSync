# Third-party notices

The MIT license at the package root applies to this project's original code. It does not relicense the proprietary runtimes, upstream-derived algorithms, or sample models.

- **Live2D Cubism Core 5-r.4**: Copyright Live2D Inc. Unmodified upstream JavaScript is encoded as a string in a lazy chunk and executed in the browser. See `licenses/cubism-Core-LICENSE.md`, `cubism-NOTICE.md`, and the [Proprietary Software License](https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html).
- **Cubism MotionSync Core / CRI 5-r.2**: Copyright Live2D Inc. and CRI Middleware. Unmodified runtime, separately licensed. See `licenses/motionsync-Core-LICENSE.md`, `motionsync-Core-CRI-LICENSE.md`, `motionsync-NOTICE.md` and the links therein.
- **CubismWebMotionSyncComponents 5-r.2**, commit `b16600aba6f367b50bda8b4cf901725dbc6e3631`: the ABI integration and smoothing/damping implementation in `src/lipsync/native.ts` adapt the upstream algorithm to a numeric parameter boundary. Governed by the [Live2D Open Software License](https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html). Adaptations: independent context ownership, bounded PCM windows, reusable allocations and validation; no second Cubism Framework singleton. Upstream [source](https://github.com/Live2D/CubismWebMotionSyncComponents/tree/5-r.2).
- **untitled-pixi-live2d-engine 1.3.5**, **PixiJS 8.20.1**, **fflate 0.8.2** are npm dependencies with their own license files. Cubism-derived parts inside the renderer retain their upstream license terms.

Demo models/audio are repository development assets, excluded from this npm package; their upstream usage terms remain applicable.

This development build is not confirmation that a general-purpose public npm distribution of the bundled proprietary runtimes is authorized. Publication remains gated by `vendor/runtime-manifest.json` in the source repository. See `docs/research/v2-runtime-distribution.md` before release.
