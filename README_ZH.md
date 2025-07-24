# live2d-motionsync

[中文文档](README_ZH.md)

一个 live2d 的 motionsync 库

![demo](./static/demo.gif)

[codesandbox demo](https://codesandbox.io/p/sandbox/5yyr55?file=%2Fpackage.json%3A16%2C23)

## 提前准备

1. **仅支持 Cubism 4 模型**

2. **模型需要支持 motionsync3**

   参考:https://docs.live2d.com/en/cubism-editor-manual/motion-sync/

## 安装

```bash
npm install live2d-motionsync
```

## 使用

普通音频

```ts
import { MotionSync } from "live2d-motionsync";
```

媒体流

```ts
import { MotionSync } from "live2d-motionsync/stream";
```

提前安装 `pixi-live2d-display`

```bash
npm install pixi-live2d-display pixi.js@6.5.10

```

```ts
import * as PIXI from "pixi.js";
import { Live2DModel } from "pixi-live2d-display";
import { MotionSync } from "live2d-motionsync";

// expose PIXI to window so that this plugin is able to
// reference window.PIXI.Ticker to automatically update Live2D models
window.PIXI = PIXI;

(async function () {
  const app = new PIXI.Application({
    view: document.getElementById("canvas"),
  });

  const model = await Live2DModel.from("kei_vowels_pro.model3.json");

  // 初始化 motionsync
  const motionSync = new MotionSync(model.internalModel);
  // 加载 motionsync 文件
  motionSync.loadMotionSyncFromUrl("kei_vowels_pro.motionsync3.json");
  // 没有 motionsync3 文件可以加载默认 motionsync3 配置
  // motionSync.loadDefaultMotionSync();

  // 确保已经页面交互
  // 播放音频
  motionSync.play("/audio/test.wav").then(() => {
    console.log("播放完毕");
  });
  // 停止音频
  // motionSync.reset();

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

## MotionSync API

### 构造函数

#### `constructor(internalModel: any)`

初始化 `MotionSync` 类的新实例。

- **参数:**

  - `internalModel`: 包含核心模型和其他必要组件的内部模型对象。

- **描述:**
  - 该构造函数使用提供的 `internalModel` 初始化 `MotionSync` 类，并启动和初始化 `CubismMotionSync` 框架。

### `async play(src: string | AudioBuffer): Promise<void>`

- **返回值:**

  - `Promise<void>`: 一个 Promise，当音频完整播放完毕时，Promise 会完成。

- **参数:**

  - `src`: 音频源，可以是 URL 字符串或 `AudioBuffer` 对象。

- **描述:**

  - 该方法从给定的源加载音频并开始播放。返回一个在音频播放结束时解析的 Promise。

### `reset()`

将 `MotionSync` 实例重置为初始状态。

- **描述:**
  - 该方法停止任何正在进行的音频播放，重置嘴部状态。

### `loadMotionSync(buffer: ArrayBuffer, samplesPerSec = SamplesPerSec)`

从 `ArrayBuffer` 加载运动同步数据。

- **参数:**

  - `buffer`: 包含运动同步数据的 `ArrayBuffer`。
  - `samplesPerSec`: 音频数据的采样率（默认为 48000）。

- **描述:**
  - 该方法使用提供的运动同步数据初始化 `CubismMotionSync` 实例。

### `async loadDefaultMotionSync(samplesPerSec = SamplesPerSec)`

加载默认的运动同步数据。

- **参数:**

  - `samplesPerSec`: 音频数据的采样率（默认为 48000）。

- **描述:**
  - 该方法从预定义的 URL 加载默认的运动同步数据。

### `async loadMotionSyncFromUrl(url: string, samplesPerSec = SamplesPerSec)`

从 URL 加载运动同步数据。

- **参数:**

  - `url`: 运动同步数据的 URL。
  - `samplesPerSec`: 音频数据的采样率（默认为 48000）。

- **描述:**

  - 该方法从指定的 URL 获取运动同步数据并初始化 `CubismMotionSync` 实例。如果获取失败，则回退到加载默认的运动同步数据。

## MotionSync Stream

```ts
import { MotionSync } from "live2d-motionsync/stream";

const motionSync = new MotionSync(model.internalModel);
motionSync.loadMotionSyncFromUrl("kei_vowels_pro.motionsync3.json");
const mediaStream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});
motionSync.play(mediaStream);

function stop() {
  motionSync.reset();
  mediaStream.getTracks().forEach((track) => track.stop());
}

// stop()
```

- [pixi-live2d-display](https://github.com/pixijs/pixi-live2d-display)
