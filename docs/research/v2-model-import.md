# 2.0 ZIP 与本地文件模型导入调研

日期：2026-09-16。用户要求新增可行性调研。本文基于官方格式文档、浏览器 API 文档、解压库文档及候选渲染器源码；未实现或运行导入 PoC。

## 结论

可以设计“选择一个完整 ZIP → 浏览器本地解压 → 自动识别模型 → 渲染并接入口型”的功能，不必先上传服务器。也可以支持包含相对路径的文件集合。单独的标准 model3.json 或 moc3 不是通常意义上的完整模型包；只选择一个本地文件不会自动授权网页访问其旁边的文件。

建议首发提供现有远程 model3 URL、完整 ZIP File/Blob、带路径文件集合三种入口；ZIP 是单文件交付的优先方案。不另发明自定义单文件模型格式，不承诺直接运行 cmo3 编辑工程或解压 RAR/7z。

## 输入能力边界

| 输入 | 是否可实现 | 条件/行为 |
| --- | --- | --- |
| 远程 model3.json URL | 是，保留现有能力 | 相对引用的 moc3、纹理等可访问；跨域需允许读取 |
| 本地完整 ZIP File/Blob | 是，建议首发 | 含至少一个 model3 入口及必要依赖，保持目录；浏览器本地解压 |
| 远程 ZIP URL | 工程上可行，是否首发待范围确认 | fetch 同源或正确 CORS；再走同一归档管线；不能靠扩展名识别所有 URL |
| 文件夹选择/带路径的文件集合 | 是，建议支持底层入口 | 提供 webkitRelativePath 或显式 `{path, file}`；文件夹选择 UI 是否可用由浏览器决定 |
| 普通 FileList 多选 | 有条件 | 通常只有 basename，没有目录关系；不能随意猜同名 texture_00.png 的来源；缺路径时要求显式映射 |
| 单个本地 model3.json | 通常不能独立完成 | 它是资源清单，需要其引用文件；如果用户显式提供资源集合或受控 base URL 可以加载 |
| 单个 moc3 | 不承诺完整展示 | 保存模型结构但通常没有纹理；提供额外纹理/映射可作为高级功能，首发不猜配置 |
| cmo3/can3 编辑工程 | 不作为 SDK 输入 | 先由 Cubism Editor 导出运行时资源 |
| 自包含定制文件（Base64 JSON 等） | 技术上可另行设计 | 增加格式维护和内存成本，本期不推荐；ZIP 已满足单文件体验 |

官方说明 model3.json 关联 moc3、纹理等资源，物理等也采用独立文件；编辑器默认导出 model3、moc3、纹理。来源：[模型结构](https://docs.live2d.com/en/cubism-sdk-manual/model-web/)、[运行时数据导出](https://docs.live2d.com/en/cubism-editor-manual/export-moc3-motion3-files/)。文件选择与目录相对路径依据：[File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications)、[webkitdirectory](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/webkitdirectory)。

## 统一资源管线

1. Source 接受 URL、ZIP、带路径文件集合；类型明确，不仅按文件后缀猜测。
2. 本地来源形成 `ModelAssetBundle`，维护路径→Blob/字节索引。ZIP 只读取必要条目，解压支持取消、进度及输出容量限制。
3. 查找 model3.json：唯一入口自动选择；多入口时返回候选列表，让应用展示选择或传 entry，不偷偷选择首项。忽略 __MACOSX/资源叉等明显非模型条目。
4. 从模型入口目录解析所有已知文件引用，规范化 `.` 和 `..`，合法父目录引用只允许在归档根内；禁止逃出归档根。路径保留大小写，规范化后重复路径明确报错。
5. `ModelResourceResolver` 负责 `readJson`、`readBytes` 和面向纹理/上游加载器的 URL。渲染器和 LipSyncDriver 共享同一 resolver，禁止 MotionSync 再按旧逻辑直接拼网络 URL。
6. 检查 moc3/纹理等必需依赖，再创建模型；可选能力缺失按显式策略报告。未声明 MotionSync 可基础降级；声明了配置却丢失或损坏，默认返回具体诊断，不静默掩盖。
7. 创建按会话隔离的 Blob URL；懒加载动作/表情可能后续访问，不能模型首帧出现就 revoke。销毁、失败或取消时待相关请求停止后统一回收 URL、解压缓存与加载句柄。

Blob URL 不是文件夹，不可直接把 model3 的相对文件名拼接在其后；应通过 resolver 或已知引用字段映射。浏览器 Blob URL 的创建和回收依据：[createObjectURL](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL_static)。

本项目模型还包含 `Motions[].MotionSync: "Vowels_CRI"`，这是配置选择标识，不是文件路径。不能把所有 JSON 字符串一律替换为 Blob URL。应按 schema 处理 Moc、Textures、Physics、Pose、Expressions.File、Motions.File/Sound、UserData、DisplayInfo、FileReferences.MotionSync 等已知资源字段，并对未来版本扩展明确定义行为。

本地包默认只读取包内资源，不因包中的外部 URL 自动发起网络请求；远程模型保持 URL 相对解析。若后续支持本地与远程混合，应作为明确的可配置模式。

## 与渲染器的适配

Untitled 的 FileLoader 仅能作为实现参考，不能当作完整 ZIP 支持。应通过本项目适配层生成上游可读取的 settings/资源映射，验证 texture、懒加载 motion、expression、physics 及 MotionSync 同时工作。尽量不修改全局 fetch，不安装持久 Service Worker，不把 JS 脚本当模型资源执行。

具体源码核查见 [渲染器导入能力](./v2-model-import-renderer.md)。核心验收是：在正式 npm 产物里单次传 ZIP 可运行，无需使用者另装解压插件、配置全局变量或自行管理 Blob URL。

## ZIP 实现候选

优先验证 fflate：提供 ZIP、异步及流式解压，适合普通未加密 Store/Deflate ZIP；按需加载解压功能，避免 URL 模型路径无条件初始化解压器。官方文档提供条目筛选和流式取消机制。本次未运行速度或包体积基准，不使用 README 宣称的性能作为本项目结论。[fflate](https://github.com/101arrowz/fflate)

zip.js 作为备选：官方提供 ZIP64、加密、流及 worker 方案，能力更广；具体构建变体存在不同 API、WASM 与浏览器要求。若需求扩大到超大/加密归档再考虑，不为了支持普通模型 ZIP 增加首发格式范围。[zip.js](https://gildas-lormeau.github.io/zip.js/)

两者都需要我们自己定义输入上限、模型依赖校验和资源所有权。最大压缩体积、实际解压总量、条目数、单纹理像素数必须有限且可配置；不能只信任 ZIP 头里的大小，也不能等全部解压完再检查。性能验收重点是移动端峰值内存（归档、解压数据、图像解码、GPU纹理可能同时存在），不是只比较下载大小。

## API 草图（尚未实现）

```ts
const player = await createLive2DPlayer({
  canvas,
  model: { type: 'zip', file: zipFile },
});

// 包内有多个模型时，可指定入口。
const options = {
  model: { type: 'zip', file: zipFile, entry: 'character/character.model3.json' },
};

// 独立文件以完整集合输入，显式保留原有相对目录。
const filesSource = {
  type: 'files',
  entry: 'character.model3.json',
  files: [
    { path: 'character.model3.json', file: settingsFile },
    { path: 'character.moc3', file: mocFile },
    { path: 'textures/texture_00.png', file: textureFile },
    // 添加该 model3 引用的其他资源。
  ],
};
```

这是传入一个 source 的 API，而不是强迫用户学习 resolver；目录选择和拖拽仅是应用层获取 source 的方式。SDK 不擅自弹文件选择框；示例提供完整上传/拖拽 UI。错误携带 entry、缺失路径与可选模型候选列表。

## PoC 验收

- 当前 kei 模型打成 ZIP，在阻止外网请求的测试页仍可显示、执行动作并读取 MotionSync 配置（SDK运行时需事先按交付设计可用）。
- 根目录/多层目录、中文和空格路径、同名纹理、合法父目录引用、重复路径、多个模型入口。
- 缺少 moc3/纹理、未声明配置、声明配置但文件不存在、损坏 JSON、超限归档、取消解压。
- 模型加载后延迟触发动作/表情，确认 Blob URL 未提前释放；连续导入/销毁和并发导入互不影响。
- 从 npm tarball 消费，验证解压 worker 与资源路径在 Vite/Next 客户端及移动浏览器的表现。

## 待用户确认

“独立文件”是否指一组未压缩的运行时文件，还是期望单独一个 model3/moc3 就能完整展示。建议首发为完整 ZIP + 带路径文件集合 + 原有远程 model3 URL；不承诺缺少资源时凭空生成模型内容。Q13 原有会话行为确认仍独立待答，本次增加导入研究不代表替代此前问题。
