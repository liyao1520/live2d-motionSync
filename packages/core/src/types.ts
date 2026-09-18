import type { PlayerError } from './errors';
export type ModelSource =
  | string
  | { type: 'zip'; file: Blob; entry?: string }
  | {
      type: 'files';
      entry?: string;
      files: readonly { path: string; file: Blob }[];
    };
export interface ImportLimits {
  compressedBytes: number;
  expandedBytes: number;
  files: number;
  texturePixels: number;
}
export interface PlayerOptions {
  canvas: HTMLCanvasElement;
  model: ModelSource;
  signal?: AbortSignal;
  layout?: { fit?: 'contain' | 'cover'; resolution?: number };
  interaction?: { lookAtPointer?: boolean; hitTest?: boolean; idle?: boolean };
  lipSync?: {
    mode?: 'auto' | 'motionsync' | 'amplitude';
    gain?: number;
    smoothing?: number;
    silenceThreshold?: number;
    parameterIds?: string[];
    setting?: string;
  };
  audio?: { maxBufferedSeconds?: number; maxFileBytes?: number; maxQueueLength?: number };
  imports?: Partial<ImportLimits>;
  /** Optional CSP/self-hosting override. Ordinary usage needs no URLs. */
  runtime?: { cubismUrl?: string; motionSyncUrl?: string; workletUrl?: string };
}
export type LipSyncMode = 'motionsync' | 'amplitude' | 'unavailable';
export interface PlaybackResult {
  status: 'completed' | 'cancelled';
}
export type AudioSource = string | Blob | AudioBuffer;
export interface Playback {
  readonly finished: Promise<PlaybackResult>;
  stop(): void;
}
export interface PcmOptions {
  sampleRate: number;
  channels: 1 | 2;
  format: 'f32' | 's16le';
}
export interface PcmStream extends Playback {
  write(chunk: Float32Array | Uint8Array | ArrayBuffer): Promise<void>;
  end(): Promise<PlaybackResult>;
}
export interface PlayerEvents {
  error: PlayerError;
  hit: { areas: string[] };
  warning: { code: string; message: string };
  statechange: { state: 'idle' | 'loading' | 'playing' | 'waiting-for-gesture' | 'destroyed' };
}
export interface Parameter {
  id: string;
  index: number;
  min: number;
  max: number;
  defaultValue: number;
}
export interface ModelControls {
  readonly motions: readonly { group: string; index: number }[];
  readonly expressions: readonly string[];
  playMotion(motion: { group: string; index?: number }): Promise<boolean>;
  setExpression(name: string): Promise<boolean>;
}
