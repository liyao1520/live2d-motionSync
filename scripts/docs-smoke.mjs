import { chromium } from '@playwright/test';
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
  page.on('pageerror', (error) => errors.push(`${page.url()}: ${error.message}`));
  page.on('console', (message) => {
    if (message.type() === 'error') console.error(message.text());
  });
  const base = process.env.DOCS_BASE_URL ?? 'http://127.0.0.1:3001';
  await page.goto(`${base}/cn/playground/base`);
  await page
    .getByRole('status')
    .filter({ hasText: '就绪' })
    .waitFor({ timeout: 45000 })
    .catch(async (error) => {
      console.error(await page.locator('body').innerText(), errors);
      throw error;
    });
  await page.getByRole('button', { name: '播放 / 打断' }).click();
  await page.getByRole('status').filter({ hasText: 'playing' }).waitFor();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '停止并清空队列' }).click();
  await page.goto(`${base}/cn/docs/quick-start`, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await page.getByRole('heading', { name: '2.0 快速开始', exact: true }).waitFor();
  await page.waitForTimeout(1200);
  if (errors.length) throw new Error(JSON.stringify(errors));
  console.log('Next production docs / client playback passed');
} finally {
  await browser.close();
}
