import { describe, expect, it } from 'vitest';
import { zipSync, strToU8 } from 'fflate';
import { ModelBundle, normalizePath, unzip, defaultLimits } from '../src/assets/bundle';
describe('model import', () => {
  it('normalizes legal parent references without escaping or collapsing case', () => {
    expect(normalizePath('models/a/../Textures/中文.png')).toBe('models/Textures/中文.png');
    for (const path of ['../x', 'a/../../x', '/root', 'C:\\model', 'https://host/model'])
      expect(() => normalizePath(path)).toThrow();
  });
  it('enforces actual expanded size', async () => {
    const archive = new Blob([zipSync({ 'huge.bin': new Uint8Array(4000) })]);
    await expect(unzip(archive, { ...defaultLimits, expandedBytes: 1024 })).rejects.toThrow();
  });
  it('loads the same MotionSync resource graph and releases owned URLs', async () => {
    const json = {
      Version: 3,
      FileReferences: { Moc: 'a.moc3', Textures: ['t.png'], MotionSync: 'a.motionsync3.json' },
    };
    const zip = new Blob([
      zipSync({
        'nested/a.model3.json': strToU8(JSON.stringify(json)),
        'nested/a.moc3': new Uint8Array(2),
        'nested/t.png': new Uint8Array(2),
        'nested/a.motionsync3.json': strToU8('{"Settings":[]}'),
      }),
    ]);
    const bundle = await ModelBundle.open({ type: 'zip', file: zip });
    expect(await bundle.jsonResource('a.motionsync3.json')).toEqual({ Settings: [] });
    expect(bundle.resolve('t.png')).toMatch(/^blob:/);
    bundle.dispose();
    bundle.dispose();
    expect(() => bundle.resolve('t.png')).toThrow('released');
  });
  it('returns candidates instead of silently choosing one of several models', async () => {
    const file = new Blob(['{}']);
    await expect(
      ModelBundle.open({
        type: 'files',
        files: [
          { path: 'a.model3.json', file },
          { path: 'b.model3.json', file },
        ],
      }),
    ).rejects.toMatchObject({
      code: 'MODEL_ENTRY_REQUIRED',
      details: { candidates: ['a.model3.json', 'b.model3.json'] },
    });
  });
  it('reports a missing declared resource instead of falling back silently', async () => {
    const file = new Blob([
      JSON.stringify({ Version: 3, FileReferences: { Moc: 'a.moc3', Textures: ['t.png'] } }),
    ]);
    await expect(
      ModelBundle.open({ type: 'files', files: [{ path: 'a.model3.json', file }] }),
    ).rejects.toMatchObject({ code: 'MISSING_RESOURCE' });
  });
  it('rejects duplicate normalized paths and pre-cancelled imports', async () => {
    const file = new Blob(['{}']);
    await expect(
      ModelBundle.open({
        type: 'files',
        files: [
          { path: 'a.model3.json', file },
          { path: './a.model3.json', file },
        ],
      }),
    ).rejects.toMatchObject({ code: 'DUPLICATE_PATH' });
    const abort = new AbortController();
    abort.abort();
    await expect(
      unzip(new Blob([zipSync({ a: strToU8('ok') })]), defaultLimits, abort.signal),
    ).rejects.toMatchObject({ code: 'CANCELLED' });
  });
});
