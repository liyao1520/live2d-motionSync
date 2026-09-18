export class Events<T extends object> {
  private listeners = new Map<keyof T, Set<(value: never) => void>>();
  on<K extends keyof T>(name: K, listener: (value: T[K]) => void): () => void {
    let set = this.listeners.get(name);
    if (!set) this.listeners.set(name, (set = new Set()));
    set.add(listener as (value: never) => void);
    return () => set.delete(listener as (value: never) => void);
  }
  emit<K extends keyof T>(name: K, value: T[K]): void {
    for (const listener of this.listeners.get(name) ?? []) {
      try {
        listener(value as never);
      } catch (error) {
        globalThis.reportError?.(error);
      }
    }
  }
  clear(): void {
    this.listeners.clear();
  }
}
