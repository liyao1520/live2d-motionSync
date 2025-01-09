/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmString } from '../framework/type/csmstring';

import { CubismLogInfo, CubismLogWarning } from '../framework/utils/cubismdebug';
import { EngineType, MappingInfoListMapper } from './cubismmotionsyncutil';

import {

  MotionSyncContextConfig_CRI
} from './motionsyncconfig_cri';
import ToPointer = Live2DCubismMotionSyncCore.ToPointer;

export type CubismMotionSyncContext = Live2DCubismMotionSyncCore.Context;
export type CubismMotionSyncContextConfig = unknown;

export class CubismMotionSyncEngineLib {
  public getEngineVersion(): number {
    return Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncGetEngineVersion();
  }

  public getEngineName(): csmString {
    return new csmString(
      Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncGetEngineName()
    );
  }

  public initializeEngine(engineConfig: number): boolean {
    if (this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core already initialized.');
      return true;
    }
    this._isEngineInitialized = false;

    const result: number =
      Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncInitializeEngine(
        engineConfig
      );

    if (result == Live2DCubismMotionSyncCore.csmMotionSyncFalse) {
      CubismLogWarning('Cubism MotionSync Core Initializing failed.');
      return false;
    }
    this._isEngineInitialized = true;
    return true;
  }

  public disposeEngine(): void {
    if (!this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core initialized yet.');
      return;
    }

    Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncDisposeEngine();
    this._isEngineInitialized = false;
  }

  public createContext(
    type: EngineType,
    contextConfig: CubismMotionSyncContextConfig,
    mappingInfoList: MappingInfoListMapper,
    mappingInfoListCount: number
  ): CubismMotionSyncContext {
    if (!this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core initialized yet.');
      return null;
    }

    const context: CubismMotionSyncContext =
      new Live2DCubismMotionSyncCore.Context();

    // EngineTypeでConfigを分ける
    let contextConfigPtr: number;
    switch (type) {
      case EngineType.EngineType_Cri:
        {
          // ポインタへ変換
          const contextConfigCri: MotionSyncContextConfig_CRI =
            contextConfig as MotionSyncContextConfig_CRI;
          contextConfigCri?.toNativeArray(true);
          contextConfigPtr = contextConfigCri?.getNativePtr();
        }
        break;
      default:
        return null;
    }

    context.csmMotionSyncCreate(
      contextConfigPtr,
      mappingInfoList.getMappingInfoListPtr(),
      mappingInfoListCount
    );

    return context;
  }

  public clearContext(context: CubismMotionSyncContext) {
    if (!this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core initialized yet.');
      return;
    }

    context?.csmMotionSyncClear();
  }

  public deleteContext(context: CubismMotionSyncContext) {
    if (!this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core initialized yet.');
      return;
    }

    context?.csmMotionSyncDelete();
  }

  public getRequireSampleCount(context: CubismMotionSyncContext): number {
    if (!this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core initialized yet.');
      return 0;
    }

    if (context == null) {
      CubismLogInfo('context is null.');
      return 0;
    }

    const requireCount: number = context.csmMotionSyncGetRequireSampleCount();
    return requireCount;
  }

  public analyze(
    context: CubismMotionSyncContext,
    samples: Array<number>,
    samplesOffset: number,
    sampleCount: number,
    analysisResultPtr: number,
    analysisConfigPtr: number
  ): boolean {
    if (!this.isInitialized()) {
      CubismLogInfo('Cubism MotionSync Core initialized yet.');
      return false;
    }

    if (context == null) {
      CubismLogInfo('context is null.');
      return false;
    }

    const analyzeSamples = new Array<number>(sampleCount);
    for (let index = 0; index < sampleCount; index++) {
      analyzeSamples[index] = samples[index + samplesOffset];
    }

    ToPointer.Free(this._analyzeSamplesPtr);

    this._analyzeSamplesPtr =
      ToPointer.ConvertNumberArrayToFloatArrayPtr(analyzeSamples);

    // samplesの先頭アドレス、Resultのアドレス、configのアドレスを渡す
    const result: number = context.csmMotionSyncAnalyze(
      this._analyzeSamplesPtr,
      sampleCount,
      analysisResultPtr,
      analysisConfigPtr
    );

    return result == Live2DCubismMotionSyncCore.csmMotionSyncTrue
      ? true
      : false;
  }

  public isInitialized(): boolean {
    return this._isEngineInitialized;
  }

  private _isEngineInitialized: boolean;
  private _analyzeSamplesPtr: number;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncenginelib';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export type CubismMotionSyncContext = $.CubismMotionSyncContext;
  export const CubismMotionSyncEngineLib = $.CubismMotionSyncEngineLib;
  export type CubismMotionSyncEngineLib = $.CubismMotionSyncEngineLib;
}
