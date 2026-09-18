# Live2D MotionSync 2.0

框架无关的 TypeScript SDK：模型渲染、官方 MotionSync 口型、音频播放和流式输入使用同一个 Player。2.0 不兼容旧 API。

当前版本：**2.0.0-alpha.0**。已在 Chromium 上验证核心流程和独立 npm 打包接入。移动端 Safari/Android 真机、全部 Cubism 4/5 特性尚未完成验收，详见 [验证矩阵](docs/research/v2-validation.md)。

## 本地启动

需要 Node 24.11+、pnpm 10.30.3：

```sh
pnpm install
pnpm build
pnpm dev
```

打开 http://localhost:5173。模型和音频使用仓库现有演示资产；可导入自己的模型 ZIP 或目录。
`pnpm docs` 启动文档站；JS、React、Vue 的完整项目位于 [examples](examples/README.md)。

## 最小接入

```ts
import { createPlayer } from '@live2d-motionsync/core';

const player = await createPlayer({
  canvas: document.querySelector('canvas')!,
  model: '/models/avatar/avatar.model3.json',
});

player.on('error', (error) => console.error(error.code, error.message));

button.onclick = async () => {
  await player.unlockAudio(); // 在用户点击中解锁浏览器音频
  const playback = player.play('/hello.wav');
  const result = await playback.finished;
  // result.status: completed | cancelled；播放失败时 Promise reject
};

await player.destroy(); // 页面/组件卸载时调用；可重复调用
```

canvas 的父容器必须有非零宽高。初始化成功后自动渲染并跟随容器大小调整。每个 canvas 同时只能归一个 Player；销毁后可以复用。SSR 可以导入类型和包，`createPlayer` 必须在客户端执行。

消费者只安装 SDK，不需要单独引入 Pixi、下载 Core、复制脚本或编写渲染循环。Core 以原始脚本内容打入延迟加载块，使用 Blob URL 初始化。严格 CSP 环境需要允许 Blob 脚本、WASM、Blob 图片/Worker，或通过 `runtime` 配置自托管地址；网络模型/音频仍需要正确 CORS。

**发布状态**：本地 tgz 安装和生产打包已经验证；尚未公开发布。Live2D 两个专有 Core 随通用 npm 库公开再分发的许可条件仍需确认，`prepublishOnly` 会阻止未经确认的发布。详见 [运行时分发调研](docs/research/v2-runtime-distribution.md) 和 [第三方声明](packages/core/THIRD_PARTY_NOTICES.md)。不能将项目 MIT 许可理解为 Core 也使用 MIT。

## 播放、打断和排队

```ts
await player.unlockAudio();
const a = player.play('/first.wav'); // 打断当前输入，并清空待播队列
const b = player.enqueue('/second.wav'); // 有限音频，FIFO；空闲时立即播放
b.stop(); // 只取消 b
player.stop(); // 停止当前输入，并清空全部队列
```

音频来源支持 URL、Blob/File 和 AudioBuffer。失败会触发 error 事件并拒绝该会话的 finished；队列继续处理下一项。取消属于正常结果。旧会话的 stop 或延迟回调不会停止新会话。

首发不暴露暂停、跳转、变速、音量控制。浏览器切后台时内部自动暂停文件播放，恢复前台后续播；如果浏览器再次锁定音频，收到 waiting-for-gesture 后由点击重新调用 unlockAudio。

## 流式 PCM

```ts
await player.unlockAudio();
const speech = player.createPcmStream({
  sampleRate: 24000,
  channels: 1,
  format: 's16le',
});
for await (const chunk of ttsPcmChunks) {
  await speech.write(chunk); // 必须 await：遵守背压
}
await speech.end(); // 已排入的音频播放完后完成
// speech.stop() 立即打断
```

支持 16–128 kHz、单/双声道交错数据、f32 Float32Array 或 s16le Uint8Array/ArrayBuffer；双声道下混为单声道。输入必须是原始 PCM，不能直接写入 MP3/AAC 容器片段。每次最多 8 MiB，不允许并发 write。音频队列默认最多缓存 2 秒，可配置 0.1–30 秒；end 表示输入结束，stop 才是立即取消。

后台已调度数据和新写入数据会丢弃，不积压，也不在前台重放。这一策略允许实时 TTS 跟随实时位置，调用方应根据业务决定是否停止上游生成。播放时间来自 AudioContext 时钟。

## MediaStream

```ts
await player.unlockAudio();
const microphone = await navigator.mediaDevices.getUserMedia({ audio: true });
const session = player.attachStream(microphone);
session.stop();
microphone.getTracks().forEach((track) => track.stop()); // 调用方管理音轨
```

通过 AudioWorklet 分析输入，不回放麦克风，避免回声。需要 HTTPS 或 localhost。SDK 的 stop/destroy 只断开自己的音频节点，不关闭传入的音轨；WebRTC 音频亦可接入。后台不保留旧分析帧。

## 模型导入

```ts
const player = await createPlayer({
  canvas,
  model: { type: 'zip', file: zipFile },
});

// 多个 model3.json 时显式选择入口
model: { type: 'zip', file: zipFile, entry: '角色/avatar.model3.json' }

// 来自目录选择、拖拽文件或自定义文件系统的完整文件集合
model: {
  type: 'files',
  entry: 'avatar/avatar.model3.json',
  files: Array.from(input.files!).map(file => ({
    path: file.webkitRelativePath || file.name,
    file,
  })),
}
```

支持 Store/Deflate ZIP，保留目录、Unicode 和大小写；MotionSync 配置使用同一资源解析器。多个入口返回 MODEL_ENTRY_REQUIRED，details.candidates 提供候选。缺失 moc3、贴图或声明的配套资源返回 MISSING_RESOURCE。单独一个 model3.json/moc3 不是完整模型。

默认限制：压缩包 128 MiB、解压总量 384 MiB、4096 文件、单张贴图 4096² 像素。限制可由 imports 配置；贴图会先解码检查尺寸，不能替代上传服务端的文件安全校验。实例销毁或导入失败时撤销自己的 Blob URL。远程 ZIP 可先 fetch 为 Blob 再传入。

## 配置与模型交互

```ts
const player = await createPlayer({
  canvas,
  model,
  signal: abortController.signal,
  layout: { fit: 'contain', resolution: 2 },
  interaction: { lookAtPointer: true, hitTest: true, idle: true },
  lipSync: {
    mode: 'auto',
    gain: 1,
    smoothing: 0.6,
    silenceThreshold: 0.02,
    // setting: 'Vowels_CRI', // 对应 Settings[].Id
    // parameterIds: ['ParamMouthOpenY'], // 基础音量口型映射
  },
  audio: { maxBufferedSeconds: 2, maxQueueLength: 32, maxFileBytes: 64 * 1024 ** 2 },
});

console.log(player.capabilities.lipSync); // motionsync | amplitude | unavailable
const motion = player.model.motions[0];
if (motion) await player.model.playMotion(motion);
const expression = player.model.expressions[0];
if (expression) await player.model.setExpression(expression);
const off = player.on('hit', ({ areas }) => console.log(areas));
off();
```

auto 在模型存在有效 MotionSync 配置时使用官方 CRI Core；缺少配置才降级为基础音量口型。配置损坏不静默降级。无可用嘴部参数时 capabilities 为 unavailable，但仍可展示模型和播放音频。显式 motionsync 模式缺少配置会报错。

gain 和 silenceThreshold 作用于分析输入；smoothing 只控制基础音量包络。官方模式使用模型配置中的 Smooth、Damper、BlendRatio、Smoothing 和输出帧率 SampleRate。动作中的 Sound 不自动播放，避免两个音频时钟互相覆盖；使用 play 显式播放对应音频。

## 架构与验证

- packages/core：资源导入、渲染适配、音频会话、口型驱动、运行时加载；一个公开 SDK。
- apps/playground：集成调试页面；examples：三种框架接入；docs：Next 16/Fumadocs 文档。
- TypeScript strict、pnpm workspace、tsdown ESM/types、ESLint、Prettier、Vitest、Playwright、Changesets。
- 渲染依赖固定 Untitled 1.3.5 + Pixi 8.20.1；8.13.1 在真实浏览器测试中不能完成纹理上传。
- Cubism Core 5-r.4、MotionSync Core 5-r.2；运行时 SHA-256 在构建时校验。

```sh
pnpm check            # lint + types + 单元测试 + SDK 构建
pnpm exec playwright install chromium
pnpm test:browser     # 真模型、音频、ZIP、生命周期
pnpm build:examples
pnpm build:docs
pnpm test:examples    # 三种框架的生产页面检查
pnpm test:package     # 临时独立项目安装 tgz、生产构建、浏览器口型检查
```

调研与决策见 [2.0 方案](docs/research/v2-proposal.md)，实际交付和待验证项见 [验证矩阵](docs/research/v2-validation.md)。
