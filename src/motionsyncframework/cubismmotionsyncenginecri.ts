/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmVector } from '../framework/type/csmvector';
import { CubismLogWarning } from '../framework/utils/cubismdebug';
import { csmString } from '../framework/type/csmstring';
import { CubismMotionSyncEngineVersion } from './cubismmotionsyncengineversion';
import {
  CubismMotionSyncContext,
  CubismMotionSyncEngineLib
} from './cubismmotionsyncenginelib';
import { CubismMotionSyncEngineMappingInfo } from './cubismmotionsyncenginemappinginfo';
import { CubismMotionSyncProcessorCRI } from './cubismmotionsyncprocessorcri';
import { MotionSyncContextConfig_CRI } from './motionsyncconfig_cri';
import {
  DefaultAudioBitDepth,
  ICubismMotionSyncEngine
} from './icubismmotionsyncengine';
import { ICubismMotionSyncProcessor } from './icubismmotionsyncprocessor';
import {
  EngineType,
  MappingInfoListMapper,
  MotionSyncContext
} from './cubismmotionsyncutil';

export const SampleRateMin: number = 16000;
export const SampleRateMax: number = 128000;

export class CubismMotionSyncEngineCri extends ICubismMotionSyncEngine {
  public CreateProcessor(
    cubismParameterCount: number,
    mappingInfoList: csmVector<CubismMotionSyncEngineMappingInfo>,
    sampleRate: number
  ): CubismMotionSyncProcessorCRI {
    if (this.isClosed()) {
      CubismLogWarning(
        "[CubismMotionSyncEngineCri.CreateProcessor] Cubism MotionSync Engine is not started.'"
      );
      return null;
    }

    if (mappingInfoList.getSize() < 1) {
      CubismLogWarning(
        "[CubismMotionSyncEngineCri.CreateProcessor] mappingInfoList size is invalid.'"
      );
      return null;
    }

    if (!(SampleRateMin <= sampleRate && sampleRate <= SampleRateMax)) {
      CubismLogWarning(
        "[CubismMotionSyncEngineCri.CreateProcessor] sampleRate is invalid.'"
      );
      return null;
    }

    const contextConfig: MotionSyncContextConfig_CRI =
      new MotionSyncContextConfig_CRI(sampleRate, DefaultAudioBitDepth);
    const mapper: MappingInfoListMapper = new MappingInfoListMapper();
    mapper.setJObject(mappingInfoList);

    const context: CubismMotionSyncContext =
      this.getEngineHandle().createContext(
        this.getType(),
        contextConfig,
        mapper,
        mappingInfoList.getSize()
      );
    const contextHandle: MotionSyncContext = new MotionSyncContext(
      context,
      mapper,
      cubismParameterCount
    );
    const processor: CubismMotionSyncProcessorCRI =
      new CubismMotionSyncProcessorCRI(
        this,
        contextHandle,
        mappingInfoList,
        sampleRate,
        DefaultAudioBitDepth
      );
    this._processors.pushBack(processor);

    return processor;
  }

  public constructor(
    engineHandle: CubismMotionSyncEngineLib,
    type: EngineType,
    name: csmString,
    version: CubismMotionSyncEngineVersion
  ) {
    super(engineHandle, type, name, version);
    this._processors = new csmVector<ICubismMotionSyncProcessor>();
  }
  // @ts-ignore
  protected _processors: csmVector<ICubismMotionSyncProcessor>;
}

// Namespace definition for compatibility.
import * as $ from './motionsyncconfig_cri';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const MotionSyncContextConfig_CRI = $.MotionSyncContextConfig_CRI;
  export type MotionSyncContextConfig_CRI = $.MotionSyncContextConfig_CRI;
}
