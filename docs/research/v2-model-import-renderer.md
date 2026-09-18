# 2.0 本地模型文件与 ZIP 导入调研

日期：2026-09-16。审查对象固定为 Untitled 1.3.5 源码提交 `a46a6030de798e476edb711122aa8890653c1eed`。未进行 ZIP 解压、浏览器导入或 npm 产物测试。

## 结论与首发建议

2.0 可以支持用户上传模型 ZIP 或一组完整模型文件，但这需要本项目提供资源解析与生命周期层。**不能直接声称 Untitled 已原生支持 ZIP。**

建议首发公开支持：model3.json URL；完整模型 ZIP 的 File/Blob；带相对路径的一组模型文件。ZIP 默认单模型，多个 model3.json 必须显式指定入口或返回候选列表。单独上传 model3.json、moc3、纹理不能等同完整模型；缺资源应列出缺失清单。一个 ZIP 是单个上传文件，但内部仍是多个依赖资源。

## 已核实的 Untitled 能力

| 输入 | 源码情况 | 2.0 边界 |
| --- | --- | --- |
| model3.json URL | from 支持 string，经 urlToJSON 拉 JSON，以 settings.resolveURL 解析资源 | 可直接封装；资源仍受 CORS、加载失败和基址影响 |
| ModelSettings / JSON | from 公开类型支持，JSON需适当 url，ModelSettings 可覆盖 resolveURL | 推荐作为自有资源解析层向 Untitled 交接的边界 |
| File[] | 存在默认注册的 FileLoader.factory；注释标 experimental；判断 Array.isArray 且首项 instanceof File | 运行时有路径，但 from 的公开签名没写 File[]，不能未经验证当稳定公共契约 |
| 普通 FileList | factory 判断 Array.isArray，不直接匹配 FileList | 需先转换，且仍须提供正确相对路径 |
| ZIP File/Blob/URL | src 下未找到 ZipLoader 或解压实现；string URL默认按JSON加载 | 由2.0独立 importer 解压，不能把.zip直接送from |
| 单个 model3 File/Blob | 无单 File/Blob 专属 middleware | 本项目读取JSON并提供完整资源映射；仅创建其blob URL不足以找到邻接文件 |
| 单 moc3 | 有效 settings 要求 Moc字符串和非空Textures数组 | 无法作为自包含模型直接加载 |

固定源码来源：[from签名](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/Live2DModel.ts)、[Factory middleware](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/factory/Live2DFactory.ts)、[URL/JSON middlewares](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/factory/model-middlewares.ts)、[FileLoader](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/factory/FileLoader.ts)、[现代settings校验](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/cubism/CubismModelSettings.ts)。

### 入口与依赖

factory/index.ts 导出 FileLoader，Live2DFactory 已将其注册在默认 middleware 首位；无需因为使用本地文件去加载 /extra。当前 /extra 只导出 HitAreaFrames。package.json 虽将 jszip 列为 devDependency，却没有对应 src 解压实现；这不能成为支持 ZIP 的证据，也不能认为该依赖会提供给运行时用户。建议 ZIP 导入通过可选子入口或懒加载进入，不增加 URL 加载用户的初始解压代码体积。[factory导出](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/factory/index.ts)、[extra](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/extra.ts)、[package](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/package.json)。

## 文件路径与 MotionSync 的关键缺口

FileLoader 使用 webkitRelativePath 匹配文件，不是只按 File.name 匹配；默认寻找第一个文件名以 model.json/model3.json 结尾的入口，以其相对路径作为 settings.url。普通多选上传常不能保留文件夹路径，不能承诺任意 File[] 都可自动还原 texture/motions 子目录。公开 API 应额外允许 `{path, file}` 条目，或显式资源映射；目录选择可转成同样格式。[FileLoader固定源码](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/factory/FileLoader.ts)。

FileLoader.upload 只为 settings.getDefinedFiles() 创建 blob URL；不存在的资源不会映射。ModelSettings 枚举 moc、textures、pose、physics，CubismModelSettings 扩展 motions、motion.Sound、expressions；**未枚举 MotionSync**。因此包内即使有 motionsync3.json，直接复用它的文件映射也不保证可读，后续 resolveURL 可能抛文件不存在。[基础settings](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/cubism-common/ModelSettings.ts)、[现代settings](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/cubism/CubismModelSettings.ts)。

建议自有 ResourceResolver 统一为渲染和 MotionSync 提供资源：以入口文件目录解析相对路径，标准化路径、处理空格/中文与编码，一次解析 model3 的 FileReferences；将 MotionSync 引用显式纳入图谱。贴图、moc、物理、动作、表情、音频、motionsync JSON 都由同一资源会话管理。不要依赖 `new URL(relative, blobUrl)` 模拟目录；blob URL 是单个资源句柄，文件树必须由路径映射维护。[默认URL解析实现](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/utils/url.ts)。

对单独 model3.json File，若用户另给远程 baseURL/资源映射，可以作为高级入口；否则报缺少 moc3/纹理等，不猜用户本地磁盘目录。单 moc3 同理，只有另给纹理、settings等构成完整输入时才能包装加载，不是“一个moc3开箱即用”。

## 生命周期

源码事实：FileLoader 在解析 settings 后创建 object URL；清理函数在 modelLoaded 事件之后注册到 internalModel.destroy，届时 revoke settings及资源URL并删除静态filesMap。由此推断，若校验/初始化在 modelLoaded 前失败，创建的URL可能没有该清理路径；这是待复现的风险，不能直接当作已证实泄漏。[FileLoader](https://github.com/Untitled-Story/untitled-pixi-live2d-engine/blob/a46a6030de798e476edb711122aa8890653c1eed/src/factory/FileLoader.ts)。

2.0 ResourceSession 应在开始导入时即拥有文件、解压任务、object URLs和取消信号；成功后转交模型实例，失败/取消时finally释放；destroy幂等。动作、表情可能延后加载，不能在首帧ready立即revoke所有URL。多个模型共享资源时使用显式引用计数，销毁其中一个不能撤销仍被使用的URL。用户提供的外部URL不由本库revoke。

首发 ZIP 解析要有可配置文件数量、单文件/总展开大小限制，拒绝路径越出包根、重复归一化路径和不支持的加密格式；缺文件、多个入口、取消、超预算都有可识别错误码。这些属于导入器的正确性边界，不能指望 Untitled renderer 代为处理。是否使用 JSZip 或其他解压库本次未做选型，不指定版本。

## PoC 验收

1. 同一模型用 URL、ZIP、目录文件集合加载，动作/表情/物理/纹理与 MotionSync 一致；ZIP含外层根目录也能定位。
2. 中文、空格、百分号、嵌套路径、相对上级但仍在包内的引用；缺必需/可选资源分别反馈；两个入口不静默选错。
3. 加载中取消、校验失败、模型初始化失败、换模型、重复destroy均回收object URL；延迟动作在ready后仍可加载。
4. iOS/Android文件选择及内存峰值实测；大ZIP解压不能长期阻塞主线程。
5. 独立tarball消费验证现代/cubism入口、声明、懒加载解压依赖，不依赖开发仓库的jszip devDependency。

首发建议的“支持ZIP/File集合”是新增实现范围，不是已经实现或上游已保证的能力。
