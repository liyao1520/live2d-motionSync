import { describe, expect, it } from 'vitest';
import { Session, SessionQueue } from '../src/audio/session';
describe('audio session ownership', () => {
  it('replacing clears waiting speech and ignores a stale completion', async () => {
    const started: string[] = [];
    const q = new SessionQueue();
    const a = q.add(() => started.push('a'), true);
    const b = q.add(() => started.push('b'), false);
    const c = q.add(() => started.push('c'), true);
    a.complete();
    await Promise.resolve();
    expect(started).toEqual(['a', 'c']);
    expect(q.current).toBe(c);
    expect(await a.finished).toEqual({ status: 'cancelled' });
    expect(await b.finished).toEqual({ status: 'cancelled' });
    c.complete();
    expect(await c.finished).toEqual({ status: 'completed' });
  });
  it('failed items advance once, while stopping a queued handle does not stop current speech', async () => {
    const q = new SessionQueue();
    const a = q.add(() => {}, true);
    const b = q.add(() => {}, false);
    const c = q.add(() => {}, false);
    b.stop();
    a.fail(new Error('decode'));
    await expect(a.finished).rejects.toThrow('decode');
    await Promise.resolve();
    expect(q.current).toBe(c);
    q.stop();
  });
  it('cleanup is exactly once, including resources attached after cancellation', async () => {
    const s = new Session();
    let n = 0;
    s.addCleanup(() => n++);
    s.stop();
    s.stop();
    s.complete();
    s.addCleanup(() => n++);
    expect(n).toBe(2);
    expect((await s.finished).status).toBe('cancelled');
  });
});
