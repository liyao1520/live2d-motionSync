import { Sandpack } from "@codesandbox/sandpack-react";
import fs from "fs";
import path from "path";
import { memo } from "react";

interface EditorProps {
  title?: string;
  description?: string;
  file: string;
}

async function Editor(props: EditorProps) {
  const { file } = props;
  const filePath = path.join(process.cwd(), "codes", file);
  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const files = loadLocalPackageFiles("@live2d-motionsync/core");

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Editor Container */}
      <div className="relative">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              {props.title || "代码编辑器"}
            </span>
            {props.description && (
              <span className="hidden text-xs text-gray-500 sm:inline">
                - {props.description}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-500">实时预览</span>
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400"></div>
          </div>
        </div>

        {/* Sandpack Editor */}
        <div className="relative">
          <Sandpack
            template={"react"}
            theme="light"
            files={{
              "/App.js": fileContent,
              ...files,
            }}
            customSetup={{
              // npmRegistries: [
              //   {
              //     enabledScopes: [],
              //     limitToScopes: false,
              //     registryUrl: "https://registry.npmmirror.com/",
              //     proxyEnabled: false,
              //   },
              // ],
              dependencies: {
                "@live2d-motionsync/core": "0.0.1-test-02",
              },
            }}
            options={{
              editorHeight: "600px",
              autorun: true,
              initMode: "user-visible",
              initModeObserverOptions: { rootMargin: "1400px 0px" },
              bundlerURL: "https://sandpack-bundler-service.vercel.app",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function loadLocalPackageFiles(packageName: string) {
  const code = fs.readFileSync(
    path.join(
      process.cwd(),
      "node_modules",
      packageName,
      "dist/sandpack/index.js"
    ),
    "utf-8"
  );
  return {
    [`/node_modules/${packageName}/index.js`]: {
      hidden: true,
      code,
    },
    [`/node_modules/${packageName}/package.json`]: {
      hidden: true,
      code: JSON.stringify({
        name: packageName,
        main: "./index.js",
      }),
    },
  };
}

export default memo(Editor);
