import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export default async function Editor({
  file,
  title = '2.0 示例',
  height = '520px',
  previewMode = false,
}: {
  file: string;
  title?: string;
  height?: string;
  previewMode?: boolean;
}) {
  if (!['base', 'appendPlay'].includes(file)) throw new Error('Unknown example');
  const code = await readFile(join(process.cwd(), 'components', 'PlayerDemo.tsx'), 'utf8');
  return (
    <section>
      <h3>{title}</h3>
      {!previewMode && (
        <details>
          <summary>查看完整 React 示例</summary>
          <pre className="overflow-auto text-sm">
            <code>{code}</code>
          </pre>
        </details>
      )}
      <iframe
        title={title}
        src={`/cn/playground/${file}`}
        style={{ width: '100%', height, border: '1px solid #bbb', borderRadius: 12 }}
      />
    </section>
  );
}
