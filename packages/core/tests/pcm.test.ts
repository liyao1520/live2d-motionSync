import { describe, expect, it } from 'vitest';
import { decodePcm } from '../src/audio/pcm';
describe('PCM input contract', () => {
  it('downmixes interleaved float PCM', () => {
    expect([
      ...decodePcm(new Float32Array([0.5, -0.5, 0.4, 0.6]), {
        sampleRate: 24000,
        channels: 2,
        format: 'f32',
      }),
    ]).toEqual([0, 0.5]);
  });
  it('respects byte offsets and little endian PCM16', () => {
    const bytes = new Uint8Array([99, 0, 128, 255, 127]);
    const pcm = decodePcm(bytes.subarray(1), { sampleRate: 16000, channels: 1, format: 's16le' });
    expect(pcm[0]).toBe(-1);
    expect(pcm[1]).toBeCloseTo(1, 3);
  });
  it('rejects partial frames, nonfinite samples and out-of-range rates', () => {
    const options = { sampleRate: 24000, channels: 1, format: 'f32' } as const;
    expect(() => decodePcm(new Uint8Array(3), options)).toThrow('complete');
    expect(() => decodePcm(new Float32Array([NaN]), options)).toThrow('non-finite');
    expect(() => decodePcm(new Float32Array(1), { ...options, sampleRate: 1 })).toThrow(
      'sampleRate',
    );
  });
});
