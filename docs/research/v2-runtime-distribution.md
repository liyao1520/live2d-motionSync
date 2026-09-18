# 2.0 零手动 Core 准备的分发核查

日期：2026-09-16。用户硬要求：npm 安装后可直接渲染和口型同步，不接受接入者手动下载、复制或配置 Core。本文保留这一目标；不把手动配置方案当作已满足目标。仅调查公开一手材料，未下载需同意协议的分发包、未联系 Live2D。

## 决策结论

**工程上存在 npm 包携带运行时并自动加载的实现路线，但尚未完成消费端构建验证；现有公开依据不足以确认本项目作为通用开发库，能够直接向所有 npm 用户再分发 Cubism Core 与 MotionSync Core。** 这不等于已证明禁止 npm；也不能把一般应用的再分发许可当成通用 SDK 的明确许可。

因此应将“零手动准备”作为产品验收要求，将“两种 Core 的具体 npm 分发权利与用户许可传递”作为发布前必须解决的依赖。不能通过默认第三方 CDN、偷偷 postinstall 下载或把 Core 改称资源包来消除这个依赖。当前调研和 API/架构设计可以继续。

## 可明确核实的依据

### 1. 两种 Core 同受专有协议约束

当前官方协议页列出 Cubism Core 和 Cubism MotionSync Core，版本为 2.1，修订日期 2025-02-03。协议中“分发/再分发”涵盖向第三方提供的软件，以及放到第三方可访问的互联网服务器，并不因为是免费托管就自动排除。第 5 条附条件允许可再分发代码；第 6 条保留未明确授予的修改、分发权利。第 5.2.4 要求按官方提供的原样分发。第 6.8 不允许把其中官方软件换成非 Live2D 许可。[专有协议](https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html)

**未明确：** 当前公开条款没有直接写出“npm 开发库属于已批准分发方式”，也没有可据此断言“所有 SDK 包均禁止”的专门条款。主要功能是否足够、库使用者属于怎样的接收方，需要针对本项目用途确认。

### 2. 官方确有非常接近的库分发答复，但批准的是不带 Core 的方案

2025-04-07，官方 `Tak_staff` 针对 GDCubism 库回复：允许把自有代码与官方 Framework 编译成库；使用者自行从官网下载 SDK、抽取 Core DLL 配置到库旁；需要在 README/手册明显提示阅读及同意使用协议。官方答复明确依赖用户从官方下载 Core 的流程。该答复不能扩展成“允许把 Core 一起打入 npm”，也不能直接扩展为 Web/MotionSync 的许可。[官方答复全文](https://creatorsforum.live2d.com/t/topic/3414/2)

这个案例支持“Framework 可组合封装，Core 分发需要单独辨别”，但它的手动流程不符合本项目需求。

### 3. 官方运行时类别允许另行讨论条件

官方 Others 页面明确覆盖 Runtime 等不属于 A–G 标准计划的内容，说明需根据具体内容另行提出合同条件。这提供了通用运行时/开发库分发问题的官方处理入口，未公开统一 npm 条件。[Others — Runtime](https://www.live2d.com/en/sdk/license/others/)

### 4. Framework 与 Core 的许可不能互换

官方 Open Software License 第 2.2 节规定 Framework 的若干分发情形，包括其他被许可人及接受该协议的第三方；这些规定不能代替专有 Core 的许可。SDK 文档明确 Core 不放在 GitHub，来自官方下载包。[Open Software License](https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html)、[Web SDK 手册](https://docs.live2d.com/en/cubism-sdk-manual/cubism-sdk-for-web/)、[MotionSync 手册](https://docs.live2d.com/en/cubism-sdk-manual/cubism-sdk-motionsync-plugin-for-web/)

### 5. 下载页需要协议流程

官方 MotionSync 下载页要求阅读并同意 Proprietary / Open Software 协议；页面包含同意选项以及首次/更新下载等流程。公开页面存在下载入口，不等于允许在无告知的安装脚本中代用户完成同意。[下载页](https://www.live2d.com/sdk/download/motionsync/)

## 具体阻塞点及条件

| 方案 | 满足零手动准备 | 现有证据状态 | 实施条件 |
|---|---|---|---|
| 主 npm 包原样附带两种 Core | 是 | 未获针对本项目的明确确认 | 确认通用库再分发资格、具体文件范围、协议传递及 registry/CDN 镜像是否覆盖 |
| 独立 runtime 依赖包，主包自动依赖 | 是 | 拆包本身不改变许可状态 | 同上；主包 MIT 与专有资源许可清楚隔离 |
| 自建公共 CDN，SDK 默认自动加载 | 不需手动准备，但依赖联网 | 未确认面向任意应用的公共运行时托管授权 | 确认此用途、用户同意安排、版本化与供应可用性；不能承诺离线安装即用 |
| 默认引用可访问的官方 Core URL | 可能，但只解决可用的资源 | 未找到覆盖两种 Core 的稳定生产分发保证 | 官方确认适用范围、固定版本和 MotionSync 资源入口；URL 能访问不等于服务承诺 |
| postinstall 自动下载官方分发包 | 表面满足 | 下载许可及无人值守同意问题未解决 | 先确认自动化获取方式及接入者告知/同意，不绕过下载流程 |
| 仅打包 Framework、用户手动提供 Core | 否 | 最接近官方明确案例 | **不符合已确认需求，不选作默认交付方案** |

若获得与目标形式一致的授权/确认，建议按官方原文件保存 Core，记录来源版本与 hash，在构建阶段复制到包内的静态资源目录，加载器负责路径解析、幂等加载和初始化 Promise。不要让压缩器、转译器或 tree shaking 改写专有文件；需要声明/封装时另建自有 wrapper 文件。随后验证 Vite/Webpack/Next 客户端资源解析、CSP 和移动端兼容性。这是工程条件，不是对许可已通过的声明。

## 需要被明确回答的最小问题清单

以下是后续可提交给官方或项目法律负责人确认的材料，本次未发送：

1. 本项目是免费/开源 TypeScript 开发库，提供模型渲染、文件/MediaStream/实时 PCM 口型、资源与生命周期管理。这些新增能力是否满足专有协议 5.2.1，以及能否面向第三方开发者分发？
2. 是否允许把原样 Cubism Core 与 MotionSync Core 一并放入公共 npm 包，以及 npm 的公开镜像/CDN 缓存？是否需另行 Runtime 协议？
3. README、包内 LICENSE/NOTICE 和接入文档的同意告知是否足够；若不够，需要什么接受机制？
4. 是否允许我们运营默认公共 Core CDN；是否存在官方支持的、可用于生产自动加载的两种 Core 固定版本 URL？
5. 用户将本库打包到各自商业/非商业应用后，还应承担哪些独立的发布许可责任？

**不扩大结论：** Expandable Application 官方页面确实要求这类产品单独审查，但本项目究竟归入开发运行时、可扩展应用或其他类别，现有材料未作个案认定。不能因支持任意模型就直接替官方下结论。[Expandable Application](https://www.live2d.com/en/sdk/license/expandable/)

## 不应作为授权证据的材料

- 第三方 npm 包已经带 Core、第三方 CDN 已经托管、渲染引擎 README 自称 MIT，均不是 Live2D 对本项目 Core 分发的授权。
- 2016 年 SDK 2.1 官方论坛关于自有服务器可部署、GitHub 不可再分发的答复针对旧 Core，不可直接当作现行 Cubism 5 / MotionSync 的完整规则。
- 未在本次官方检索中找到 npm 或公共 CDN 明确许可 FAQ，只能记录“未找到”，不能证明永远不存在。
