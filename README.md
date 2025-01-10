<!-- english docs -->

# live2d-motionsync

[中文文档](./README_ZH.md)

A live2d motionsync library

![demo](./static/demo.gif)

## Prerequisites

1. **Only support Cubism 4 models**

2. **Models need to support motionsync3**

   Reference: https://docs.live2d.com/en/cubism-editor-manual/motion-sync/

## Install

```bash
npm install live2d-motionsync
```

## Usage

1. Install `pixi-live2d-display`

```bash
npm install pixi-live2d-display pixi.js@6.5.10

```

```ts
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";

// expose PIXI to window so that this plugin is able to
// reference window.PIXI.Ticker to automatically update Live2D models
window.PIXI = PIXI;

(async function () {
  const app = new PIXI.Application({
    view: document.getElementById("canvas"),
  });

  const model = await Live2DModel.from("kei_vowels_pro.model3.json");

  // init motionsync
  const motionSync = new MotionSync(model.internalModel);
  // load motionsync file
  motionSync.loadMotionSyncFromUrl("kei_vowels_pro.motionsync3.json");
  // if no motionsync3 file, load default motionsync3 config
  // motionSync.loadDefaultMotionSync();

  // ensure page interaction
  // play audio
  motionSync.play("/audio/test.wav").then(() => {
    console.log("play end");
  });
  // stop audio
  // motionSync.stop();

  app.stage.addChild(model);

  // transforms
  model.x = 100;
  model.y = 100;
  model.rotation = Math.PI;
  model.skew.x = Math.PI;
  model.scale.set(2, 2);
  model.anchor.set(0.5, 0.5);

  // interaction
  model.on("hit", (hitAreas) => {
    if (hitAreas.includes("body")) {
      model.motion("tap_body");
    }
  });
})();
```

## API

### `constructor(internalModel: any)`

Initialize a new `MotionSync` instance.

- **Parameters:**

  - `internalModel`: The internal model object containing the core model and other necessary components.

- **Description:**
  - This constructor uses the provided `internalModel` to initialize the `MotionSync` class and start and initialize the `CubismMotionSync` framework.

### `async loadAudio(url: string)`

Load audio file from specified URL.

- **Parameters:**

  - `url`: The URL of the audio file to load.

- **Description:**
  - This method fetches the audio file from the given URL, decodes it, and stores it in the `audioBuffer` property. It also resets the current state of the `MotionSync` instance.

### `async loadAudioBuffer(audioBuffer: AudioBuffer)`

Load audio buffer directly.

- **Parameters:**

  - `audioBuffer`: The `AudioBuffer` object to load.

- **Description:**
  - This method sets the provided `AudioBuffer` as the current audio buffer and resets the `MotionSync` instance.

### `reset()`

Reset the `MotionSync` instance to its initial state.

- **Description:**
  - This method stops any ongoing audio playback and resets the mouth state.

### `async play(src: string | AudioBuffer): Promise<void>`

- **Return:**

  - `Promise<void>`: A Promise that resolves when the audio playback ends.

Play audio from specified source.

- **Parameters:**

  - `src`: The audio source, which can be a URL string or an `AudioBuffer` object.

- **Description:**

  - This method loads audio from the given source and starts playback. It returns a Promise that resolves when the audio playback ends.

### `loadMotionSync(buffer: ArrayBuffer, samplesPerSec = SamplesPerSec)`

Load motion sync data from `ArrayBuffer`.

- **Parameters:**

  - `buffer`: The `ArrayBuffer` containing the motion sync data.
  - `samplesPerSec`: The sample rate of the audio data (default is 48000).

- **Description:**
  - This method uses the provided motion sync data to initialize the `CubismMotionSync` instance.

### `async loadDefaultMotionSync(samplesPerSec = SamplesPerSec)`

Load default motion sync data.

- **Parameters:**

  - `samplesPerSec`: The sample rate of the audio data (default is 48000).

- **Description:**
  - This method loads the default motion sync data from a predefined URL.

### `async loadMotionSyncFromUrl(url: string, samplesPerSec = SamplesPerSec)`

Load motion sync data from URL.

- **Parameters:**

  - `url`: The URL of the motion sync data.
  - `samplesPerSec`: The sample rate of the audio data (default is 48000).

- **Description:**

  - This method fetches the motion sync data from the specified URL and initializes the `CubismMotionSync` instance. If the fetch fails, it falls back to loading the default motion sync data.

- [pixi-live2d-display](https://github.com/pixijs/pixi-live2d-display)
