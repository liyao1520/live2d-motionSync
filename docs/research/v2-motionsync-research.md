# 2.0 MotionSync 官方组件调研

调研日期：2026-09-16。范围：官方 Web MotionSync Framework、示例、Core 分发边界与本仓库差异。以下“事实”为源码或一手文档直接支持，“建议/推断”不是已验证实现，“PoC”为实施前验证项。

## 结论

建议沿用官方 MotionSync 分析能力，以 Web `5-r.2` 为可追踪基线，重建音频输入、调度、参数写入与资源管理。不要照搬整个官方 Sample，也不要将“替换最新 MotionSync 文件”作为主要升级收益：当前仓库核心分析框架已经非常接近官方现行源码。真正需要重做的是产品 API 和浏览器音频管线。

## 最新版本与依赖（事实）

- Web 最新公开 tag 为 `5-r.2`，发布日期 2025-03-27；tag SHA 为 `b16600aba6f367b50bda8b4cf901725dbc6e3631`。本次源码检查的 develop HEAD 为 `d974ec56bd1534bd365ed4d50fdbbe6d52660124`。官方 2026-08-25 的 R2_1 公告只列 Native、Unity，不能当作 Web 的新版。[CHANGELOG](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/CHANGELOG.md)、[官方 SDK 公告](https://docs.live2d.com/en/cubism-sdk-manual/top/)
- Framework 依赖 Cubism SDK for Web 中的 model、id、vector、数学与 JSON 组件；README 验证环境列的是 Cubism 5 SDK for Web R3。这不等于官方保证与 R5 或任意第三方渲染框架兼容。[README](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/README.md)
- MotionSync Core 未包含在 GitHub，必须从官方分发包取得。插件版本与 Core 内部引擎版本是两个概念；这次没有下载分发包或执行 `csmMotionSyncGetEngineVersion()`，不能声称仓库中二进制已经升级或确定其版本。[官方说明](https://docs.live2d.com/en/cubism-sdk-manual/cubism-sdk-motionsync-plugin-for-web/)

## 音频与实时输入（事实）

- CRI processor 接收创建时指定的 PCM 采样率，源码校验范围为 16,000–128,000 Hz。48 kHz 是官方示例常量，不是唯一支持值。[engine](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Framework/src/cubismmotionsyncenginecri.ts)
- `.motionsync3.json` 的 `SampleRate` 在 `updateParameters()` 中作为每秒分析更新次数使用，例如 30；它不是 PCM 的 48,000 Hz。2.0 API 必须区分 `analysisFps` 与 `sampleRate`。[分析主循环](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Framework/src/live2dcubismmotionsync.ts)
- 底层可以通过 `setSoundBuffer(processIndex, csmVector<number>, startIndex)` 接收 PCM，再读取 `getLastTotalProcessedCount()` 回收已消费样本；分析窗口大小由 processor/Core 的 `getRequireSampleCount()` 决定，不能假定总是 128 帧。[分析主循环](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Framework/src/live2dcubismmotionsync.ts)
- R2 把输入抽象成 `ILAppAudioBufferProvider`；麦克风示例通过 `getUserMedia` → `MediaStreamAudioSourceNode` → `AudioWorkletNode` → 消息 → 环形缓冲。因而实时 PCM 在机制上可行，但官方没有替本项目提供完整的 WebSocket/TTS 流式播放 API。[输入实现](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Samples/TypeScript/Demo/src/lappinputdevice.ts)
- 官方文件示例采用预读取 WAV PCM 和 `HTMLAudioElement` 播放；其 WAV 限制属于示例，不是“分析引擎只能支持 WAV”。浏览器解码成 PCM 后支持哪些压缩格式，应由浏览器解码能力和我们的输入层界定。[文件输入](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Samples/TypeScript/Demo/src/lappmotionsyncaudiomanager.ts)
- 官方 README/NOTICE 仍记录 macOS Safari 麦克风回放异常，不能直接承诺所有浏览器一致。[NOTICE](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/NOTICE.md)

## 不宜照抄的示例细节（源码事实及推断）

源码事实：`lappinputdevice.ts` 从音轨 settings 推定采样率（缺省 48 kHz），却创建未指定采样率的 AudioContext；环形缓冲只容纳约 2 个 30 fps 帧；其 `update()`、`release()` 直接抛出未实现异常。`updateMotionSyncForProvider()` 把 `performance.now()/1000` 绝对值当作 `deltaTimeSeconds` 传入。文件示例按 performance 时间累计播放位置。以上可在 [input](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Samples/TypeScript/Demo/src/lappinputdevice.ts) 和 [model](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Samples/TypeScript/Demo/src/lappmotionsyncmodel.ts) 复核。

推断：采样率不一致、标签页节流、暂停恢复和清理需要独立设计，不能因为代码来自官方 Sample 就视为生产级保障。

## 模型配置与参数生效时机

事实：官方读取 `.model3.json` 的 `FileReferences.MotionSync`，配置中描述音频特征到模型参数的映射；缺失文件不会自动获得完整母音模型。Framework 对找不到的参数跳过写入。官方 Sample 在 physics、pose 之后调用 MotionSync，随后 `_model.update()`。每个渲染帧即使尚未到分析间隔，也会重写上一组平滑参数以避免被其他更新覆盖。[model](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Samples/TypeScript/Demo/src/lappmotionsyncmodel.ts)、[Framework](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/Framework/src/live2dcubismmotionsync.ts)

建议：新渲染器必须有稳定的“动画/表情/物理更新之后，Core update 之前”的参数钩子，或可明确控制帧管线。默认口型拥有相关嘴部参数的最终写入权，同时提供权重/覆盖策略；不能依赖替换内部 `motionManager.update` 的补丁。

建议：缺少 `.motionsync3.json` 时，`auto` 模式先查模型 LipSync 参数组、再查明确存在的嘴巴开合参数，使用 RMS/包络做基础开合；`motionsync` 严格模式返回可解释错误；允许用户提供显式映射。没有 A/I/U/E/O 形变的模型无法通过库凭空生成母音形状。基础振幅口型应清楚标为降级，而非与官方母音分析等价。

## 与本仓库比较

事实：检查 `packages/core/src/motionsync` 与上述 develop 的 `Framework/src`，15 个文件 diff 共 182 additions / 197 deletions，差异量包括引号/逗号/导入别名。`live2dcubismmotionsync.ts` 主算法 diff 仅见别名、格式和两个 `@ts-ignore`；`cubismmotionsyncdatajson.ts` 查看也以格式变化为主。故暂不支持“现有分析算法比官方落后一代”的判断，实施时应做正规逐文件语义 diff。

本仓库直接可见的问题：

| 位置 | 事实 | 2.0 处理建议 |
|---|---|---|
| `packages/core/src/core/core.ts` | 创建 processor 默认固定 48 kHz，解码 AudioBuffer 使用自身 sampleRate | 使用真实解码/采集采样率，或明确重采样；切换源时重建/重置 processor |
| 同上 `removeProcessedData` | 只有消费数小于缓冲长度才移除；相等时不清空 | 有界环形 PCM 缓冲，正确处理全量消费及残余 |
| 同上 `modelUpdateWithMotionSync` | 替换内部 `motionManager.update`，用 any 绕过类型 | 渲染 adapter 的公开帧阶段钩子，销毁时注销 |
| 同上 `loadMotionSync` | 无配置直接使用通用 fallback | 检查真实参数能力，发出降级事件 |
| `packages/core/src/core/audio.ts` | 模块导入就创建 AudioContext；`typeof window === undefined` 比较错误；全局手势监听不清理 | 懒初始化、SSR 安全、可恢复手势激活、明确 context 所有权 |
| `packages/core/src/assets/fallback.motionsync3.json` | 固定含 ParamMouthOpenY、ParamA/I/U… | 不把不存在的参数当作母音支持 |
| `packages/core/src/assets/live2dcubismmotionsynccore.js` | 自带专有 Core，文件开头含 ts-nocheck | 记录 Core 来源/版本/hash，分离授权边界；不能从文件名推断版本 |

## 分发许可边界（仅据官方条款）

Framework 使用 Live2D Open Software License；Core 使用 Live2D Proprietary Software License，并非项目 MIT 许可的一部分。专有协议第 5 条对可再分发代码规定附加主要功能、用户保护条款以及按官方提供原样分发等条件；第 6 条保留未明确授予的修改/分发权利。官方同时说明 CRI Lipsync 已由 Live2D 授权，不另收该插件的 CRI 使用费或要求 CRI logo。来源：[仓库 LICENSE](https://github.com/Live2D/CubismWebMotionSyncComponents/blob/5-r.2/LICENSE.md)、[专有协议](https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html)、[插件手册](https://docs.live2d.com/en/cubism-sdk-manual/cubism-sdk-motionsync-plugin-for-web/)。

初轮曾建议调用方通过 URL/自托管资源提供官方 Core；用户已明确否决此方案作为默认入口，要求 npm 安装后即用。当前转为核查 npm 包内置 Core 的具体分发条件与自动资源加载；自定义 URL 仅可作为高级覆盖能力。不能由“GitHub 不包含 Core”直接推出“所有 CDN 均禁止”，也不能由“有再分发条款”推出“允许任意 npm 重打包”。

## 2.0 音频架构建议与 PoC 门槛

建议用统一 AudioSession 管理 AudioContext、输入与 PCM 时钟；解码音频按实际音频时钟消费，MediaStream/流式 PCM 通过时间戳及有界缓冲消费。分析与渲染解耦：分析固定频率输出最新 mouth frame，渲染每帧施加结果。默认主线程分析、Worklet 只处理实时采集/播放；是否迁移分析到 Worker 取决于性能实测，不应预设 SharedArrayBuffer/跨域隔离为接入前提。

应配置：分析频率、输入采样率/声道下混、增益、静音门限、平滑、松弛归零时间、嘴部权重、映射、同步偏移、缓冲上限、溢出策略、监控回放、输出音量与 AbortSignal。对外区分 `play`、`attachStream`、`createPcmStream`，每次播放返回可取消的 session，避免布尔位置参数。

实施前必须 PoC 验证：

1. 新渲染器参数钩子在动画、表情、physics 同时存在时仍生效，且不额外调用两次 Core update。
2. 官方 R2 Framework 与选定 Cubism SDK/Core 组合的类型及实际模型兼容性；确认 Core 运行时版本。
3. 16/24/44.1/48 kHz、双声道、长静音及短尾 PCM，检查是否有重采样和残余丢失。
4. 暂停、seek、变速、后台恢复、流式断流/恢复；记录音画偏移，而非仅观察能否动嘴。
5. 无 motionsync3、无母音参数、无任何嘴部参数三类模型的可解释能力报告。
6. 多模型、连续打断和销毁重建的内存/监听器/音轨/Core context 回收；Safari/iOS 实机音频激活与实时输入。
7. 检查官方 `cubismmotionsyncenginelib.ts` 每窗口数组复制与 WASM malloc/free 对 p95 帧耗时的影响；只有实测出现瓶颈再做可追踪的上游补丁。

以上未执行浏览器性能与同步精度测试，不把架构建议当作已证实的性能提升。
