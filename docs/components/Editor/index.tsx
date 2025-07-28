import {
  SandpackCodeEditor,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
} from "@codesandbox/sandpack-react";
import fs from "fs";
import path from "path";
import dedent from "dedent";
import { memo } from "react";

interface EditorProps {
  title?: string;
  description?: string;
  file: string;
  height?: string;
  previewMode?: boolean;
}

async function Editor(props: EditorProps) {
  const { file, height = "500px", previewMode = false } = props;
  const filePath = path.join(process.cwd(), "app/playground", file, "page.tsx");
  // 读取文件内容
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const files = loadLocalPackageFiles("@live2d-motionsync/core");

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Editor Container */}
      <div className="relative">
        {/* Toolbar */}
        <div
          style={{
            display: previewMode ? "none" : "flex",
          }}
          className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2"
        >
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
          <SandpackProvider
            template={"react-ts"}
            theme="light"
            files={{
              "/App.tsx": fileContent,
              "/styles.css": dedent`
                html,body,#root {
                  margin: 0;
                  padding: 0;
                  width: 100%;
                  height: 100%;
                  box-sizing: border-box;
                }
              `,

              ...files,
            }}
            options={{
              visibleFiles: ["/App.tsx", "/styles.css"],
              autorun: true,
              initMode: "user-visible",
              initModeObserverOptions: { rootMargin: "1400px 0px" },
              bundlerURL: "https://sandpack-bundler.li-yao.me",
            }}
            customSetup={{
              dependencies: {
                "@live2d-motionsync/core": "0.0.1-test-02",
              },
            }}
          >
            <SandpackLayout
              style={
                {
                  "--sp-layout-height": height,
                } as React.CSSProperties
              }
            >
              {!previewMode && <SandpackCodeEditor />}
              <SandpackPreview />
            </SandpackLayout>
          </SandpackProvider>
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
