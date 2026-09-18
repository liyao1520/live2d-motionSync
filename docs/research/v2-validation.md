# 2.0 实现与验证记录

日期：2026-09-16。分支：`codex/v2-modern-player`。版本：`2.0.0-alpha.0`。

这是本次实现的实际交付记录。其他调研文档中的“待验证”“建议”描述保留为决策背景；发生差异时，以这里和代码为准。当前不是已公开发布的稳定版本。

## 实现范围

一个框架无关 SDK 暴露 `createPlayer`。播放器负责模型、音频时钟、口型和生命周期，调用者无需管理 Pixi 或每帧写参数。

| 模块        | 实现                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 渲染        | Untitled 1.3.5、Pixi 8.20.1、WebGL；自适应画布、动作/表情、点击命中、可选视线/待机                                            |
| 官方口型    | Cubism Core 5-r.4、MotionSync Core 5-r.2；参考官方 MotionSyncComponents 5-r.2 的 CRI ABI、映射、平滑/阻尼，使用独立实例适配器 |
| 基础口型    | 无配置时按模型 LipSync 组或 ParamMouthOpenY 降级；公开 motionsync / amplitude / unavailable                                   |
| 音频文件    | URL、Blob/File、AudioBuffer；play 默认打断，enqueue 显式 FIFO，stop 清空队列                                                  |
| PCM         | f32 / s16le、16–128 kHz、单/双声道；有界缓存、顺序 write 背压、end 排空、stop 取消                                            |
| MediaStream | AudioWorklet 捕获分析，无默认监听回放，不停止调用者传入的音轨                                                                 |
| 后台        | 渲染停止；文件内部暂停/前台恢复；PCM 丢弃已调度和后台写入数据；捕获队列有界且丢弃旧帧                                         |
| 导入        | model3 URL、完整 ZIP Blob、保留路径的文件集合；多入口显式选择，缺资源报错，尺寸/数量限制，Blob URL 释放                       |
| 工程        | pnpm workspace、严格 TypeScript、tsdown ESM/dts、ESLint/Prettier、Vitest/Playwright、CI、Changesets                           |
| 示例/文档   | Vite Playground、独立 JS/React/Vue 项目；Next 16.3.5 + Fumadocs 16.15.11 / MDX 15.4.1 + Tailwind 4.3.3                        |

旧 API、Cubism 2 runtime、手工复制的整套 Framework、旧 Worklet/音频管理器、tsup 配置、Cubism Git submodule 和远程 Sandpack 依赖已移除。官方原始 runtime 与 license/notice 隔离保存；构建按 SHA-256 校验，Git attributes 禁止改写 runtime 字节。

## 已验证

本机 Windows、Node 26.8.1、pnpm 10.30.3、Playwright Chromium/SwiftShader。开发/CI 目标 Node 24.11+；配置中的 Linux Node 24 CI 尚未远程执行，不将其写成本机实测。

| 验证                                         | 结果与范围                                                                                                                        |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile`             | 通过，lockfile 对齐全部 7 个 workspace 项目                                                                                       |
| `pnpm check`                                 | ESLint、严格类型、15 项单元测试、SDK ESM/dts 构建通过                                                                             |
| `pnpm test:browser`                          | 6 项真实浏览器测试通过；模型加载/截图、官方口型非零输出、打断与销毁，另含动作、表情参数和点击命中检查                             |
| 资源导入回归                                 | 完整嵌套 Unicode 路径 ZIP 和文件集合都能加载；阻断远程模型请求仍成功；同一 canvas 销毁后重建通过                                  |
| 会话回归                                     | PCM 背压和完成/取消、FIFO 顺序、后台文件暂停、后台 PCM 无积压、MediaStream 音轨归属通过                                           |
| 多实例                                       | 两个模型使用独立纹理；销毁一个后另一个仍能渲染并运行基础口型；GL 无错误                                                           |
| `pnpm build:examples` / `pnpm test:examples` | JS、React（StrictMode）、Vue 生产构建与浏览器加载/播放通过；Playground 同时通过类型检查和构建                                     |
| `pnpm build:docs` / `pnpm test:docs`         | 新版 Next/Fumadocs 文档站生产构建、客户端播放和文档页无 hydration 错误检查通过                                                    |
| `pnpm test:package`                          | 在仓库外临时目录安装实际 tgz，生产构建后浏览器加载模型并检查官方口型；没有复制任何 Core 脚本、设置 renderer alias 或 runtime 地址 |
| SSR 包导入                                   | Node import 成功；这不表示可以在服务端创建 WebGL 播放器                                                                           |

测试模型为仓库已有 `kei_vowels_pro`，音频为 `demo.wav`。MediaStream 使用浏览器音频节点生成的流；它证明捕获管线和资源归属，不等同于真实麦克风/WebRTC 全场景验证。后台测试模拟 visibilitychange，仍需真机验证系统挂起/来电行为。

## 已定位并修复的兼容问题

1. Untitled 使用纹理 source 的 `_gpuData`；Pixi 8.13.1 真实浏览器渲染失败。准确固定 8.20.1 后通过，不沿用上游最低 peer 版本当作兼容证据。
2. Blob URL 不含图片后缀，Pixi 无法始终正确选择 parser。适配器显式使用 loadTextures 预加载，再交给模型工厂。
3. Pixi Assets 是全局缓存。每个模型创建独立纹理 Blob URL，销毁时只卸载该实例的资源，避免另一个实例纹理失效。
4. Pixi destroy 会主动 loseContext。适配器记录可恢复上下文，复用 canvas 前等待恢复；有超时报错，避免永久挂起。
5. 旧例子依赖自定义远程 Sandpack 和不存在的构建入口。新版文档使用本地客户端示例，不依赖该远程服务。
6. 隐藏默认语言前缀时，生产静态页面在浏览器中触发 hydration 文本不匹配；改为明确的 /cn 与 /en 路径后生产浏览器检查通过，同时对齐 RootProvider 的语言配置。

## 明确的边界与待验收项

- **公开 npm 分发许可尚未确认**：技术上的打包即用已经验证；通用 npm 库携带两个专有 Core 的公开再分发条件仍需核实。`prepublishOnly` 阻止当前状态下公开发布，本次没有发布 npm、推送远程或部署站点。
- **Cubism 4/5 是目标范围，不是全功能认证**：目前只对现有模型作集成验证。不同 moc 版本、新版遮罩/混合等特性、所有动作/表情/物理组合需要另一个合法模型矩阵。已验证现有动作、测试注入的简单表情参数和 Head 命中，不宣称覆盖全部模型表现。
- iOS Safari、Android Chrome 真机、Firefox/WebKit、真实音频打断恢复尚未验收。当前实现使用 WebGL、Web Audio、AudioWorklet；麦克风要求安全上下文。
- 运行中意外 WebGL context loss 只接入停止/恢复钩子；已验证的是主动销毁后 canvas 复用，不能将其扩大为所有 GPU 重置情况。
- MotionSync 当前使用一个 CRI setting，按 `Settings[].Id` 选择；参数 ID 要求 ASCII；不提供多 setting 同时混合，也不自动根据动作切换 setting。输出按配置 SampleRate 更新，Core 按音频窗口分析；不宣称与官方 Sample 的逐帧调度完全一致。
- 尚未提供独立 Worker 中的官方分析器、音频重采样器、暂停/进度/音量 API、ZIP64/加密 ZIP、MP3/AAC 流式解码或单个裸 moc3 文件打包工具。
- 未提供性能提升百分比或长时间内存稳定性结论。当前改进是有界实时缓存、复用原生分析缓冲、按实例释放、DPR 默认上限 2 和后台节能；需要后续同机基线测试才能量化收益。
- 构建器对 MotionSync runtime 的单块体积给出 >500 kB 提示；保留官方原始内容并延迟加载，未为了消除提示改写专有文件。

## 运行与审阅入口

`pnpm build && pnpm dev` 启动 Playground；`pnpm docs` 启动文档。API 与示例见根目录 README_ZH.md。运行时来源/散列在 vendor/runtime-manifest.json，第三方声明与上游 notice 在 packages/core。
