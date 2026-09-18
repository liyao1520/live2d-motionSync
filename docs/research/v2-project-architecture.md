# 2.0 工程架构升级方案

日期：2026-09-16。用户已明确要求整个项目现代化，且接受 Untitled 优先验证路线。本文是研究阶段建议，不是已经执行的依赖升级；具体版本需在依赖兼容和发布产物验证后锁定。

## 目标

一份清晰的 TypeScript SDK 提供模型渲染、口型同步和音频会话；开发、测试、文档、发布各自独立。消费者安装一个包即可使用，不负责初始化 Git 子模块、配置 Pixi 全局变量或下载运行时。官方 Core 随包分发的条件仍属于独立发布依赖，详见 [专项核查](./v2-runtime-distribution.md)。

## 当前问题

- 根与 package 的依赖存在两种 raw 插件；构建写死 `../../libs/cubism/src` 路径，且当前工作区子模块未初始化。
- `tsconfig.base.json` 的 strictNullChecks、strictPropertyInitialization 被关闭，削弱 strict 模式；SDK 与 docs 使用不同模块解析策略。
- npm 根不是 private，保留无效 React 脚本；workspace 声明包含尚不存在的目录。
- packages/core 同时引用 Pixi 6 全包和多个 @pixi 子包，旧加载器附带 Cubism 2 的 live2d.min.js。
- Crunker 仅有未使用 import，uuid 未见源码引用；lodash 当前用途主要为类型判断和 debounce，应按实际需要替换，不为“升级”保留无用依赖。
- 存在 Changesets，但发布 access 配置与 package 的 public 意图不一致；根 LICENSE=MIT，package 元数据=ISC，需要整理实际版权和许可归属，不能覆盖上游声明。
- 未发现现有 CI 或系统化测试配置；源码链接能运行不等于发布包可用。

## 建议目录

```text
packages/
  core/                     # 唯一公开 SDK；目录名不决定最终 npm 名称
    src/
      player/               # 公共 facade、生命周期、类型化事件
      renderer/             # 本项目接口与 Untitled 适配
      audio/                # 会话、文件、MediaStream、PCM、调度和缓冲
      lipsync/              # 官方分析适配、基础振幅模式、参数映射
      runtime/              # 官方运行时自动加载、版本和所有权管理
      assets/               # 新增导入建议：ZIP/文件集合/URL统一解析，渲染与口型共用
    worklets/               # 独立编译的采集/播放处理器
    tests/
    tsdown.config.ts        # 候选方案，先验证资源与类型输出
apps/
  docs/                     # 现有 Next + Fumadocs 文档站，独立升级
  playground/               # Vite 浏览器演示/调试，不成为 SDK 依赖
examples/
  vanilla/
  react/
  vue/                      # 已确认示例交付，首发不提供专用组件包
tests/
  consumers/                # 安装 pack 产物的干净消费工程
  browser/                  # 渲染、音频和生命周期集成测试
vendor/
  motionsync/               # 允许引入的官方代码，固定 tag/SHA、保留许可
  patches/                  # 必要补丁独立记录，避免不可追踪的整库修改
scripts/                    # 校验 vendor、pack 验证、资产清单
```

vendor 是维护输入；专有 Core 的具体归档/发布路径以许可核查结果为准。不要把此目录设计解释为已获准公开 Core。无必要不再拆 runtime、renderer、audio 为多个公开 npm 包；如需内部 workspace 包，保持 private。

## 工具链建议

| 层面 | 建议 | 目的 |
| --- | --- | --- |
| 工作区 | 保留 pnpm workspace，统一 packageManager 与 lockfile | 避免为现代化而引入额外 monorepo 编排层 |
| Node | Node 24 LTS，统一 .nvmrc / engines / CI | 锁定满足构建工具要求的维护补丁版，替换现有 20.19.2 开发基线 |
| 类型 | 维护中的 TypeScript 稳定版，自有代码完整 strict | 恢复空值与属性初始化检查，公开 API 不暴露 any |
| SDK 构建 | 优先验证 tsdown，ESM + 声明文件 + sourcemap | tsup 上游已推荐迁移；浏览器 SDK 以现代模块为主 |
| 示例构建 | Vite | 快速演示并作为实际消费者验证资源处理 |
| 单元测试 | Vitest | 验证队列、打断、PCM 缓冲、重采样和状态机 |
| 浏览器测试 | Playwright | 验证实际 Web Audio / WebGL、异步销毁和消费端加载 |
| 规范 | ESLint + typescript-eslint + Prettier | 导入边界、Promise 使用与统一格式；CI执行 |
| 发布 | 保留 Changesets，补全 pack、类型与资源检查 | 确认发布的是消费者可直接使用的产物 |
| 文档 | 保留 Next + Fumadocs，按兼容矩阵一起升级 | 文档技术栈不绑架 SDK，也不因“新架构”无端重做 UI |

ESM 优先是本次工程建议，不默认维护旧 CJS/IIFE/Sandpack 专用多套产物；如发现明确消费需求再增加。严格模式仅约束自有代码，第三方 vendor 使用单独配置并在边界适配，不粗暴修改官方文件来通过 lint。

依据：[tsup 上游](https://github.com/egoist/tsup)、[tsdown](https://tsdown.dev/guide/)、[pnpm workspace](https://pnpm.io/workspaces)、[TypeScript strictNullChecks](https://www.typescriptlang.org/tsconfig/strictNullChecks.html)。版本及兼容依据见 [工具链调研](./v2-toolchain-research.md)：第一阶段保留 pnpm 10.x 固定版本；TypeScript 5.9 可作为上游兼容验证基线，再独立评估 6.0，不宣称保守基线就是最新版本。

## 依赖处置

| 当前依赖/代码 | 2.0 处置 |
| --- | --- |
| pixi-live2d-display 0.4 | 替换为通过 PoC 的 Untitled 固定版本 |
| pixi.js 6 + @pixi/* 6 | 统一到渲染器支持的 Pixi 8 组合，清除重复旧依赖 |
| live2d.min.js | 仅支持 Cubism 4/5 后移除旧 Cubism 2 运行时 |
| 本地 Cubism 子模块 | 调整为明确来源/版本的受控依赖，先解决与渲染器自带 Framework 的身份和全局状态兼容 |
| MotionSync 源码副本 | 对照 5-r.2 做语义 diff、记录上游 SHA、保留许可与必要补丁；不伪称换新算法 |
| 两个专有 Core | 固定官方发行物版本和 hash，未经许可确认不改写；与开源封装分开声明 |
| crunker、uuid、对应无用类型 | 审核后移除；音频调度由明确的 AudioSession 实现 |
| lodash-es | 简单类型判断改语言内置，resize 调度采用可取消实现；不复制整个工具库 |
| raw 注入插件 | 随运行时加载方案替换，SDK 不依赖消费者配置 ?raw |
| Next、React、Fumadocs、Tailwind | 作为文档应用依赖独立升级，不进入核心 SDK 依赖图 |

不能把“官方 Framework 升到最新”与“Untitled 也使用自己的 Framework”分别执行后强行用 any 拼接。需要核对模型参数 ID 身份、全局 Framework 初始化、Core ABI 和释放顺序；必要时通过窄适配接口以字符串/索引交换数据，PoC 证明后再锁版本。

## 验证与发布

1. 自有模块 lint + typecheck + 有行为价值的单元测试；不为第三方代码重写镜像测试。
2. 浏览器验证文件、MediaStream、PCM 三路径，覆盖打断、停止后过期回调、短尾、欠载、加载失败、多实例与重复销毁。
3. 使用 pack 产物安装到独立 Vite/React/Vue/Next 消费工程；不能通过源码 alias 或额外复制文件掩盖发布缺陷。检查类型、资源 URL、生产 base path 和 SSR 无副作用。
4. Playwright 的 WebKit 测试不能替代真实 iOS Safari：保留真机音频激活、系统中断与后台恢复验收。
5. 校验 tarball 仅含需交付内容，检查许可证、vendor SHA/hash、exports/types、依赖去重与包体积基线；运行文档生产构建。
6. CI 校验成功后走 Changesets 的 2.0 预发布，再按版本策略发布。发布凭据与授权不在研究阶段操作。

## 迁移顺序

先建立空的现代工程骨架与测试入口，再完成渲染+官方口型 PoC，继而实现新的 Player/AudioSession，迁移演示和文档，最后替换旧入口与移除旧依赖。每一步按新 API 和既定行为验收，不保留旧 API 兼容层。具体实施需在本轮设计访谈收敛后进行。
