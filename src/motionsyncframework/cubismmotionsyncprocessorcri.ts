/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmVector } from '../framework/type/csmvector';
import { CubismLogError } from '../framework/utils/cubismdebug';
import { CubismMotionSyncEngineAnalysisResult } from './cubismmotionsyncengineanalysisresult';
import { CubismMotionSyncEngineMappingInfo } from './cubismmotionsyncenginemappinginfo';
import { MotionSyncContext } from './cubismmotionsyncutil';
import { ICubismMotionSyncEngine } from './icubismmotionsyncengine';
import { ICubismMotionSyncProcessor } from './icubismmotionsyncprocessor';
import { MotionSyncAnalysisConfig_CRI } from './motionsyncconfig_cri';
import ToPointer = Live2DCubismMotionSyncCore.ToPointer;

export class CubismMotionSyncProcessorCRI extends ICubismMotionSyncProcessor {
  public getSampleRate(): number {
    return this._sampleRate;
  }

  public getBitDepth(): number {
    return this._bitDepth;
  }

  public Analyze(
    samples: csmVector<number>,
    beginIndex: number,
    blendRatio: number,
    smoothing: number,
    audioLevelEffectRatio: number,
    analysisResult: CubismMotionSyncEngineAnalysisResult
  ): CubismMotionSyncEngineAnalysisResult {
    const samplesSize = samples.getSize();
    if (
      samplesSize <
      this.getEngine()
        .getEngineHandle()
        .getRequireSampleCount(this.getContextHandle().getContext())
    ) {
      CubismLogError(
        'The argument is invalid. Please check that the samples is the correct value.'
      );
      return null;
    }

    if (!(0 <= beginIndex && beginIndex < samples.getSize())) {
      CubismLogError(
        'The value of beginIndex is incorrect. It should be less than the length of samples.'
      );
      return null;
    }

    if (!(0.0 <= blendRatio && blendRatio <= 1.0)) {
      CubismLogError(
        'The value of blend ratio is incorrect. The value is limited to between 0.0 and 1.0.'
      );
      return null;
    }

    if (!(1 <= smoothing && smoothing <= 100)) {
      CubismLogError(
        'The value of smoothing is incorrect. The value is limited to between 1 and 100.'
      );
      return null;
    }

    if (!(0.0 <= audioLevelEffectRatio && audioLevelEffectRatio <= 1.0)) {
      CubismLogError(
        'The value of audio level effect ratio is incorrect. The value is limited to between 0.0 and 1.0.'
      );
      return null;
    }

    if (!analysisResult) {
      CubismLogError('The result instance is null.');
      return null;
    }

    const analysisConfig: MotionSyncAnalysisConfig_CRI =
      new MotionSyncAnalysisConfig_CRI(
        blendRatio,
        smoothing,
        audioLevelEffectRatio
      );

    const analysisConfigBuffer: Float32Array =
      analysisConfig.toNativeArray(false);

    // ポインタを生成
    if (!this._analysisConfigNativePtr || this._analysisConfigNativePtr == 0) {
      this._analysisConfigNativePtr = ToPointer.Malloc(
        analysisConfigBuffer.length
      );
    }
    ToPointer.AddValuePtrFloat(
      this._analysisConfigNativePtr,
      0,
      analysisConfigBuffer[0]
    );
    ToPointer.AddValuePtrInt32(
      this._analysisConfigNativePtr,
      4,
      analysisConfigBuffer[1]
    );
    ToPointer.AddValuePtrFloat(
      this._analysisConfigNativePtr,
      8,
      analysisConfigBuffer[2]
    );

    const analysisResultBuffer: Int32Array =
      analysisResult.toNativeArray(false);

    // ポインタを生成
    if (!this._analysisResultNativePtr || this._analysisResultNativePtr == 0) {
      this._analysisResultNativePtr = ToPointer.Malloc(
        analysisResultBuffer.length * analysisResultBuffer.BYTES_PER_ELEMENT
      );
    }
    ToPointer.AddValuePtrInt32(
      this._analysisResultNativePtr,
      0,
      analysisResultBuffer[0]
    );
    ToPointer.AddValuePtrInt32(
      this._analysisResultNativePtr,
      4,
      analysisResultBuffer[1]
    );
    ToPointer.AddValuePtrInt32(
      this._analysisResultNativePtr,
      8,
      analysisResultBuffer[2]
    );

    const ret: boolean = this.getEngine()
      .getEngineHandle()
      .analyze(
        this.getContextHandle().getContext(),
        samples._ptr,
        beginIndex,
        samplesSize - beginIndex,
        this._analysisResultNativePtr,
        this._analysisConfigNativePtr
      );

    if (!ret) {
      CubismLogError('Failed to analyze.');
      return null;
    }

    // データを引っ張ってくる。
    analysisResult.ConvertNativeAnalysisResult(this._analysisResultNativePtr);

    return analysisResult;
  }

  public constructor(
    engine: ICubismMotionSyncEngine,
    contextHandle: MotionSyncContext,
    mappingList: csmVector<CubismMotionSyncEngineMappingInfo>,
    sampleRate: number,
    bitDepth: number
  ) {
    super(engine, contextHandle, mappingList);
    this._sampleRate = sampleRate;
    this._bitDepth = bitDepth;
  }

  public release(): void {
    ToPointer.Free(this._analysisConfigNativePtr);
    this._analysisConfigNativePtr = 0;
    ToPointer.Free(this._analysisResultNativePtr);
    this._analysisResultNativePtr = 0;
  }

  private _sampleRate: number;
  private _bitDepth: number;
  private _analysisConfigNativePtr: number;
  private _analysisResultNativePtr: number;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncprocessorcri';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSyncProcessorCRI = $.CubismMotionSyncProcessorCRI;
  export type CubismMotionSyncProcessorCRI = $.CubismMotionSyncProcessorCRI;
}
