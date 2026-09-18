import { check, PlayerError } from '../errors';
type RuntimeName = 'Live2DCubismCore' | 'Live2DCubismMotionSyncCore';
const loading = new Map<RuntimeName, Promise<void>>();

async function waitForRuntime(name: RuntimeName): Promise<void> {
  const started = performance.now();
  for (;;) {
    try {
      const scope = window as unknown as Record<
        RuntimeName,
        {
          Version?: { csmGetVersion(): number };
          CubismMotionSyncEngine?: { csmMotionSyncGetEngineVersion(): number };
        }
      >;
      const runtime = scope[name];
      const version =
        name === 'Live2DCubismCore'
          ? runtime?.Version?.csmGetVersion()
          : runtime?.CubismMotionSyncEngine?.csmMotionSyncGetEngineVersion();
      if (typeof version === 'number' && version > 0) return;
    } catch {
      /* Emscripten script.onload is earlier than WASM readiness. */
    }
    check(
      performance.now() - started < 15000,
      'RUNTIME_INIT_FAILED',
      `${name} initialization timed out`,
    );
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

export async function loadRuntime(name: RuntimeName, override?: string): Promise<void> {
  check(typeof window !== 'undefined', 'BROWSER_REQUIRED', 'Create a player on the browser client');
  const previous = loading.get(name);
  if (previous) return previous;
  const promise = (async () => {
    // Preloaded external runtimes still need to finish WASM initialization.
    if (name in window) return waitForRuntime(name);
    const text = override
      ? undefined
      : name === 'Live2DCubismCore'
        ? (await import('../generated/cubism')).default
        : (await import('../generated/motionsync')).default;
    if (name in window) return waitForRuntime(name);
    const url = override ?? URL.createObjectURL(new Blob([text!], { type: 'text/javascript' }));
    try {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        const done = (error?: Error) => {
          clearTimeout(timer);
          script.onload = null;
          script.onerror = null;
          script.remove();
          if (error) reject(error);
          else resolve();
        };
        const timer = setTimeout(
          () => done(new PlayerError('RUNTIME_LOAD_FAILED', `${name} load timed out`)),
          30000,
        );
        script.onload = () => done();
        script.onerror = () =>
          done(
            new PlayerError('RUNTIME_LOAD_FAILED', `Unable to load ${name}; check CSP/runtime URL`),
          );
        document.head.appendChild(script);
      });
      await waitForRuntime(name);
    } finally {
      if (!override) URL.revokeObjectURL(url);
    }
  })();
  loading.set(name, promise);
  try {
    await promise;
  } catch (error) {
    loading.delete(name);
    throw error;
  }
}
