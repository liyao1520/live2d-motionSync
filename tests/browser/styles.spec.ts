import { test, expect } from '@playwright/test';

test('initial React loading shell is styled before the application module loads', async ({
  page,
}) => {
  await page.route(/\/src\/main\.tsx(?:\?.*)?$/, (route) => route.abort());
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('.boot-screen')).toHaveCSS('display', 'flex');
  await expect(page.locator('body')).toHaveCSS('margin-top', '0px');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(247, 248, 250)');
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
});

test('React studio presents model and audio controls on desktop and mobile', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '让角色，开口说话。' })).toBeVisible();
  await expect(page.getByRole('button', { name: '播放 / 打断' })).toBeDisabled();
  await page.screenshot({ path: 'test-results/studio-desktop.png', fullPage: true });
  await page.getByRole('button', { name: '本地导入', exact: true }).click();
  await expect(page.getByRole('button', { name: '选择模型 ZIP', exact: false })).toBeVisible();
  await page.getByRole('button', { name: '模型链接', exact: true }).click();
  await expect(page.locator('#model')).toHaveValue(
    '/models/kei_vowels_pro/kei_vowels_pro.model3.json',
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator('.workspace')).toHaveCSS('flex-direction', 'column');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.screenshot({ path: 'test-results/studio-mobile.png', fullPage: true });
});
