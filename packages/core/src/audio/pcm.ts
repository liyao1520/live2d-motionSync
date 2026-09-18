import { check } from '../errors';
import type { PcmOptions } from '../types';
export function validatePcm(options: PcmOptions): void {
  check(
    Number.isInteger(options.sampleRate) &&
      options.sampleRate >= 16000 &&
      options.sampleRate <= 128000,
    'INVALID_PCM',
    'sampleRate must be 16000–128000 Hz',
  );
  check(
    options.channels === 1 || options.channels === 2,
    'INVALID_PCM',
    'Expected one or two channels',
  );
  check(
    options.format === 'f32' || options.format === 's16le',
    'INVALID_PCM',
    'Expected f32 or s16le',
  );
}
/** Interleaved input, copied once so callers can reuse their buffers after write. */
export function decodePcm(
  chunk: Float32Array | Uint8Array | ArrayBuffer,
  options: PcmOptions,
): Float32Array<ArrayBuffer> {
  validatePcm(options);
  const bytes =
    chunk instanceof ArrayBuffer
      ? new Uint8Array(chunk)
      : new Uint8Array(chunk.buffer, chunk.byteOffset, chunk.byteLength);
  const width = options.format === 'f32' ? 4 : 2;
  check(
    bytes.length % (width * options.channels) === 0,
    'INVALID_PCM',
    'PCM chunk must contain complete interleaved frames',
  );
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const mono = new Float32Array(bytes.length / width / options.channels);
  for (let i = 0; i < mono.length; i++) {
    let sum = 0;
    for (let c = 0; c < options.channels; c++) {
      const offset = (i * options.channels + c) * width;
      const value =
        options.format === 'f32'
          ? view.getFloat32(offset, true)
          : view.getInt16(offset, true) / 32768;
      check(Number.isFinite(value), 'INVALID_PCM', 'PCM contains non-finite samples');
      sum += Math.max(-1, Math.min(1, value));
    }
    mono[i] = sum / options.channels;
  }
  return mono;
}
export function downmix(buffer: AudioBuffer): Float32Array<ArrayBuffer> {
  const mono = new Float32Array(buffer.length);
  for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < mono.length; i++) mono[i] = mono[i]! + data[i]! / buffer.numberOfChannels;
  }
  return mono;
}
