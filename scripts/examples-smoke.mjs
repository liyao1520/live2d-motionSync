import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  args: [
    '--autoplay-policy=no-user-gesture-required',
    '--use-angle=swiftshader',
    '--enable-unsafe-swiftshader',
  ],
});
try {
  for (const name of ['vanilla', 'react', 'vue']) {
    const root = fileURLToPath(new URL(`../examples/${name}/`, import.meta.url));
    const server = await preview({
      root,
      configFile: false,
      preview: { host: '127.0.0.1', port: 5189, strictPort: true },
    });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    try {
      await page.goto('http://127.0.0.1:5189');
      await page.waitForFunction(
        () => document.querySelector('output')?.textContent === '就绪',
        undefined,
        { timeout: 30000 },
      );
      await page.getByRole('button', { name: '播放', exact: true }).click();
      await page.waitForTimeout(1000);
      if ((await page.locator('output').textContent()) !== '就绪' || errors.length)
        throw new Error(
          `${name}: ${JSON.stringify(errors)} ${await page.locator('output').textContent()}`,
        );
      await page.getByRole('button', { name: '停止', exact: true }).click();
      console.log(`${name} production browser smoke passed`);
    } finally {
      await page.close();
      await new Promise((resolve) => server.httpServer.close(resolve));
    }
  }
} finally {
  await browser.close();
}
