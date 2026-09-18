import type { Playback, PlaybackResult } from '../types';
export class Session implements Playback {
  readonly controller = new AbortController();
  readonly finished: Promise<PlaybackResult>;
  settled = false;
  private resolve!: (result: PlaybackResult) => void;
  private reject!: (error: unknown) => void;
  private cleanups: (() => void)[] = [];
  constructor(private onSettle: () => void = () => {}) {
    this.finished = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
    // Consumers can ignore the handle and subscribe to the player's error event instead.
    void this.finished.catch(() => {});
  }
  addCleanup(cleanup: () => void): void {
    if (this.settled) cleanup();
    else this.cleanups.push(cleanup);
  }
  private cleanup(): boolean {
    if (this.settled) return false;
    this.settled = true;
    this.controller.abort();
    for (const cleanup of this.cleanups.splice(0)) {
      try {
        cleanup();
      } catch {
        /* all resources must be attempted */
      }
    }
    this.onSettle();
    return true;
  }
  complete(): void {
    if (this.cleanup()) this.resolve({ status: 'completed' });
  }
  stop(): void {
    if (this.cleanup()) this.resolve({ status: 'cancelled' });
  }
  fail(error: unknown): void {
    if (this.cleanup()) this.reject(error);
  }
}

/** Identity checks prevent an old completion from advancing a replacement's queue. */
export class SessionQueue {
  current?: Session;
  private pending: { session: Session; start: (session: Session) => void }[] = [];
  private clearing = false;
  constructor(private readonly idle: () => void = () => {}) {}
  add(start: (session: Session) => void, replace: boolean): Session {
    if (replace) this.stop();
    const session = new Session(() => {
      if (this.current !== session) {
        this.pending = this.pending.filter((item) => item.session !== session);
        return;
      }
      this.current = undefined;
      if (!this.clearing) queueMicrotask(() => this.next());
    });
    this.pending.push({ session, start });
    this.next();
    return session;
  }
  get length(): number {
    return this.pending.length;
  }
  private next(): void {
    if (this.current || this.clearing) return;
    const item = this.pending.shift();
    if (!item) {
      this.idle();
      return;
    }
    this.current = item.session;
    item.start(item.session);
  }
  stop(): void {
    this.clearing = true;
    for (const item of this.pending.splice(0)) item.session.stop();
    this.current?.stop();
    this.current = undefined;
    this.clearing = false;
    this.idle();
  }
}
