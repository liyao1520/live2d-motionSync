import { Sandpack } from "@codesandbox/sandpack-react";
import { memo } from "react";

interface EditorProps {
  title?: string;
  description?: string;
  status?: "running" | "stopped" | "error";
  category?: string;
  tags?: string[];
}

function Editor(props: EditorProps) {
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
            template="react"
            theme="light"
            options={{
              editorHeight: "600px",
              autorun: true,
              initMode: "user-visible",
              initModeObserverOptions: { rootMargin: "1400px 0px" },
              bundlerURL: "https://786946de.sandpack-bundler-4bw.pages.dev",
            }}
            customSetup={{
              dependencies: {
                react: "^18.0.0",
                "react-dom": "^18.0.0",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(Editor);
