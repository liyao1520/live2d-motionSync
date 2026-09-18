import type {} from '../runtime/native-types';
// ABI and postprocessing based on CubismWebMotionSyncComponents 5-r.2.
// Adapted to numeric/string boundaries; no second Cubism Framework/model singleton.
// Copyright(c) Live2D Inc. All rights reserved.
// Use of the adapted upstream algorithm is governed by the Live2D Open Software License:
// https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html
import { check } from '../errors';

export interface MotionSetting {
  Id: string;
  AnalysisType: string;
  CubismParameters: { Id: string; Min: number; Max: number; Smooth: number; Damper: number }[];
  AudioParameters: { Id: string; Scale: number; Enabled: boolean }[];
  Mappings: { Id: string; Targets: { Id: string; Value: number }[] }[];
  PostProcessing: { BlendRatio: number; Smoothing: number; SampleRate: number };
}
let initialized = false;
function core(): typeof Live2DCubismMotionSyncCore {
  return Live2DCubismMotionSyncCore;
}
export function parseSettings(value: unknown, selected?: string): MotionSetting {
  check(
    value && typeof value === 'object' && 'Settings' in value && Array.isArray(value.Settings),
    'INVALID_MOTIONSYNC',
    'Expected MotionSync Settings',
  );
  const settings = value.Settings as MotionSetting[];
  const setting = selected ? settings.find((s) => s.Id === selected) : settings[0];
  check(
    setting && setting.AnalysisType === 'CRI',
    'INVALID_MOTIONSYNC',
    'Select a CRI MotionSync setting',
  );
  check(
    Array.isArray(setting.CubismParameters) &&
      setting.CubismParameters.length > 0 &&
      setting.CubismParameters.length <= 256 &&
      Array.isArray(setting.AudioParameters) &&
      Array.isArray(setting.Mappings),
    'INVALID_MOTIONSYNC',
    'Invalid MotionSync parameter maps',
  );
  const ids = new Set<string>();
  for (const p of setting.CubismParameters) {
    check(
      typeof p.Id === 'string' && /^[\x20-\x7e]+$/.test(p.Id) && !ids.has(p.Id),
      'INVALID_MOTIONSYNC',
      'Parameter IDs must be unique ASCII strings',
    );
    ids.add(p.Id);
    check(
      [p.Min, p.Max, p.Smooth, p.Damper].every(Number.isFinite) &&
        p.Min <= p.Max &&
        p.Smooth >= 0 &&
        p.Smooth <= 100 &&
        p.Damper >= 0,
      'INVALID_MOTIONSYNC',
      'Invalid parameter bounds/smoothing',
    );
  }
  check(
    setting.AudioParameters.length > 0 && setting.AudioParameters.length <= 64,
    'INVALID_MOTIONSYNC',
    'Invalid audio parameters',
  );
  for (const p of setting.AudioParameters) {
    check(
      typeof p.Id === 'string' &&
        /^[\x20-\x7e]+$/.test(p.Id) &&
        Number.isFinite(p.Scale) &&
        p.Scale >= 0.1 &&
        p.Scale <= 10,
      'INVALID_MOTIONSYNC',
      'Invalid audio parameter scale',
    );
    const map = setting.Mappings.find((m) => m.Id === p.Id);
    check(
      map &&
        Array.isArray(map.Targets) &&
        setting.CubismParameters.every((c) =>
          map.Targets.some((t) => t.Id === c.Id && Number.isFinite(t.Value)),
        ),
      'INVALID_MOTIONSYNC',
      `Incomplete mapping: ${p.Id}`,
    );
  }
  const post = setting.PostProcessing;
  check(
    post &&
      Number.isFinite(post.BlendRatio) &&
      post.BlendRatio >= 0 &&
      post.BlendRatio <= 1 &&
      Number.isInteger(post.Smoothing) &&
      post.Smoothing >= 1 &&
      post.Smoothing <= 100 &&
      Number.isFinite(post.SampleRate) &&
      post.SampleRate > 0 &&
      post.SampleRate <= 240,
    'INVALID_MOTIONSYNC',
    'Invalid MotionSync postprocessing',
  );
  return setting;
}

export class NativeMotionSync {
  private allocations: number[] = [];
  private context?: Live2DCubismMotionSyncCore.Context;
  private samplesPtr = 0;
  private resultPtr = 0;
  private valuesPtr = 0;
  private configPtr = 0;
  private pending: Float32Array;
  private pendingCount = 0;
  private smoothed: Float32Array;
  readonly values: Float32Array;
  private disposed = false;
  private alloc(size: number): number {
    const ptr = core().ToPointer.Malloc(Math.max(size, 32));
    check(ptr, 'MOTIONSYNC_MEMORY', 'MotionSync allocation failed');
    this.allocations.push(ptr);
    return ptr;
  }
  constructor(
    readonly setting: MotionSetting,
    readonly sampleRate: number,
  ) {
    const c = core();
    const p = c.ToPointer;
    if (!initialized) {
      const config = p.Malloc(32);
      try {
        p.ConvertEngineConfigCriToInt32Array(
          new Int32Array(2),
          config,
          (size) => p.Malloc(size),
          (ptr) => p.Free(ptr),
        );
        check(
          c.CubismMotionSyncEngine.csmMotionSyncInitializeEngine(config) === 1,
          'MOTIONSYNC_INIT',
          'MotionSync engine initialization failed',
        );
        initialized = true; // WASM engine and its allocator callbacks are shared for page lifetime.
      } finally {
        p.Free(config);
      }
    }
    this.values = new Float32Array(setting.CubismParameters.length);
    this.smoothed = new Float32Array(this.values.length);
    this.pending = new Float32Array(0);
    try {
      const mapPtr = this.alloc(setting.AudioParameters.length * 24);
      const ids = setting.CubismParameters.map((v) => v.Id);
      setting.AudioParameters.forEach((audio, index) => {
        const map = setting.Mappings.find((m) => m.Id === audio.Id)!;
        const temporary = this.alloc(96);
        const converted = p.ConvertMappingInfoCriToFloat32Array(
          new Float32Array(6),
          temporary,
          audio.Id,
          ids,
          ids.map((id) => map.Targets.find((t) => t.Id === id)!.Value),
          ids.length,
          audio.Scale,
          Number(audio.Enabled),
        );
        const values = Array.from(converted.slice(0, 6));
        this.allocations.push(values[0]!, values[1]!, values[2]!);
        for (let field = 0; field < 6; field++) {
          if (field === 4) p.AddValuePtrFloat(mapPtr + index * 24, field * 4, values[field]!);
          else p.AddValuePtrInt32(mapPtr + index * 24, field * 4, values[field]!);
        }
      });
      const contextPtr = this.alloc(32);
      p.ConvertContextConfigCriToInt32Array(new Int32Array(2), contextPtr, sampleRate, 32);
      this.context = new c.Context();
      this.context.csmMotionSyncCreate(contextPtr, mapPtr, setting.AudioParameters.length);
      const required = this.context.csmMotionSyncGetRequireSampleCount();
      check(
        Number.isInteger(required) && required > 0 && required <= sampleRate,
        'MOTIONSYNC_INIT',
        'Invalid MotionSync analysis window',
      );
      this.pending = new Float32Array(required);
      this.samplesPtr = this.alloc(required * 4);
      this.resultPtr = this.alloc(48);
      const result = p.ConvertAnalysisResultToInt32Array(
        new Int32Array(3),
        this.resultPtr,
        ids.length,
      );
      this.valuesPtr = result[0]!;
      this.allocations.push(this.valuesPtr);
      this.configPtr = this.alloc(48);
      p.AddValuePtrFloat(this.configPtr, 0, setting.PostProcessing.BlendRatio);
      p.AddValuePtrInt32(this.configPtr, 4, setting.PostProcessing.Smoothing);
      p.AddValuePtrFloat(this.configPtr, 8, 0);
    } catch (error) {
      this.dispose();
      throw error;
    }
  }
  push(samples: Float32Array): void {
    check(!this.disposed, 'DESTROYED', 'MotionSync context released');
    const p = core().ToPointer;
    let offset = 0;
    while (offset < samples.length) {
      const take = Math.min(samples.length - offset, this.pending.length - this.pendingCount);
      this.pending.set(samples.subarray(offset, offset + take), this.pendingCount);
      this.pendingCount += take;
      offset += take;
      if (this.pendingCount !== this.pending.length) continue;
      for (let i = 0; i < this.pendingCount; i++)
        p.AddValuePtrFloat(this.samplesPtr, i * 4, this.pending[i]!);
      check(
        this.context!.csmMotionSyncAnalyze(
          this.samplesPtr,
          this.pendingCount,
          this.resultPtr,
          this.configPtr,
        ) === 1,
        'MOTIONSYNC_ANALYSIS',
        'MotionSync analysis failed',
      );
      const consumed = p.GetProcessedSampleCountFromAnalysisResult(this.resultPtr + 8);
      check(
        consumed > 0 && consumed <= this.pendingCount,
        'MOTIONSYNC_ANALYSIS',
        'Invalid consumed sample count',
      );
      const values = p.GetValuesFromAnalysisResult(this.valuesPtr, this.values.length);
      for (let i = 0; i < values.length; i++) {
        const parameter = this.setting.CubismParameters[i]!;
        let value = values[i]!;
        if (!Number.isFinite(value)) continue;
        value = ((100 - parameter.Smooth) * value + this.smoothed[i]! * parameter.Smooth) / 100;
        this.smoothed[i] = value;
        if (Math.abs(value - this.values[i]!) >= parameter.Damper)
          this.values[i] = Math.max(parameter.Min, Math.min(parameter.Max, value));
      }
      this.pending.copyWithin(0, consumed, this.pendingCount);
      this.pendingCount -= consumed;
    }
  }
  reset(): void {
    if (this.disposed) return;
    this.context?.csmMotionSyncClear();
    this.pendingCount = 0;
    this.values.fill(0);
    this.smoothed.fill(0);
  }
  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.context?.csmMotionSyncDelete();
    this.context = undefined;
    for (const ptr of this.allocations.reverse()) if (ptr) core().ToPointer.Free(ptr);
    this.allocations = [];
  }
}
