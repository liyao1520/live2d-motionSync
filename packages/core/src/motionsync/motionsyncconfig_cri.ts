/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import ToPointer = Live2DCubismMotionSyncCore.ToPointer;

const s_contextConfigInfoStructSize = 2;
const s_analysisConfigInfoStructSize = 3;

/** Engine configuration for CRI. */
export interface MotionSyncEngineConfig_CRI {
  Allocator: Live2DCubismMotionSyncCore.csmMotionSync_AllocFunc;
  Deallocator: Live2DCubismMotionSyncCore.csmMotionSync_DeallocFunc;
}

export class MotionSyncContextConfig_CRI {
  public constructor(sampleRate: number = 0, bitDepth: number = 0) {
    this.SampleRate = sampleRate;
    this.BitDepth = bitDepth;
  }

  public toNativeArray(forceConversion: boolean): void {
    // 強制的に新規作成しないのであれば早期リターン
    if (!forceConversion && this._nativeArray) {
      return;
    }

    if (this._nativeArray) {
      this.releaseNativeArray();
    }
    this._nativeArray = new Int32Array(s_contextConfigInfoStructSize);
    this._nativeArrayPtr = ToPointer.Malloc(
      this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT
    );

    // Nativeポインタへの変換
    this._nativeArray = ToPointer.ConvertContextConfigCriToInt32Array(
      this._nativeArray,
      this._nativeArrayPtr,
      this.SampleRate,
      this.BitDepth
    );
  }

  public getNativePtr(): number {
    return this._nativeArrayPtr;
  }

  public releaseNativeArray(): void {
    this.deallocNativeArrayPtr();
    this._nativeArray = void 0;
  }

  private deallocNativeArrayPtr(): void {
    // 配列本体を解放
    ToPointer.Free(this._nativeArrayPtr);
    this._nativeArrayPtr = 0;
  }

  public SampleRate: number;
  public BitDepth: number;
  private _nativeArray: Int32Array;
  private _nativeArrayPtr: number;
}

export class MotionSyncAnalysisConfig_CRI {
  public constructor(
    blendRatio: number = 0.0,
    smoothing: number = 0,
    audioLevelEffectRatio: number = 0.0
  ) {
    this.BlendRatio = blendRatio;
    this.Smoothing = smoothing;
    this.AudioLevelEffectRatio = audioLevelEffectRatio;
  }

  public toNativeArray(forceConversion: boolean): Float32Array {
    // 強制的に新規作成しないのであれば既にあるものを返す
    if (!forceConversion && this._nativeArray) {
      return this._nativeArray;
    }

    if (this._nativeArray) {
      this.releaseNativeArray();
    }
    this._nativeArray = new Float32Array(s_analysisConfigInfoStructSize);
    this._nativeArrayPtr = ToPointer.Malloc(
      this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT
    );

    // Nativeポインタへの変換
    this._nativeArray = ToPointer.ConvertAnalysisConfigToFloat32Array(
      this._nativeArray,
      this._nativeArrayPtr,
      this.BlendRatio,
      this.Smoothing,
      this.AudioLevelEffectRatio
    );

    return this._nativeArray;
  }

  public releaseNativeArray(): void {
    this.deallocNativePtr();
    this._nativeArray = void 0;
  }

  private deallocNativePtr(): void {
    // 配列本体を解放
    ToPointer.Free(this._nativeArrayPtr);
    this._nativeArrayPtr = 0;
  }

  public BlendRatio: number;
  public Smoothing: number;
  public AudioLevelEffectRatio: number; // Unused
  private _nativeArray: Float32Array;
  private _nativeArrayPtr: number;
}

// Namespace definition for compatibility.
import * as $ from './motionsyncconfig_cri';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const MotionSyncContextConfig_CRI = $.MotionSyncContextConfig_CRI;
  export type MotionSyncContextConfig_CRI = $.MotionSyncContextConfig_CRI;
}
