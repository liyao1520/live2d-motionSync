import { check } from '../errors';
import type { LipSyncMode, Parameter, PlayerOptions } from '../types';
import { NativeMotionSync, parseSettings } from './native';
export class LipSyncDriver {
  readonly mode: LipSyncMode;
  private native?: NativeMotionSync;
  private setting?: ReturnType<typeof parseSettings>;
  private parameters: Parameter[];
  private gain: number;
  private smooth: number;
  private threshold: number;
  private envelope = 0;
  private active = false;
  private lastSamples = 0;
  private lastPublished = -Infinity;
  private output?: Float32Array;
  constructor(
    parameters: Parameter[],
    configuration: unknown | undefined,
    options: PlayerOptions['lipSync'],
    fallbackIds: string[],
  ) {
    this.gain = options?.gain ?? 1;
    this.smooth = options?.smoothing ?? 0.6;
    this.threshold = options?.silenceThreshold ?? 0.02;
    check(
      Number.isFinite(this.gain) &&
        this.gain >= 0 &&
        Number.isFinite(this.smooth) &&
        this.smooth >= 0 &&
        this.smooth < 1 &&
        Number.isFinite(this.threshold) &&
        this.threshold >= 0 &&
        this.threshold <= 1,
      'INVALID_OPTIONS',
      'Invalid lipSync gain/smoothing/threshold',
    );
    if (configuration !== undefined && options?.mode !== 'amplitude') {
      this.setting = parseSettings(configuration, options?.setting);
      this.output = new Float32Array(this.setting.CubismParameters.length);
      this.parameters = this.setting.CubismParameters.map((p) =>
        parameters.find((model) => model.id === p.Id),
      ).filter((p): p is Parameter => p !== undefined);
      check(
        this.parameters.length,
        'MOTIONSYNC_PARAMETERS_MISSING',
        'Model has no parameters named in MotionSync configuration',
      );
      this.mode = 'motionsync';
    } else {
      check(
        options?.mode !== 'motionsync',
        'MOTIONSYNC_CONFIG_MISSING',
        'Model has no MotionSync configuration',
      );
      const ids = options?.parameterIds ?? (fallbackIds.length ? fallbackIds : ['ParamMouthOpenY']);
      this.parameters = parameters.filter((p) => ids.includes(p.id));
      this.mode = this.parameters.length ? 'amplitude' : 'unavailable';
    }
  }
  push(samples: Float32Array, rate: number): void {
    if (!samples.length || this.mode === 'unavailable') return;
    this.active = true;
    this.lastSamples = performance.now();
    let power = 0;
    for (const sample of samples) power += sample * sample;
    const amplitude = Math.sqrt(power / samples.length);
    const target = amplitude < this.threshold ? 0 : Math.min(1, amplitude * this.gain * 4);
    const retained = this.smooth ** ((samples.length / rate) * 60);
    this.envelope = this.envelope * retained + target * (1 - retained);
    if (this.setting) {
      if (this.native?.sampleRate !== rate) {
        this.native?.dispose();
        this.native = new NativeMotionSync(this.setting, rate);
      }
      if (this.gain !== 1 || amplitude < this.threshold) {
        const processed = new Float32Array(samples.length);
        if (amplitude >= this.threshold)
          for (let i = 0; i < samples.length; i++)
            processed[i] = Math.max(-1, Math.min(1, samples[i]! * this.gain));
        this.native.push(processed);
      } else this.native.push(samples);
    }
  }
  apply(write: (index: number, value: number) => void): void {
    if (!this.active) return;
    const stale = performance.now() - this.lastSamples > 160;
    if (
      this.native &&
      this.setting &&
      performance.now() - this.lastPublished >= 1000 / this.setting.PostProcessing.SampleRate
    ) {
      this.output!.set(this.native.values);
      this.lastPublished = performance.now();
    }
    if (stale) {
      this.envelope *= 0.7;
    }
    for (const p of this.parameters) {
      const i = this.setting?.CubismParameters.findIndex((value) => value.Id === p.id) ?? -1;
      const value =
        this.native && i >= 0
          ? stale
            ? 0
            : this.output![i]!
          : p.min + this.envelope * (p.max - p.min);
      write(p.index, Math.max(p.min, Math.min(p.max, value)));
    }
  }
  reset(): void {
    this.native?.reset();
    this.output?.fill(0);
    this.lastPublished = -Infinity;
    this.envelope = 0;
    this.active = false;
  }
  destroy(): void {
    this.native?.dispose();
    this.native = undefined;
    this.active = false;
  }
}
