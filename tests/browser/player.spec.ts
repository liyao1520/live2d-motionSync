import { test, expect } from '@playwright/test';
import { createRequire } from 'node:module';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
const { zipSync } = createRequire(resolve('packages/core/package.json'))('fflate');

test('motion, expression and pointer hit APIs work on a rendered model', async ({ page }) => {
  const json = JSON.parse(
    readFileSync('docs/public/models/kei_vowels_pro/kei_vowels_pro.model3.json', 'utf8'),
  );
  json.FileReferences.Expressions = [{ Name: 'probe', File: 'probe.exp3.json' }];
  await page.route('**/kei_vowels_pro.model3.json', (route) => route.fulfill({ json }));
  await page.route('**/probe.exp3.json', (route) =>
    route.fulfill({
      json: {
        Type: 'Live2D Expression',
        FadeInTime: 0,
        FadeOutTime: 0,
        Parameters: [{ Id: 'ParamMouthOpenY', Value: 1, Blend: 'Overwrite' }],
      },
    }),
  );
  await page.goto('/');
  await page.getByRole('button', { name: '加载模型', exact: true }).click();
  await expect(page.locator('#status')).toContainText('模型已就绪', { timeout: 45000 });
  const controls = await page.evaluate(async () => {
    const p = (window as any).getPlayer();
    (window as any).hits = [];
    p.on('hit', ({ areas }: { areas: string[] }) => (window as any).hits.push(...areas));
    const parameter = p.renderer.parameters.find((v: { id: string }) => v.id === 'ParamMouthOpenY');
    p.renderer.internal.on('beforeModelUpdate', () => {
      (window as any).expressionValue = p.renderer.internal.coreModel.getParameterValueByIndex(
        parameter.index,
      );
    });
    const motion = await p.model.playMotion(p.model.motions[0]);
    const expression = await p.model.setExpression('probe');
    return { motion, expression };
  });
  expect(controls).toEqual({ motion: true, expression: true });
  await expect
    .poll(() => page.evaluate(() => (window as any).expressionValue))
    .toBeGreaterThan(0.9);
  const box = await page.locator('canvas').boundingBox();
  await page.locator('canvas').click({ position: { x: box!.width * 0.6, y: box!.height * 0.4 } });
  await expect.poll(() => page.evaluate(() => (window as any).hits)).toContain('Head');
  await page.getByRole('button', { name: '卸载模型' }).click();
});
test('real model renders, plays official MotionSync, interrupts and destroys', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: '加载模型', exact: true }).click();
  await expect(page.locator('#status')).toContainText('模型已就绪', { timeout: 45000 });
  await expect(page.locator('#status')).toContainText('motionsync');
  await page.evaluate(() => {
    const p = (window as any).getPlayer();
    (window as any).audioErrors = [];
    p.on('error', (e: Error) => (window as any).audioErrors.push(e.message));
  });
  await page.getByRole('button', { name: '播放 / 打断' }).click();
  await expect(page.locator('#status')).toContainText('playing');
  await page.waitForTimeout(1500);
  expect(await page.evaluate(() => (window as any).audioErrors)).toEqual([]);
  await expect
    .poll(() =>
      page.evaluate(() =>
        Array.from((window as any).getPlayer().driver.native?.values ?? []).some(
          (v) => Number(v) > 0.05,
        ),
      ),
    )
    .toBe(true);
  await page.screenshot({ path: 'test-results/player.png' });
  await page.getByRole('button', { name: '播放 / 打断' }).click();
  await page.getByRole('button', { name: '停止', exact: true }).click();
  await page.getByRole('button', { name: '卸载模型' }).click();
  await expect(page.locator('#status')).toHaveText('已卸载');
  expect(errors).toEqual([]);
});

test('complete nested ZIP and file bundle both render without external model requests', async ({
  page,
}) => {
  const root = resolve('docs/public/models/kei_vowels_pro');
  const files = Object.fromEntries(
    readdirSync(root, { recursive: true, withFileTypes: true })
      .filter((f) => f.isFile())
      .map((f) => {
        const absolute = resolve(f.parentPath, f.name);
        return ['角色/' + relative(root, absolute).replaceAll('\\', '/'), readFileSync(absolute)];
      }),
  );
  const zip = zipSync(files);
  await page.goto('/');
  await page.route('**/models/**', (route) => route.abort());
  await page
    .locator('#zip')
    .setInputFiles({ name: 'model.zip', mimeType: 'application/zip', buffer: Buffer.from(zip) });
  await expect(page.locator('#status')).toContainText('模型已就绪', { timeout: 45000 });
  await expect(page.locator('#status')).toContainText('motionsync');
  await page.getByRole('button', { name: '播放 / 打断' }).click();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Array.from((window as any).getPlayer().driver.native?.values ?? []).some(
          (v) => Number(v) > 0.05,
        ),
      ),
    )
    .toBe(true);
  await page.getByRole('button', { name: '卸载模型' }).click();
  await expect(page.locator('#status')).toHaveText('已卸载');
  const payload = Object.entries(files).map(([path, bytes]) => ({
    path,
    data: (bytes as Buffer).toString('base64'),
  }));
  const mode = await page.evaluate(async (files) => {
    const entries = files.map((f) => ({
      path: f.path,
      file: new Blob([Uint8Array.from(atob(f.data), (c) => c.charCodeAt(0))]),
    }));
    const p = await (window as any).sdk.createPlayer({
      canvas: document.querySelector('canvas'),
      model: { type: 'files', files: entries },
    });
    const result = p.capabilities.lipSync;
    await p.destroy();
    return result;
  }, payload);
  expect(mode).toBe('motionsync');
});

test('background pauses files and discards realtime PCM without replay on foreground', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: '加载模型', exact: true }).click();
  await expect(page.locator('#status')).toContainText('模型已就绪', { timeout: 45000 });
  const result = await page.evaluate(async () => {
    const p = (window as any).getPlayer();
    await p.unlockAudio();
    let hidden = false;
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
    const visibility = (value: boolean) => {
      hidden = value;
      document.dispatchEvent(new Event('visibilitychange'));
    };
    const pcm = p.createPcmStream({ sampleRate: 24000, channels: 1, format: 'f32' });
    await pcm.write(new Float32Array(24000));
    visibility(true);
    const retained = p.audio.packets.length;
    await pcm.write(new Float32Array(24000));
    visibility(false);
    const before = performance.now();
    await pcm.write(new Float32Array(2400));
    await pcm.end();
    const duration = performance.now() - before;
    const audio = new AudioBuffer({ length: 24000, sampleRate: 24000 });
    const job = p.play(audio);
    await new Promise((r) => setTimeout(r, 100));
    visibility(true);
    const paused = !p.audio.fileState.node;
    await new Promise((r) => setTimeout(r, 1100));
    const pending = !p.audio.fileState.session.settled;
    visibility(false);
    await job.finished;
    await p.destroy();
    delete (document as any).hidden;
    return { retained, duration, paused, pending };
  });
  expect(result.retained).toBe(0);
  expect(result.duration).toBeLessThan(600);
  expect(result.paused && result.pending).toBe(true);
});

test('PCM backpressure, cancellation, FIFO queue and MediaStream ownership', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '加载模型', exact: true }).click();
  await expect(page.locator('#status')).toContainText('模型已就绪', { timeout: 45000 });
  const result = await page.evaluate(async () => {
    const p = (window as any).getPlayer();
    const errors: string[] = [];
    p.on('error', (e: Error) => errors.push(e.message));
    await p.unlockAudio();
    const pcm = p.createPcmStream({ sampleRate: 24000, channels: 1, format: 'f32' });
    const tone = Float32Array.from(
      { length: 24000 * 3 },
      (_, i) => Math.sin((i * 440 * Math.PI * 2) / 24000) * 0.2,
    );
    const before = performance.now();
    await pcm.write(tone);
    const waited = performance.now() - before;
    const pcmResult = await pcm.end();
    const cancelled = p.createPcmStream({ sampleRate: 24000, channels: 1, format: 'f32' });
    cancelled.stop();
    const context = new AudioContext();
    await context.resume();
    const buffer = context.createBuffer(1, 4800, 48000);
    const order: number[] = [];
    const a = p.play(buffer);
    a.finished.then(() => order.push(1));
    const b = p.enqueue(buffer);
    b.finished.then(() => order.push(2));
    await Promise.all([a.finished, b.finished]);
    const destination = context.createMediaStreamDestination();
    const oscillator = context.createOscillator();
    oscillator.connect(destination);
    oscillator.start();
    const capture = p.attachStream(destination.stream);
    await new Promise((r) => setTimeout(r, 350));
    capture.stop();
    const live = destination.stream.getAudioTracks()[0].readyState;
    oscillator.stop();
    destination.stream.getTracks().forEach((t) => t.stop());
    await context.close();
    await p.destroy();
    return { waited, pcmResult, cancelled: await cancelled.finished, order, live, errors };
  });
  expect(result.waited).toBeGreaterThan(700);
  expect(result.pcmResult.status).toBe('completed');
  expect(result.cancelled.status).toBe('cancelled');
  expect(result.order).toEqual([1, 2]);
  expect(result.live).toBe('live');
  expect(result.errors).toEqual([]);
});

test('two players have independent textures and amplitude fallback survives peer teardown', async ({
  page,
}) => {
  await page.goto('/');
  const result = await page.evaluate(async () => {
    const { createPlayer } = (window as any).sdk;
    const create = () => {
      const c = document.createElement('canvas');
      document.querySelector('.stage')!.append(c);
      return c;
    };
    const config = {
      model: '/models/kei_vowels_pro/kei_vowels_pro.model3.json',
      lipSync: { mode: 'amplitude' },
    };
    const a = await createPlayer({ ...config, canvas: create() });
    const b = await createPlayer({ ...config, canvas: create() });
    await a.destroy();
    await a.destroy();
    await b.unlockAudio();
    const pcm = b.createPcmStream({ sampleRate: 24000, channels: 1, format: 'f32' });
    await pcm.write(new Float32Array(12000).fill(0.25));
    await new Promise((r) => setTimeout(r, 150));
    const envelope = b.driver.envelope;
    const gl = b.renderer.app.renderer.gl;
    const glError = gl.getError();
    const mode = b.capabilities.lipSync;
    await pcm.end();
    await b.destroy();
    return { mode, envelope, glError };
  });
  expect(result.mode).toBe('amplitude');
  expect(result.envelope).toBeGreaterThan(0.1);
  expect(result.glError).toBe(0);
});
