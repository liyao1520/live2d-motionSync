# 2.0 接入示例

在仓库根目录执行 `pnpm install`、`pnpm build`，然后运行任意一个：

- `pnpm --filter example-vanilla dev`
- `pnpm --filter example-react dev`
- `pnpm --filter example-vue dev`

三个示例消费同一个 SDK 的 dist 导出，Vite 的 publicDir 仅用于共享仓库演示模型和音频，不负责加载 Core。Core 运行时已随 SDK 构建产物交付。
复制到自己的项目后，将 workspace 依赖替换为已获准分发的包版本或本地 tgz，并提供自己有权使用的模型资源。
React 示例开启 StrictMode，处理异步加载取消和 effect 清理。
