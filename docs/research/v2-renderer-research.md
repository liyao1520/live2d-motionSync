# 2.0 Live2D 渲染库选型调研

调研日期：2026-09-16。方法：读取项目一手 README、package.json、LICENSE 和浅克隆源码；没有执行候选库、性能压测或兼容性测试。下列版本是所检出 HEAD 中的包版本，不等于已核实的 npm latest。提交时间不能单独证明维护质量。

## 建议

优先对 **untitled-pixi-live2d-engine** 做正式接入 PoC，并以 **官方 CubismWebFramework** 为失败后的可控路线。增加 **@jannchie/pixi-live2d-display** 作为同轮对照候选。现有证据不足以宣布任何库性能最好或生产环境已可靠。

选择 Untitled 的理由是现代 Cubism/Pixi 8 定位明确，而且有准确的口型参数注入位置，不需要让本项目接管整个渲染器。2.0 应封装自己的 Runtime、AudioSession、ParameterWriter，业务 API 不暴露候选库 internalModel。渲染适配器隔离的目的是控制上游变动；首版只交付一个适配器，避免同时维护多个后端。

## 候选比较

| 候选 | 查到的版本/维护信号 | 渲染与模型 | 接入判断 |
| --- | --- | --- | --- |
| Untitled | package 1.3.5；HEAD `a46a6030de798e476edb711122aa8890653c1eed`，2026-07-19 | Pixi ^8.13.1；WebGL Render Pipe；README 声明 Cubism 2/3/4/5 | 首选 PoC；现代入口可以不带 Cubism 2。实际 5.3 特性仍需模型验收 |
| easy-live2d | package 0.4.4；HEAD `f2715591f550b03b19af255b232aaf73b6b1923d`，2026-05-10 | Pixi catalog ^8.9.1；Sprite 包装；model3.json；WebGL/WebGL2 | API 易用，但生命周期和许可冲突须先解决，暂不作为默认 |
| Jannchie fork | package 1.4.0；HEAD `157aefa0f5fcd47aea8dbcbbd54951810b3e0ab6`，2026-08-27 | Pixi peer ^8.0.0；README 仍主要说明 Cubism 2/4 | 有 beforeModelUpdate、Vitest/browser 测试配置，值得对照；最新 Cubism 能力不能仅凭版本号认定 |
| omniwaifu/pixi-live2d5 | package `v0.5.0-beta`；HEAD `2ca7328402006ab5ae41f954e7e2c618213e0262`，2026-07-29 | README 指定 Pixi 8.19+、WebGL2、Framework 5-r.5/Core 6.0.1；旧 moc3 尽力兼容 | R5 定位清晰；README 指导本地 checkout/link，交付与包分发成熟度待核验 |
| 官方 CubismWebFramework | HEAD `d4da0aa07e47d2c1e4f5fa7ea6047861ea5e5d0b`，2026-04-02，CHANGELOG 5-r.5 | 官方 WebGL 实现；README 声明 Cubism 5.3 兼容 | 无 Pixi 必需依赖，升级链路最直接；需自行实现加载、交互、缩放、资源生命周期等高层能力 |

来源：[Untitled package](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/package.json)、[Untitled README](https://github.com/Untitled-Story/untitled-pixi-live2d-engine)、[easy package](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/package.json)、[easy catalog](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/pnpm-workspace.yaml)、[Jannchie package](https://github.com/Jannchie/pixi-live2d-display/blob/157aefa0f5fcd47aea8dbcbbd54951810b3e0ab6/package.json)、[Jannchie README](https://github.com/Jannchie/pixi-live2d-display)、[omniwaifu README](https://github.com/omniwaifu/pixi-live2d5)、[官方 CHANGELOG](https://github.com/Live2D/CubismWebFramework/blob/d4da0aa07e47d2c1e4f5fa7ea6047861ea5e5d0b/CHANGELOG.md)、[官方 README](https://github.com/Live2D/CubismWebFramework)。

Pixi 8 支持 WebGPU **不代表这些 Live2D 适配层支持 WebGPU**。Untitled 仅注册 WebGLPipes；easy 的后端明确获取 WebGL 上下文；omni 明确要求 WebGL2。2.0 默认显式选择 WebGL，WebGPU 不应写入已支持范围。[Untitled Live2DModel](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/Live2DModel.ts)、[easy WebGLBackend](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/packages/core/src/rendering/WebGLBackend.ts)。

## 决定性源码发现

### Untitled：注入点合适，自带 lip sync 不是官方 MotionSync

现代模型每帧顺序为：主动作和并行动作 → saveParameters → 表情 → 自动眨眼/视线/呼吸 → 内置幅度口型 → physics → pose → **beforeModelUpdate** → coreModel.update → loadParameters。[CubismInternalModel.update](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/cubism/CubismInternalModel.ts)、[updateMotions](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/cubism-common/InternalModel.ts)。

- 事实：beforeModelUpdate 位于动画、表情、物理、pose 之后，Cubism 顶点更新之前；该事件无 dt 参数。
- 推断：将官方分析结果写入口型参数放在此处，正常路径不会被同帧动作/表情覆盖；末尾 loadParameters 会恢复保存的基线，防止普通 add 写入口型逐帧累积。必须避免在钩子中 saveParameters，否则可能污染基线。
- 待验证：钩子异常导致未执行恢复、同一模型被重复 render、隐藏模型更新、加载后的首帧以及 stop/结束帧的闭口行为。
- 取舍：物理已在之前计算，所以最终口型不能同帧参与物理。若业务模型需要口型驱动物理，须增加受控的 prePhysics 阶段或接受下一帧传播，不能暗中改变完整顺序。

`config.motionSync` 的注释是“等 motion 与 sound 均加载完再开始”，不是 Cubism MotionSync。内置音频分析读取 AnalyserNode 的时域数据再求强度，不能替代官方分析引擎；启用官方 MotionSync 时应关掉 `internalModel.lipSync`，音频播放也统一归本项目控制，避免重复播放、双重参数混合和多个 AudioContext。[config.ts](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/config.ts)、[SoundManager.ts](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/cubism-common/SoundManager.ts)。

依赖注意：README 称 @pixi/sound 可选，但 package.json 同时将其列入 dependencies 与 peerDependencies；不能宣称默认 npm 包没有音频依赖。其 Cubism 是维护者 fork 的子模块，固定提交 `8df84780f2aa1298f3b30965cdae143e049f3c8e`，不能将“支持 Cubism 5”等同于跟随官方最新 R5。[package](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/package.json)、[submodule](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/.gitmodules)。

### easy-live2d：持久覆盖易用，生命周期需重点验收

公开 setParameterValueById/Index 将值加入持久覆盖表，在动画/表情/effects/pose/physics 全部完成后、core update 之前应用，适合“保持某个参数”的应用；流式 MotionSync 可以每帧更新这些值，但需证明 ticker 顺序、停播后 clear 覆盖语义、与动画混合都符合需求。本次未找到与 Untitled 等价的公开最终逐帧事件。[Live2DModel](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/packages/core/src/model/Live2DModel.ts)、[ParameterOverrideMap](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/packages/core/src/model/ParameterOverrideMap.ts)。

destroy() 释放交互/ResizeObserver/纹理、将 model 置空、dispose context 后调用全局 CubismFramework.dispose()。这是“销毁一个模型是否破坏另一个”的源码风险信号，并非已复现缺陷。异步初始化靠首次 renderFrame 触发；ready Promise 的失败、destroy 与 load 并发、模型资源本身的释放完整性需 PoC。[Live2DSprite](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/packages/core/src/Live2DSprite.ts)。

### 其他候选的定位

Jannchie 同样提供 beforeModelUpdate，现代实现 save/update/load 顺序与 Untitled 相近。但参数过渡控制器本身也订阅该事件，本项目必须约定监听顺序与口型参数所有权。其 Vitest 与浏览器测试配置是维护工程证据，不代表本次已经跑通测试。[内部模型](https://github.com/Jannchie/pixi-live2d-display/blob/157aefa0f5fcd47aea8dbcbbd54951810b3e0ab6/src/cubism4/Cubism4InternalModel.ts)、[参数控制器](https://github.com/Jannchie/pixi-live2d-display/blob/157aefa0f5fcd47aea8dbcbbd54951810b3e0ab6/src/controllers/ParameterTransitionController.ts)。

omniwaifu 明确将支持面收敛到 Cubism 5 R5，要求额外托管 13 个 GLSL 文件；如选它，开箱即用封装必须连 shader URL 配置一起处理。[官方仓库说明](https://github.com/omniwaifu/pixi-live2d5)。原始 guansss 仍主要说明 Pixi 6；avgjs/pixi-live2d 已归档，不推荐作新默认。[原项目](https://github.com/guansss/pixi-live2d-display)、[avgjs](https://github.com/avgjs/pixi-live2d)。

## 许可证边界

Untitled 根 LICENSE 与 package 均 MIT；easy 根 LICENSE 是 MIT，但根及 core package.json 声明 MPL-2.0，存在冲突，需要维护者澄清，不能直接写“MIT 可用”作为选型依据。[Untitled LICENSE](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/LICENSE)、[easy LICENSE](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/LICENSE)、[easy package](https://github.com/Panzer-Jack/easy-live2d/blob/f2715591f550b03b19af255b232aaf73b6b1923d/package.json)。

包装库许可证不替代 Cubism Framework、Cubism Core、MotionSync Core、模型素材各自许可证。官方 Framework 属于 Cubism Components，LICENSE 引用 Live2D Open Software License 及 SDK 发布许可。此处只记录分层事实，具体发布授权以对应发行物和官方条款核对结果为准。[官方 LICENSE](https://github.com/Live2D/CubismWebFramework/blob/d4da0aa07e47d2c1e4f5fa7ea6047861ea5e5d0b/LICENSE.md)。

## 选型 PoC 与验收门槛

1. 固定候选提交、npm 分发版本、Pixi、Core 与 Framework 版本，导出依赖/许可证清单。先只测现代 model3/moc3；是否需要 Cubism 2 是产品决策。
2. 同一个带 motionsync3.json 的模型、同一官方分析结果在 Untitled/Jannchie 渲染，对照官方示例。确认口型多参数、表情/动作/物理并行、停止闭口、未配置模型降级行为。
3. 录制帧内事件与参数快照，证明只应用一次、正常恢复基线、动作不覆盖口型、音频暂停时口型不继续前进。无 dt 的事件应读取本项目单一音频时钟，不另建独立计时器。
4. Chrome/Edge、Firefox、桌面 Safari、iOS Safari、Android Chrome 真机或对应自动化实测。覆盖首次手势解锁音频、切后台再回来、resize/DPR、WebGL context loss 恢复。
5. 加载中销毁、加载失败、重复 destroy、快速切模型、两个实例销毁其中一个；观测 ticker/listener、AudioNode、网络任务、WASM/纹理是否回收。
6. 在同设备、同模型、同 DPR 比较 p50/p95 帧耗时、分析耗时、长任务、内存/显存趋势、声画延迟；先记录基线再定阈值，不凭 README 宣称快多少。
7. Untitled 若仅有小范围生命周期缺口，可补丁或贡献上游；若必须大面积 monkey patch 私有渲染与 Cubism 状态，则转官方 Framework 适配器。保持公开 2.0 API 不变。

本报告未验证：所有候选 npm 产物与 HEAD 的一致性、上游 issue 全量质量、真实设备性能、完整 Core 分发许可，以及各 fork 对 Cubism 5.3 新特性的完整支持。
