import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';

test('dropping a ZIP highlights the target and loads a real model', async ({ page }) => {
  const { zipSync } = createRequire(resolve('packages/core/package.json'))('fflate');
  const root = resolve('docs/public/models/kei_vowels_pro');
  const files = Object.fromEntries(
    readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const path = resolve(entry.parentPath, entry.name);
        return ['角色/' + relative(root, path).replaceAll('\\', '/'), readFileSync(path)];
      }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: '本地导入', exact: true }).click();
  const data = await page.evaluateHandle(
    (base64) => {
      const transfer = new DataTransfer();
      transfer.items.add(
        new File([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], '角色.zip'),
      );
      return transfer;
    },
    Buffer.from(zipSync(files)).toString('base64'),
  );
  const zone = page.locator('.upload-zone');
  await zone.dispatchEvent('dragenter', { dataTransfer: data });
  await expect(zone).toHaveClass(/is-dragging/);
  await zone.dispatchEvent('drop', { dataTransfer: data });
  await expect(zone).not.toHaveClass(/is-dragging/);
  await expect(page.locator('#status')).toContainText('模型已就绪', { timeout: 45000 });
  await expect(page.locator('.model-info strong')).toHaveText('角色');
  await data.dispose();
});

test('folder drops preserve nested paths and exhaust directory batches', async ({ page }) => {
  await page.goto('/');
  const paths = await page.evaluate(async () => {
    const modulePath = '/src/droppedFiles.ts';
    const { readDroppedFiles } = await import(modulePath);
    const file = (path: string) => ({
      isFile: true,
      fullPath: path,
      file: (done: (file: File) => void) => done(new File(['test'], path.split('/').pop()!)),
    });
    const folder = (batches: unknown[][]) => ({
      isDirectory: true,
      createReader: () => ({
        readEntries: (done: (batch: unknown[]) => void) => done(batches.shift() ?? []),
      }),
    });
    const entry = folder([
      [file('/角色/model.model3.json')],
      [folder([[file('/角色/textures/texture.png')], []])],
      [],
    ]);
    return (
      await readDroppedFiles({
        items: [{ kind: 'file', webkitGetAsEntry: () => entry }],
      })
    ).map((item: { path: string }) => item.path);
  });
  expect(paths).toEqual(['角色/model.model3.json', '角色/textures/texture.png']);
});
