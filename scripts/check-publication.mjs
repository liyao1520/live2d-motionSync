import { readFile } from 'node:fs/promises';
const manifest = JSON.parse(
  await readFile(new URL('../vendor/runtime-manifest.json', import.meta.url), 'utf8'),
);
if (!manifest.publicDistributionConfirmed) {
  throw new Error(
    'Public npm redistribution of the bundled Live2D Core runtimes is not yet confirmed. See docs/research/v2-runtime-distribution.md. Local build/pack/testing remains available.',
  );
}
