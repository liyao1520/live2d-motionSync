# 2.0 现有实现审阅

审阅日期：2026-09-16。范围为静态源码检查，未运行浏览器复现或性能基准。此文记录事实和设计输入，不代表已经确定的 2.0 方案。

## 已确认的产品边界

- 不兼容旧 API。
- 用户确认：首发支持现代桌面和移动端浏览器。
- 用户确认：首发覆盖音频文件、MediaStream 和流式 PCM。
- 用户确认：无 MotionSync 配置时自动降级为基础口型，并暴露模式状态。
- 用户确认：以开箱即用的模型渲染与口型同步为产品入口；暂不规划独立口型引擎的公开入口，内部仍隔离渲染实现。
- 用户确认：Cubism 4/5，逐项列出已验证特性；默认播放打断，显式排队；npm 安装即用，内置运行时的分发与构建方案继续核实。
- 用户确认：Untitled 优先验证；升级整体项目工程架构；首发仅播放/停止/排队，含动作/表情/交互，单 SDK 配 JS/React/Vue 示例，后台节能且实时数据不积压。

## 代码事实与影响

| 位置 | 事实 | 2.0 应满足的要求 |
| --- | --- | --- |
| `packages/core/src/core/audio.ts:4` | `typeof window === undefined` 将字符串与 undefined 比较；模块导入时会调用初始化、创建 AudioContext 并注册全局交互监听 | 导入无浏览器副作用；显式初始化和解锁音频；监听可移除；支持框架 SSR 导入 |
| `packages/core/src/core/core.ts:49,196` | 在 Promise 构造器中使用 async executor，内部 fetch/decode 错误没有接入外层 reject | 加载与播放失败必须可观察；每次播放必须确定结束、取消或失败 |
| `packages/core/src/core/core.ts:137` | 替换 `internalModel.motionManager.update`，不恢复旧函数；重复加载会继续包装 | 渲染适配器提供可解除的更新阶段 hook；禁止依赖重复 monkey patch |
| `packages/core/src/core/core.ts:148` | 仅当已处理样本数小于缓冲长度时删除；恰好处理完时没有清空 | 严格消费计数；覆盖恰好消费完、零样本及越界情形 |
| `packages/core/src/core/core.ts:110,239` | 分段播放通过 ended 启动下一段，且 `play(src, false)` 不重置累计采样位置 | 连续流通过音频时间线调度；每段位置和整段会话位置分开建模 |
| `packages/core/src/core/core.ts:208` | 旧 source 的 ended 回调访问可变的 `this.audioSource` 并继续推进队列 | 以会话 ID / generation 隔离过期回调；stop/replace 后旧回调不得影响新会话 |
| `packages/core/src/core/core.ts:114` | 每次更新 slice 样本、逐个 push，随后 splice 缓冲头；只取第 0 声道 | 明确声道策略；避免热路径无界复制和头部移动；性能收益需基准验证 |
| `packages/core/src/core/core.ts:14,186` | 分析采样率默认固定为 48000；与实际输入采样率缺乏显式一致性校验 | 统一 PCM 格式并进行必要的重采样；覆盖 16/24/44.1/48 kHz 输入 |
| `packages/core/src/core/renderer.ts:156` | destroy 未停止 MotionSync、清理 ResizeObserver 或调用分析实例 release；app children 销毁后再次销毁 model | 资源所有权清晰；销毁幂等；部分初始化失败也能回收 |
| `packages/core/src/core/inject.ts` | 通过 inline script.innerHTML 注入运行时 | 运行时加载器支持 URL/已有运行时、失败重试和并发去重；验证 CSP 部署 |
| `packages/core/src/core/core.ts:170` | 缺失配置时加载固定 fallback 配置 | 区分完整 MotionSync 与基础音量口型；配置缺失不等于模型具备精细口型能力 |
| `README_ZH.md` 与 `packages/core/src/index.ts` | README 主入口与现有导出的一体化 renderer 不一致 | 发布包、类型声明、最小示例、文档保持一致 |

## 建议的验证场景（待方案确认）

1. URL 404、解码失败、加载过程中取消、并发初始化、重复销毁。
2. 连续替换播放、stop 后旧 ended 到达、队列清空、新会话不受旧会话影响。
3. 一段 PCM 刚好被消费完；长时间连续输入不产生无限增长的缓存。
4. 不同输入采样率、立体声、静音、非默认嘴部参数、配置缺失与配置损坏。
5. 移动端手势解锁、后台与前台切换、音频上下文中断恢复。
6. 多模型隔离、共享运行时、资源由用户提供时的所有权规则。

以上属于重写依据；本次未修改业务代码。
