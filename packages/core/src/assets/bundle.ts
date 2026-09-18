import { aborted, check, PlayerError } from '../errors';
import type { ImportLimits, ModelSource } from '../types';

export interface ModelJson {
  Version: number;
  FileReferences: {
    Moc: string;
    Textures: string[];
    Physics?: string;
    Pose?: string;
    DisplayInfo?: string;
    UserData?: string;
    MotionSync?: string;
    Expressions?: { Name: string; File: string }[];
    Motions?: Record<string, { File: string; Sound?: string; [key: string]: unknown }[]>;
  };
  Groups?: { Target: string; Name: string; Ids: string[] }[];
  [key: string]: unknown;
}
export const defaultLimits: ImportLimits = {
  compressedBytes: 128 * 1024 ** 2,
  expandedBytes: 384 * 1024 ** 2,
  files: 4096,
  texturePixels: 4096 ** 2,
};

/** Keep path identity case-sensitive. Parent references may not escape the bundle. */
export function normalizePath(path: string): string {
  check(
    !/^(?:[a-z][\w+.-]*:|[\\/])/i.test(path) && !path.includes('\0'),
    'INVALID_PATH',
    `Invalid model path: ${path}`,
  );
  const segments: string[] = [];
  for (const segment of path.replaceAll('\\', '/').split('/')) {
    if (!segment || segment === '.') continue;
    if (segment === '..') {
      check(segments.length, 'INVALID_PATH', `Path leaves model bundle: ${path}`);
      segments.pop();
    } else segments.push(segment);
  }
  check(segments.length, 'INVALID_PATH', 'Empty resource path');
  return segments.join('/');
}
export async function fetchBytes(
  url: string,
  maxBytes: number,
  signal?: AbortSignal,
): Promise<Uint8Array<ArrayBuffer>> {
  aborted(signal);
  const response = await fetch(url, { signal });
  check(response.ok, 'FETCH_FAILED', `HTTP ${response.status}: ${url}`);
  if (Number(response.headers.get('content-length')) > maxBytes) {
    await response.body?.cancel();
    throw new PlayerError('RESOURCE_TOO_LARGE', url);
  }
  const reader = response.body?.getReader();
  check(reader, 'FETCH_FAILED', `Empty response: ${url}`);
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.length;
      check(length <= maxBytes, 'RESOURCE_TOO_LARGE', url);
      chunks.push(value);
    }
  } catch (error) {
    await reader.cancel().catch(() => {});
    throw error;
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}
function parseJson(bytes: Uint8Array, path: string): unknown {
  try {
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    throw new PlayerError('INVALID_JSON', `Invalid JSON: ${path}`);
  }
}
export function validateModel(value: unknown): asserts value is ModelJson {
  check(value && typeof value === 'object', 'INVALID_MODEL', 'Expected a model3.json object');
  const json = value as Partial<ModelJson>;
  check(
    json.Version === 3 &&
      json.FileReferences &&
      typeof json.FileReferences.Moc === 'string' &&
      Array.isArray(json.FileReferences.Textures) &&
      json.FileReferences.Textures.length > 0 &&
      json.FileReferences.Textures.every((x) => typeof x === 'string'),
    'INVALID_MODEL',
    'Model requires Version 3, Moc and Textures',
  );
}
export async function unzip(
  file: Blob,
  limits: ImportLimits,
  signal?: AbortSignal,
): Promise<Map<string, Blob>> {
  check(
    file.size <= limits.compressedBytes,
    'ARCHIVE_TOO_LARGE',
    'Compressed model exceeds import limit',
  );
  const { Unzip, AsyncUnzipInflate } = await import('fflate');
  const files = new Map<string, Blob>();
  const names = new Set<string>();
  let total = 0;
  let count = 0;
  let pending = 0;
  let inputDone = false;
  let settled = false;
  const streams: { terminate(): void }[] = [];
  return new Promise((resolve, reject) => {
    const cleanup = () => signal?.removeEventListener('abort', cancel);
    const fail = (error: unknown) => {
      if (settled) return;
      settled = true;
      streams.forEach((s) => s.terminate());
      cleanup();
      reject(error);
    };
    const cancel = () => fail(new PlayerError('CANCELLED', 'Model import cancelled'));
    const finish = () => {
      if (inputDone && pending === 0 && !settled) {
        settled = true;
        cleanup();
        resolve(files);
      }
    };
    signal?.addEventListener('abort', cancel, { once: true });
    const archive = new Unzip((entry) => {
      try {
        if (entry.name.endsWith('/')) return;
        check(++count <= limits.files, 'ARCHIVE_TOO_LARGE', 'Too many archive entries');
        const path = normalizePath(entry.name);
        check(!names.has(path), 'DUPLICATE_PATH', path);
        names.add(path);
        if (path.startsWith('__MACOSX/') || path.split('/').some((s) => s.startsWith('._'))) return;
        check(
          entry.compression === 0 || entry.compression === 8,
          'UNSUPPORTED_ARCHIVE',
          'Only Store/Deflate ZIP is supported',
        );
        check((entry.originalSize ?? 0) <= limits.expandedBytes, 'ARCHIVE_TOO_LARGE', path);
        const chunks: Uint8Array<ArrayBuffer>[] = [];
        pending++;
        streams.push(entry);
        entry.ondata = (error, data, final) => {
          if (settled) return;
          if (error) {
            fail(new PlayerError('INVALID_ARCHIVE', error.message));
            return;
          }
          total += data.length;
          if (total > limits.expandedBytes) {
            fail(new PlayerError('ARCHIVE_TOO_LARGE', 'Expanded model exceeds import limit'));
            return;
          }
          chunks.push(new Uint8Array(data));
          if (final) {
            files.set(path, new Blob(chunks));
            pending--;
            finish();
          }
        };
        entry.start();
      } catch (error) {
        fail(error);
      }
    });
    archive.register(AsyncUnzipInflate);
    void (async () => {
      try {
        aborted(signal);
        const reader = file.stream().getReader();
        try {
          for (;;) {
            aborted(signal);
            if (settled) break;
            const { value, done } = await reader.read();
            if (done) {
              archive.push(new Uint8Array(), true);
              break;
            }
            archive.push(value);
          }
        } finally {
          await reader.cancel().catch(() => {});
          reader.releaseLock();
        }
        inputDone = true;
        finish();
      } catch (error) {
        fail(error);
      }
    })();
  });
}
export class ModelBundle {
  private urls = new Map<string, string>();
  private disposed = false;
  private constructor(
    readonly json: ModelJson,
    readonly entry: string,
    private files: Map<string, Blob> | undefined,
    readonly limits: ImportLimits,
    private signal?: AbortSignal,
  ) {}
  static async open(
    source: ModelSource,
    options: Partial<ImportLimits> = {},
    signal?: AbortSignal,
  ): Promise<ModelBundle> {
    const limits = { ...defaultLimits, ...options };
    for (const value of Object.values(limits))
      check(
        Number.isFinite(value) && value > 0,
        'INVALID_OPTIONS',
        'Import limits must be positive',
      );
    let files: Map<string, Blob> | undefined;
    let entry: string;
    if (typeof source === 'string') {
      entry = new URL(source, globalThis.location?.href ?? 'http://localhost').href;
      check(/^https?:/.test(entry), 'INVALID_URL', 'Remote models require HTTP(S)');
    } else {
      if (source.type === 'zip') files = await unzip(source.file, limits, signal);
      else {
        check(source.files.length <= limits.files, 'ARCHIVE_TOO_LARGE', 'Too many files');
        files = new Map();
        let size = 0;
        for (const item of source.files) {
          const path = normalizePath(item.path);
          check(!files.has(path), 'DUPLICATE_PATH', path);
          size += item.file.size;
          check(
            size <= limits.expandedBytes,
            'ARCHIVE_TOO_LARGE',
            'Model files exceed import limit',
          );
          files.set(path, item.file);
        }
      }
      const candidates = [...files.keys()].filter((p) => p.endsWith('.model3.json'));
      if (!source.entry && candidates.length !== 1)
        throw new PlayerError('MODEL_ENTRY_REQUIRED', 'Select a model3.json entry', { candidates });
      entry = normalizePath(source.entry ?? candidates[0]!);
      check(files.has(entry), 'MISSING_RESOURCE', entry);
    }
    aborted(signal);
    const bytes = files
      ? new Uint8Array(await files.get(entry)!.arrayBuffer())
      : await fetchBytes(entry, limits.expandedBytes, signal);
    const json = parseJson(bytes, entry);
    validateModel(json);
    const bundle = new ModelBundle(json, entry, files, limits, signal);
    try {
      for (const reference of bundle.references()) bundle.resolve(reference);
      // Own mandatory network requests so cancellation/size limits apply before upstream XHR loaders run.
      if (!files) {
        const f = json.FileReferences;
        for (const path of [f.Moc, f.Physics, f.Pose, f.UserData].filter((p): p is string => !!p)) {
          const data = await bundle.read(path);
          bundle.urls.set(new URL(path, entry).href, URL.createObjectURL(new Blob([data])));
        }
      }
      // Reject oversized decoded images before handing them to the GPU.
      for (const path of json.FileReferences.Textures) {
        const data = await bundle.read(path);
        if (typeof createImageBitmap === 'function') {
          const bitmap = await createImageBitmap(new Blob([data]));
          const pixels = bitmap.width * bitmap.height;
          bitmap.close();
          check(pixels <= limits.texturePixels, 'TEXTURE_TOO_LARGE', path);
        }
        // Unique texture URLs prevent upstream's global cache from sharing a destructible texture across players.
        if (!files)
          bundle.urls.set(new URL(path, entry).href, URL.createObjectURL(new Blob([data])));
      }
      aborted(signal);
      return bundle;
    } catch (error) {
      bundle.dispose();
      throw error;
    }
  }
  references(): string[] {
    const f = this.json.FileReferences;
    return [
      f.Moc,
      ...f.Textures,
      f.Physics,
      f.Pose,
      f.MotionSync,
      f.DisplayInfo,
      f.UserData,
      ...(f.Expressions ?? []).map((e) => e.File),
      ...Object.values(f.Motions ?? {})
        .flat()
        .flatMap((m) => [m.File, m.Sound]),
    ].filter((p): p is string => typeof p === 'string');
  }
  private path(reference: string): string {
    return normalizePath(this.entry.slice(0, this.entry.lastIndexOf('/') + 1) + reference);
  }
  resolve(reference: string): string {
    check(!this.disposed, 'DESTROYED', 'Model resources have been released');
    if (!this.files) {
      const url = new URL(reference, this.entry);
      check(/^https?:$/.test(url.protocol), 'INVALID_URL', reference);
      return this.urls.get(url.href) ?? url.href;
    }
    check(!/^(?:[a-z][\w+.-]*:|[\\/])/i.test(reference), 'INVALID_PATH', reference);
    const path = this.path(reference);
    const file = this.files.get(path);
    check(file, 'MISSING_RESOURCE', `Missing model resource: ${path}`);
    let url = this.urls.get(path);
    if (!url) {
      url = URL.createObjectURL(file);
      this.urls.set(path, url);
    }
    return url;
  }
  async read(reference: string): Promise<Uint8Array<ArrayBuffer>> {
    aborted(this.signal);
    if (this.files) {
      this.resolve(reference);
      return new Uint8Array(await this.files.get(this.path(reference))!.arrayBuffer());
    }
    return fetchBytes(this.resolve(reference), this.limits.expandedBytes, this.signal);
  }
  async jsonResource(reference: string): Promise<unknown> {
    return parseJson(await this.read(reference), reference);
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.urls.forEach((url) => URL.revokeObjectURL(url));
    this.urls.clear();
    this.files?.clear();
  }
}
