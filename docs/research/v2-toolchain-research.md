# 2.0 工程工具链与上游代码管理

调研日期：2026-09-16。仅查阅配置、源码及官方文档，没有安装迁移或执行测试。推荐为工程决策，不代表组合已通过本仓库验证。

## 建议组合

采用 **Node 24 LTS + pnpm workspace + TypeScript + tsdown + Vite + Vitest + Playwright + Changesets**。每个工具承担一种职责：tsdown 构建库；Vite 运行示例和浏览器测试页；Vitest 测纯逻辑；Playwright 测真实浏览器；Changesets 管版本与发布。首版不引入 Nx/Turborepo，也不因库工程升级重写现有 Next/Fumadocs 文档站。

| 工具 | 已核实事实 | 本项目建议 |
| --- | --- | --- |
| Node | 官方列表 Node 24 为 LTS、26 为 Current，20 已 EOL | 构建和 CI 固定经过验证的 Node 24 patch，至少满足 tsdown 的 24.11 门槛；浏览器库不把构建 Node 版本当作浏览器运行要求 |
| pnpm | 仓库固定 10.8.0；官方当前文档为 pnpm 12，但兼容表仍列 pnpm 10 支持 Node 24 | 第一阶段保留 10.x 并锁定具体版本，单独评估升 12；不要构建器和包管理器大版本同轮替换 |
| tsup/tsdown | tsup 官方 README 明确不再积极维护并建议 tsdown；tsdown 当前文档为 0.23.0 | 将库构建迁到固定版 tsdown；0.x 工具先用准确版本，不用浮动 latest |
| TypeScript | 仓库 5.8.3；官方有 5.9 与 6.0 文档；6.0 弃用 baseUrl 等旧配置 | 新代码使用 strict，moduleResolution: bundler；先以 5.9 稳定线跑通上游声明与 dts，再在独立变更中评估 6.0。5.9 是保守建议，并非宣称最新 |
| Vite | 当前官方指南要求 Node 20.19+ / 22.12+ | 为 vanilla playground 与浏览器夹具服务；固定与 Vitest peer 兼容的稳定版本，不在未核实包元数据时猜最新号 |
| Vitest | 当前官方指南要求 Vite >=6.4.0、Node >=22.12.0 | 单元测状态机、PCM环形缓冲、重采样、时钟、队列和错误语义；纯逻辑优先 Node 环境 |
| Playwright | 官方支持 Chromium/Firefox/WebKit，当前安装要求包括 Node 24 | 测加载、参数注入、音频解锁、取消/销毁、上下文恢复；固定浏览器二进制与包版本。WebKit 自动化不能替代 iOS 真机 |
| Changesets | 仓库已用 CLI 2.29.5；官方定位即 monorepo 版本、changelog、发布 | 保留；只给公开包 changeset，先发 2.0 prerelease，再稳定版 |

一手来源：[Node 发布表](https://nodejs.org/en/about/previous-releases)、[pnpm 安装/兼容表](https://pnpm.io/installation)、[tsup README](https://github.com/egoist/tsup)、[tsdown 安装](https://tsdown.dev/guide/getting-started)、[TypeScript 5.9](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-9.html)、[TypeScript 6.0](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html)、[Vite](https://vite.dev/guide/)、[Vitest](https://vitest.dev/guide/)、[Playwright](https://playwright.dev/docs/intro)、[Changesets](https://github.com/changesets/changesets)。

落地安装前再读取各准确版本的 engines/peerDependencies，提交 lockfile 后在全新目录执行 frozen install/build/test/pack。文档的最低版本说明不足以证明任意最新工具可以任意组合。

## 现状与迁移重点

本地证据：根 package.json、pnpm-workspace.yaml、tsconfig.base.json、packages/core/package.json、packages/core/tsup.config.ts、.changeset/config.json、.gitmodules。

1. 根 workspace 数组只写 packages/*，pnpm YAML 同时包含 apps/playground/docs。建议以 pnpm-workspace.yaml 为唯一实际清单，根 private:true，加统一 check/typecheck/test/build 脚本。
2. tsconfig 写 strict:true，却显式关 strictNullChecks 和 strictPropertyInitialization。新 2.0 自有代码开启完整 strict/noUncheckedIndexedAccess，第三方 vendor 单独检查策略，不继续用全局宽松选项掩盖 SDK 兼容问题。
3. 核心包同时依赖 pixi.js 6 与拆分的 @pixi/* 6；2.0 移到 Untitled/Pixi8 时删除旧渲染依赖图，避免装两套引擎。公开 API 不导出供应商模型类型。
4. tsup 有两份构建，其中 sandpack 将全部 dependencies 内联，且内嵌目录位于 dist 下、另一个任务 clean 同一输出根。升级时改成单一库产物，playground 消费 packed tarball，不再维护特制依赖全内联的 sandpack 包。
5. esbuild-raw-plugin 与 esbuildOptions.alias 不能原样复制到 tsdown。官方迁移文档明确 tsdown 用 Rolldown 插件；需要改用等价模块/资源入口。特别是 AudioWorklet 独立文件必须有稳定 URL 导出，不能只在 Vite 的 ?raw 语法下可用。[迁移文档](https://tsdown.dev/guide/migrate-from-tsup)
6. 现有 exports 没有条件内 types；2.0 显式 exports/types/files，ESM 优先。是否提供 CJS 应以已承诺消费方式决定；对纯浏览器 2.0 默认 ESM 即可，不能仅为沿袭旧包增加双产物状态。
7. .changeset 默认 access=restricted 而 core publishConfig=public。发布流程统一成明确 public 策略，并让 dry-run/pack 内容检查先于发布；现有授权仅调研，不实际发布。

## Framework 重复副本是架构边界问题

事实：现有 tsup 的 @cubism alias 指向 libs/cubism/src；.gitmodules 指定官方 Framework，但本次工作目录中子模块源码未检出。现有 MotionSync 使用 CubismModel/csmString 等本地 Framework 类型；cubismmotionsyncdata.ts 已注释公开 ID 比较，改成 `(model as any)._parameterIds[...]` 与字符串比较。这个私有补丁说明不能只替换 import 就假定新版兼容。

事实：Untitled 1.3.5 自带维护者 fork Framework 子模块（SHA `8df84780f2aa1298f3b30965cdae143e049f3c8e`），公开 package exports 只有主入口、cubism、cubism-legacy、extra，没有通用 Framework deep import。官方 Framework 的初始化标志与 ID manager 是模块状态；官方 R5 CubismId.isEqual 对对象分支使用 `instanceof CubismId`。[Untitled package](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/package.json)、[Untitled 子模块](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/.gitmodules)、[官方 Framework 状态](https://github.com/Live2D/CubismWebFramework/blob/d4da0aa07e47d2c1e4f5fa7ea6047861ea5e5d0b/src/live2dcubismframework.ts)、[官方 CubismId](https://github.com/Live2D/CubismWebFramework/blob/d4da0aa07e47d2c1e4f5fa7ea6047861ea5e5d0b/src/id/cubismid.ts)。

由此推断：两份 Framework 即使版本相同，也可能存在 constructor/ID handle/单例状态不相同；同名 TypeScript 类包含 private 字段时还可能出现声明类型不兼容。仅 pnpm dedupe 或把 alias 改成相同名字不能消除已打包到 Untitled 内部的副本。具体 Untitled fork 的 ID 实现仍须在 PoC 检验，不能将官方 R5 实现直接当作 fork 事实。

建议先做最小边界验证，再确定 vendor 形态：

- 渲染侧唯一拥有模型、Framework 初始化及渲染资源；本项目 ParameterWriter 只交换参数 **字符串 ID、数字 index/value、数组**，不跨边界传 CubismIdHandle/CubismModel 类。
- MotionSync 若可以独立产生参数结果，则保留官方分析流程，增加小范围桥接补丁，把模型查询/写入转成结构接口；初始化时用渲染器公开能力建立 string→index 映射，逐帧只用 index 写入，删除 any._parameterIds。
- 如果官方 Components 的模型/Framework 绑定无法在小补丁内隔离，则统一源构建：固定 Untitled fork 与 Components，二者 alias 到经过兼容验证的同一 Framework。该方案意味着维护私有构建/补丁，必须显式记录，不能声称只安装上游 npm 就实现单例共用。
- 不把“把完整官方 Framework 再 bundle 一次”作为默认解决方案；也不任意强制替换 Untitled 子模块为官方最新 R5。先验证 ID、JSON解析、模型参数边界、初始化/释放互不干扰。

## vendor 固定与升级策略

建议将必要的官方 MotionSync 源码集中至内部 vendor 包/目录，保留原始目录结构与 copyright/LICENSE。不要散落在业务 src 内再无记录地手改。

维护 vendor-manifest.json，记录 upstream URL、tag、**完整40位SHA**、获取日期、文件校验值、许可证路径、关联 Core/Framework 版本、补丁列表。渲染器依赖也用准确版本与 lock integrity；本报告已核实 Untitled HEAD `a46a6030de798e476edb711122aa8890653c1eed`、其 Framework SHA，以及官方 Framework R5 `d4da0aa07e47d2c1e4f5fa7ea6047861ea5e5d0b`，它们是独立版本，不代表可以直接互换。

补丁单独存 patches，并标明修改目的、受影响上游文件、测试和上游 issue（若有）。更新流程为下载固定上游 → 校验 → 应用补丁 → 类型检查 → ID桥接/口型顺序/多实例释放/浏览器用例 → 审核差异 → 更新 manifest。CI 不能自动拉 main 或 latest 覆盖 vendor。

Core/WASM 等二进制另行记录版本、URL、哈希与分发来源，不把 MIT 包的权限推及 Live2D/CRI 运行时。不为了完成源码初始化而提交未经核实分发条件的二进制。

## 最小工程验收

- 全新 checkout 可按固定步骤准备 vendor 并 frozen install；不能依靠本机未声明子模块、全局工具或缓存。
- typecheck、核心单测、浏览器烟测通过；测试必须包括 ID 跨边界/口型不累积/销毁中取消/两个实例互不影响。
- pack 后用独立 vanilla Vite 工程安装 tarball，验证 exports、声明、worklet/WASM定位、SSR import 不执行 window 访问，验证文档示例无需 monorepo alias。
- CI 先 lint/typecheck/test，再 build/pack/browser；固定 Node/pnpm/浏览器版本，发布与日常验证分开。

未完成事项：最终准确依赖矩阵、tsdown 对 SDK namespace/dts 的编译实验、vendor 与 Untitled Framework 的桥接 PoC、包体积和性能基线。应作为工程第一阶段的验收项，不能写成既成结果。
