import { Link } from "react-router";
import { cn } from "../utils/cn";

interface DemoCard {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "ready" | "coming-soon" | "beta";
  path?: string;
}

const demoList: DemoCard[] = [
  {
    id: "basic-motion-sync",
    title: "基础动作同步",
    description: "展示Live2D模型与音频的基本动作同步功能",
    category: "核心功能",
    status: "ready",
    path: "/demo/basic-motion-sync",
  },
  {
    id: "advanced-motion-sync",
    title: "高级动作同步",
    description: "包含表情变化、身体动作等复杂同步效果",
    category: "核心功能",
    status: "ready",
    path: "/demo/advanced-motion-sync",
  },
  {
    id: "real-time-audio",
    title: "实时音频处理",
    description: "实时音频输入与Live2D模型的同步演示",
    category: "音频处理",
    status: "beta",
    path: "/demo/real-time-audio",
  },
  {
    id: "custom-mapping",
    title: "自定义映射配置",
    description: "自定义音频参数到Live2D参数的映射关系",
    category: "配置管理",
    status: "ready",
    path: "/demo/custom-mapping",
  },
  {
    id: "multi-model",
    title: "多模型支持",
    description: "同时控制多个Live2D模型的同步效果",
    category: "高级功能",
    status: "coming-soon",
  },
  {
    id: "performance-test",
    title: "性能测试",
    description: "测试不同配置下的性能表现和优化建议",
    category: "工具",
    status: "coming-soon",
  },
  {
    id: "test1",
    title: "测试页面1",
    description: "现有的测试页面示例",
    category: "测试",
    status: "ready",
    path: "/test1",
  },
];

const getStatusColor = (status: DemoCard["status"]) => {
  switch (status) {
    case "ready":
      return "bg-green-100 text-green-800 border-green-200";
    case "beta":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "coming-soon":
      return "bg-gray-100 text-gray-600 border-gray-200";
  }
};

const getStatusText = (status: DemoCard["status"]) => {
  switch (status) {
    case "ready":
      return "可用";
    case "beta":
      return "测试版";
    case "coming-soon":
      return "即将推出";
  }
};

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Live2D MotionSync
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                音频驱动的Live2D模型动作同步演示
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/your-repo/live2d-motionSync"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 transition-colors hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Introduction */}
        <div className="mb-8">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              欢迎使用 Live2D MotionSync
            </h2>
            <p className="leading-relaxed text-gray-600">
              Live2D MotionSync 是一个强大的音频驱动Live2D模型动作同步库。
              通过实时音频分析，可以让您的Live2D角色根据音频内容进行自然的动作和表情变化。
              选择下面的演示来体验不同的功能特性。
            </p>
          </div>
        </div>

        {/* Demo Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {demoList.map((demo) => (
            <div
              key={demo.id}
              className={cn(
                "overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200",
                demo.status === "ready" && demo.path
                  ? "cursor-pointer hover:border-blue-300 hover:shadow-md"
                  : "opacity-75",
              )}
            >
              <div className="p-6">
                <div className="mb-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {demo.title}
                  </h3>
                  <span
                    className={cn(
                      "rounded-full border px-2 py-1 text-xs font-medium",
                      getStatusColor(demo.status),
                    )}
                  >
                    {getStatusText(demo.status)}
                  </span>
                </div>

                <p className="mb-4 text-sm leading-relaxed text-gray-600">
                  {demo.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                    {demo.category}
                  </span>

                  {demo.status === "ready" && demo.path ? (
                    <Link
                      to={demo.path}
                      className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                    >
                      开始体验
                      <svg
                        className="ml-1 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-400">
                      {demo.status === "coming-soon" ? "敬请期待" : "测试中"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              需要帮助？
            </h3>
            <p className="mb-4 text-gray-600">查看文档或提交问题来获得支持</p>
            <div className="flex justify-center space-x-4">
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                查看文档
              </a>
              <a
                href="#"
                className="font-medium text-blue-600 hover:text-blue-700"
              >
                提交问题
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
