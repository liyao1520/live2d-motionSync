import { mkdtemp, writeFile, cp, readdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../', import.meta.url));
const directory = await mkdtemp(join(tmpdir(), 'motionsync-consumer-'));
const pnpmScript = process.env.npm_execpath;
if (!pnpmScript) throw new Error('Run this script with pnpm test:package');
function run(args, cwd) {
  return new Promise((resolve, reject) => {
    const executable = pnpmScript.toLowerCase().endsWith('.exe');
    const child = spawn(
      executable ? pnpmScript : process.execPath,
      executable ? args : [pnpmScript, ...args],
      {
        cwd,
        stdio: 'inherit',
        windowsHide: true,
      },
    );
    child.on('error', reject);
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(`pnpm ${args[0]} exited ${code}`)),
    );
  });
}
await run(['pack', '--pack-destination', directory], join(root, 'packages/core'));
const tarball = (await readdir(directory)).find((file) => file.endsWith('.tgz'));
await writeFile(
  join(directory, 'package.json'),
  JSON.stringify({
    private: true,
    type: 'module',
    dependencies: { '@live2d-motionsync/core': `file:./${tarball}`, vite: '8.3.0' },
  }),
);
await writeFile(
  join(directory, 'index.html'),
  '<html><body><div style="height:500px"><canvas></canvas></div><script type="module" src="/main.js"></script></body></html>',
);
await writeFile(
  join(directory, 'main.js'),
  `import { createPlayer } from '@live2d-motionsync/core';
window.errors=[];
try {
  const player=await createPlayer({canvas:document.querySelector('canvas'),model:'/models/kei_vowels_pro/kei_vowels_pro.model3.json'});
  player.on('error',e=>window.errors.push(e.message)); window.player=player; window.mode=player.capabilities.lipSync;
} catch(e) { window.errors.push(e.message); }
`,
);
// Only model/audio assets, no Core scripts or manual runtime configuration.
await cp(join(root, 'docs/public'), join(directory, 'public'), { recursive: true });
await run(['install', '--ignore-workspace', '--ignore-scripts', '--prefer-offline'], directory);
await run(['exec', 'vite', 'build'], directory);
const { preview } = await import(
  new URL('../node_modules/vite/dist/node/index.js', import.meta.url)
);
const server = await preview({
  root: directory,
  configFile: false,
  preview: { host: '127.0.0.1', port: 5188, strictPort: true },
});
const browser = await chromium.launch({
  args: [
    '--autoplay-policy=no-user-gesture-required',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
try {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('http://127.0.0.1:5188');
  await page.waitForFunction(() => window.mode || window.errors?.length, undefined, {
    timeout: 45000,
  });
  const result = await page.evaluate(async () => {
    if (!window.player) return { mode: window.mode, errors: window.errors };
    const p = window.player;
    await p.unlockAudio();
    const job = p.play('/demo.wav');
    await new Promise((r) => setTimeout(r, 1600));
    const mouth = Array.from(p.driver.native?.values ?? []).some((v) => v > 0.01);
    job.stop();
    await p.destroy();
    return { mode: window.mode, mouth, errors: window.errors };
  });
  if (result.mode !== 'motionsync' || !result.mouth || result.errors.length || errors.length)
    throw new Error(JSON.stringify({ result, errors }));
  console.log('Packed npm consumer passed:', directory);
} finally {
  await browser.close();
  await new Promise((resolve) => server.httpServer.close(resolve));
}
