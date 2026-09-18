import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('vendor/runtime-manifest.json', root), 'utf8'));
const target = new URL('packages/core/src/generated/', root);
await mkdir(target, { recursive: true });
for (const [name, file] of Object.entries({
  cubism: 'live2dcubismcore.min.js',
  motionsync: 'live2dcubismmotionsynccore.min.js',
})) {
  const bytes = await readFile(new URL(`packages/core/src/assets/${file}`, root));
  const hash = createHash('sha256').update(bytes).digest('hex');
  const expected = name === 'cubism' ? manifest.cubism.sha256 : manifest.motionSync.sha256;
  if (hash !== expected) throw new Error(`Runtime checksum mismatch: ${file}`);
  // JSON encoding is reversible: the script executed in the Blob is byte-for-byte the vendored JS.
  await writeFile(
    new URL(`${name}.ts`, target),
    `// Generated; source SHA-256 ${hash}. Do not edit.\nexport default ${JSON.stringify(bytes.toString('utf8'))};\n`,
  );
}
