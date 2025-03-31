/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { LogLevel } from '../framework/live2dcubismframework';
import { CubismModel } from '../framework/model/cubismmodel';
import { csmVector } from '../framework/type/csmvector';
import {
  CSM_ASSERT,
  CubismLogInfo,
  CubismLogWarning
} from '../framework/utils/cubismdebug';
import { CubismMath } from '../framework/math/cubismmath';
import {
  CubismMotionSyncData,
  CubismMotionSyncDataSetting
} from './cubismmotionsyncdata';
import { CubismMotionSyncEngineAnalysisResult } from './cubismmotionsyncengineanalysisresult';
import { CubismMotionSyncEngineController } from './cubismmotionsyncenginecontroller';
import { CubismMotionSyncEngineCri } from './cubismmotionsyncenginecri';
import { CubismMotionSyncProcessorCRI } from './cubismmotionsyncprocessorcri';
import { EngineType } from './cubismmotionsyncutil';
import { ICubismMotionSyncEngine } from './icubismmotionsyncengine';
import { ICubismMotionSyncProcessor } from './icubismmotionsyncprocessor';

// ファイルスコープの変数を初期化

let s_isStarted = false;
let s_isInitialized = false;
let s_option: MotionSyncOption = null;
let s_engineConfigCriData: MotionSyncEngineConfigCriData = null;
const s_engineConfigStructSize = 2;

export class CubismMotionSync {
  /**
   * Cubism MotionSync FrameworkのAPIを使用可能にする。
   *  APIを実行する前に必ずこの関数を実行すること。
   *  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
   *
   * @param    option      MotionSyncLogOptionクラスのインスタンス
   *
   * @return   準備処理が完了したらtrueが返ります。
   */
  public static startUp(option: MotionSyncOption = null): boolean {
    if (s_isStarted) {
      CubismLogInfo('CubismMotionSyncFramework.startUp() is already done.');
      return s_isStarted;
    }

    s_option = option;

    if (s_option != null) {
      Live2DCubismMotionSyncCore.Logging.csmMotionSyncSetLogFunction(
        s_option.logFunction
      );
    }

    s_isStarted = true;

    CubismLogInfo('CubismMotionSyncFramework.startUp() is complete.');

    return s_isStarted;
  }

  /**
   * StartUp()で初期化したCubism MotionSync Frameworkの各パラメータをクリアします。
   * Dispose()したCubism MotionSync Frameworkを再利用する際に利用してください。
   */
  public static cleanUp(): void {
    s_isStarted = false;
    s_isInitialized = false;
    s_option = null;
  }

  /**
   * Cubism MotionSync Framework内のリソースを初期化してモデルを表示可能な状態にします。
   *     再度Initialize()するには先にDispose()を実行する必要があります。
   */
  public static initialize(): void {
    CSM_ASSERT(s_isStarted);
    if (!s_isStarted) {
      CubismLogWarning('CubismMotionSyncFramework is not started.');
      return;
    }

    // --- s_isInitializedによる連続初期化ガード ---
    // 連続してリソース確保が行われないようにする。
    // 再度Initialize()するには先にDispose()を実行する必要がある。
    if (s_isInitialized) {
      CubismLogWarning(
        'CubismMotionSyncFramework.initialize() skipped, already initialized.'
      );
      return;
    }

    s_isInitialized = true;

    CubismLogInfo('CubismMotionSyncFramework.initialize() is complete.');
  }

  /**
   * Cubism MotionSync Framework内の全てのリソースを解放します。
   *      ただし、外部で確保されたリソースについては解放しません。
   *      外部で適切に破棄する必要があります。
   */
  public static dispose(): void {
    CSM_ASSERT(s_isStarted);
    if (!s_isStarted) {
      CubismLogWarning('CubismMotionSyncFramework is not started.');
      return;
    }

    // --- s_isInitializedによる未初期化解放ガード ---
    // dispose()するには先にinitialize()を実行する必要がある。
    if (!s_isInitialized) {
      // false...リソース未確保の場合
      CubismLogWarning(
        'CubismMotionSyncFramework.dispose() skipped, not initialized.'
      );
      return;
    }

    s_isInitialized = false;

    CubismLogInfo('CubismMotionSyncFramework.dispose() is complete.');
  }

  /**
   * Cubism MotionSync FrameworkのAPIを使用する準備が完了したかどうか
   * @return APIを使用する準備が完了していればtrueが返ります。
   */
  public static isStarted(): boolean {
    return s_isStarted;
  }

  /**
   * Cubism MotionSync Frameworkのリソース初期化がすでに行われているかどうか
   * @return リソース確保が完了していればtrueが返ります
   */
  public static isInitialized(): boolean {
    return s_isInitialized;
  }

  public static create(
    model: CubismModel,
    buffer: ArrayBuffer,
    size: number,
    samplePerSec: number
  ): CubismMotionSync {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }

    const data: CubismMotionSyncData = CubismMotionSyncData.create(
      model,
      buffer,
      size
    );

    if (!data) {
      return null;
    }

    const processorList: csmVector<ICubismMotionSyncProcessor> =
      new csmVector<ICubismMotionSyncProcessor>();

    for (let index = 0; index < data.getSettingCount(); index++) {
      let processor: ICubismMotionSyncProcessor = null;
      const engineType: EngineType = data.getSetting(index).analysisType;
      switch (engineType) {
        case EngineType.EngineType_Cri:
          processor = this.InitializeEngineCri(
            engineType,
            data,
            index,
            samplePerSec
          );
          break;
        default:
          CubismLogWarning(
            '[CubismMotionSync.Create] Index{0}: Can not create processor because `AnalysisType` is unknown.',
            index
          );
          break;
      }

      if (processor != null) {
        processorList.pushBack(processor);
      }
    }

    return new CubismMotionSync(model, data, processorList);
  }

  private static InitializeEngineCri(
    engineType: EngineType,
    data: CubismMotionSyncData,
    index: number,
    samplePerSec: number
  ): CubismMotionSyncProcessorCRI {
    let engine: ICubismMotionSyncEngine =
      CubismMotionSyncEngineController.getEngine(engineType);

    if (s_option.engineConfig != null) {
      s_engineConfigCriData = new MotionSyncEngineConfigCriData();
      s_engineConfigCriData.engineConfigBuffer = new Int32Array(
        s_engineConfigStructSize
      );
      s_engineConfigCriData.engineConfigPtr =
        Live2DCubismMotionSyncCore.ToPointer.Malloc(
          s_engineConfigCriData.engineConfigBuffer.length *
            s_engineConfigCriData.engineConfigBuffer.BYTES_PER_ELEMENT
        );
      Live2DCubismMotionSyncCore.ToPointer.ConvertEngineConfigCriToInt32Array(
        s_engineConfigCriData.engineConfigBuffer,
        s_engineConfigCriData.engineConfigPtr,
        s_option.engineConfig.Allocator,
        s_option.engineConfig.Deallocator
      );
    }

    const configPtr: number =
      s_engineConfigCriData != null ? s_engineConfigCriData.engineConfigPtr : 0;
    if (!engine) {
      engine = CubismMotionSyncEngineController.initializeEngine(configPtr);
    }

    let processor: CubismMotionSyncProcessorCRI = null;
    if (engine) {
      processor = (engine as CubismMotionSyncEngineCri).CreateProcessor(
        data.getSetting(index).cubismParameterList.getSize(),
        data.getMappingInfoList(index),
        samplePerSec
      );
    }

    return processor;
  }

  public static delete(instance: CubismMotionSync): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    instance = void 0;
    instance = null;
  }

  public setSoundBuffer(
    processIndex: number,
    buffer: csmVector<number>,
    startIndex: number
  ): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    if (processIndex < this._processorInfoList.getSize()) {
      this._processorInfoList.at(processIndex)._sampleBuffer = buffer;
      this._processorInfoList.at(processIndex)._sampleBufferIndex = startIndex;
    }
  }

  public release(): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    CubismMotionSyncData.delete(this._data);
    for (let index = 0; index < this._processorInfoList.getSize(); index++) {
      this._processorInfoList.at(index)._processor?.Close();
    }
  }

  public updateParameters(model: CubismModel, deltaTimeSeconds: number) {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    // 設定から時間を変更すると、経過時間がマイナスになることがあるので、経過時間0として対応。
    if (deltaTimeSeconds < 0.0) {
      deltaTimeSeconds = 0.0;
    }

    for (
      let processIndex = 0;
      processIndex < this._processorInfoList.getSize();
      processIndex++
    ) {
      this._processorInfoList.at(processIndex)._currentRemainTime +=
        deltaTimeSeconds;

      // Check each time assuming it may have been updated.
      const fps: number = this._processorInfoList.at(processIndex)._sampleRate;
      const processorDeltaTime: number = 1.0 / fps;

      this._processorInfoList.at(processIndex)._lastTotalProcessedCount = 0;

      // If the specified frame time is not reached, no analysis is performed.
      if (
        this._processorInfoList.at(processIndex)._currentRemainTime <
        processorDeltaTime
      ) {
        for (
          let targetIndex = 0;
          targetIndex <
          this._data.getSetting(processIndex).cubismParameterList.getSize();
          targetIndex++
        ) {
          if (
            isNaN(
              this._processorInfoList
                .at(processIndex)
                ._analysisResult.getValues()[targetIndex]
            ) ||
            this._data
              .getSetting(processIndex)
              .cubismParameterList.at(targetIndex).parameterIndex < 0
          ) {
            continue;
          }

          // Overwrite parameter values every frame to prevent data from replacing itself
          model.setParameterValueByIndex(
            this._data
              .getSetting(processIndex)
              .cubismParameterList.at(targetIndex).parameterIndex,
            this._processorInfoList
              .at(processIndex)
              ._lastDampedList.at(targetIndex)
          );
        }
        continue;
      }

      this.analyze(model, processIndex);

      // Reset counter.
      this._processorInfoList.at(processIndex)._currentRemainTime =
        CubismMath.mod(
          this._processorInfoList.at(processIndex)._currentRemainTime,
          processorDeltaTime
        );

      for (
        let targetIndex = 0;
        targetIndex <
        this._data.getSetting(processIndex).cubismParameterList.getSize();
        targetIndex++
      ) {
        if (
          isNaN(
            this._processorInfoList
              .at(processIndex)
              ._analysisResult.getValues()[targetIndex]
          ) ||
          this._data
            .getSetting(processIndex)
            .cubismParameterList.at(targetIndex).parameterIndex < 0
        ) {
          continue;
        }
        // Overwrite parameter values every frame to prevent data from replacing itself
        model.setParameterValueByIndex(
          this._data
            .getSetting(processIndex)
            .cubismParameterList.at(targetIndex).parameterIndex,
          this._processorInfoList
            .at(processIndex)
            ._lastDampedList.at(targetIndex)
        );
      }
    }
  }

  private analyze(model: CubismModel, processIndex: number): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    const processor: ICubismMotionSyncProcessor =
      this._processorInfoList.at(processIndex)._processor;
    const samples: csmVector<number> =
      this._processorInfoList.at(processIndex)._sampleBuffer;
    let beginIndex: number =
      this._processorInfoList.at(processIndex)._sampleBufferIndex;

    if (
      processor == null ||
      this._processorInfoList.at(processIndex)._sampleBuffer == null
    ) {
      return;
    }

    let analysisResult: CubismMotionSyncEngineAnalysisResult = null;

    const blendRatio: number =
      this._processorInfoList.at(processIndex)._blendRatio;
    const smoothing: number =
      this._processorInfoList.at(processIndex)._smoothing;
    const audioLevelEffectRatio: number =
      this._processorInfoList.at(processIndex)._audioLevelEffectRatio;

    const samplesSize = samples.getSize();
    let requireSampleCount = processor.getRequireSampleCount();

    for (let i = 0; i < samplesSize; i += requireSampleCount) {
      if (
        samplesSize == 0 ||
        samplesSize <= beginIndex ||
        samplesSize - beginIndex < processor.getRequireSampleCount()
      ) {
        break;
      }

      switch (processor.getType()) {
        case EngineType.EngineType_Cri:
          analysisResult = (processor as CubismMotionSyncProcessorCRI).Analyze(
            samples,
            beginIndex,
            blendRatio,
            smoothing,
            audioLevelEffectRatio,
            this._processorInfoList.at(processIndex)._analysisResult
          );
          break;
        default:
          break;
      }

      if (!analysisResult) {
        break;
      }

      const processedCount = analysisResult.getProcessedSampleCount();
      beginIndex += processedCount;

      this._processorInfoList.at(processIndex)._lastTotalProcessedCount +=
        processedCount;

      // モーションシンクライブラリで計算した内容をモデルに反映
      for (
        let targetIndex = 0;
        targetIndex <
        this._data.getSetting(processIndex).cubismParameterList.getSize();
        targetIndex++
      ) {
        let cacheValue: number = analysisResult.getValues()[targetIndex];

        if (isNaN(cacheValue)) {
          continue;
        }

        const smooth: number = this._data
          .getSetting(processIndex)
          .cubismParameterList.at(targetIndex).smooth;
        const damper: number = this._data
          .getSetting(processIndex)
          .cubismParameterList.at(targetIndex).damper;

        // Smoothing
        cacheValue =
          ((100.0 - smooth) * cacheValue +
            this._processorInfoList
              .at(processIndex)
              ._lastSmoothedList.at(targetIndex) *
              smooth) /
          100.0;
        this._processorInfoList
          .at(processIndex)
          ._lastSmoothedList.set(targetIndex, cacheValue);

        // Dampening
        if (
          Math.abs(
            cacheValue -
              this._processorInfoList
                .at(processIndex)
                ._lastDampedList.at(targetIndex)
          ) < damper
        ) {
          cacheValue = this._processorInfoList
            .at(processIndex)
            ._lastDampedList.at(targetIndex);
        }
        this._processorInfoList
          .at(processIndex)
          ._lastDampedList.set(targetIndex, cacheValue);
      }

      requireSampleCount = processor.getRequireSampleCount();
    }
  }

  public setBlendRatio(processIndex: number, blendRatio: number): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    if (processIndex < this._processorInfoList.getSize()) {
      this._processorInfoList.at(processIndex)._blendRatio = blendRatio;
    }
  }

  public SetSmoothing(processIndex: number, smoothing: number): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    if (processIndex < this._processorInfoList.getSize()) {
      this._processorInfoList.at(processIndex)._smoothing = smoothing;
    }
  }

  public SetSampleRate(processIndex: number, sampleRate: number): void {
    if (!CubismMotionSync.isInitialized()) {
      return;
    }
    if (processIndex < this._processorInfoList.getSize()) {
      this._processorInfoList.at(processIndex)._sampleRate = sampleRate;
    }
  }

  public getData(): CubismMotionSyncData {
    return this._data;
  }

  public getLastTotalProcessedCount(processIndex: number): number {
    return this._processorInfoList.at(processIndex)._lastTotalProcessedCount;
  }

  private constructor(
    model: CubismModel,
    data: CubismMotionSyncData,
    processorList: csmVector<ICubismMotionSyncProcessor>
  ) {
    this._data = data;
    this._processorInfoList = new csmVector<CubismProcessorInfo>();

    for (let index = 0; index < processorList?.getSize(); index++) {
      this._processorInfoList.pushBack(
        new CubismProcessorInfo(
          processorList.at(index),
          model,
          data.getSetting(index)
        )
      );
      this._processorInfoList.at(index).init(data.getSetting(index));
    }
  }

  private _processorInfoList: csmVector<CubismProcessorInfo>;
  private _data: CubismMotionSyncData;
}

export class MotionSyncOption {
  engineConfig: MotionSyncEngineConfigCri;
  logFunction: Live2DCubismMotionSyncCore.csmMotionSyncLogFunction; // ログ出力の関数オブジェクト
  loggingLevel: LogLevel; // ログ出力レベルの設定
}

export class MotionSyncEngineConfigCriData {
  engineConfigBuffer: Int32Array;
  engineConfigPtr: number;
}

export class CubismProcessorInfo {
  public constructor(
    processor: ICubismMotionSyncProcessor,
    model: CubismModel,
    setting: CubismMotionSyncDataSetting
  ) {
    this._processor = processor;
    this._blendRatio = 0.0;
    this._smoothing = 1;
    this._sampleRate = 30.0;
    this._audioLevelEffectRatio = 0.0;
    this._sampleBuffer = null;
    this._sampleBufferIndex = 0;
    this._model = model;
    this._currentRemainTime = 0.0;
    this._lastTotalProcessedCount = 0;

    this.init(setting);
    this._analysisResult = this._processor.createAnalysisResult();
  }

  public init(setting: CubismMotionSyncDataSetting): void {
    this._currentRemainTime = 0.0;
    this._lastSmoothedList = new csmVector<number>();
    this._lastDampedList = new csmVector<number>();

    for (
      let index = 0;
      index < setting.cubismParameterList.getSize();
      index++
    ) {
      let parameterValue: number = 0;

      // パラメータが存在する場合は値を取得
      // HACK: Listのインデックスを合わせるため、continueしない。
      if (setting.cubismParameterList.at(index).parameterIndex >= 0) {
        parameterValue = this._model.getParameterValueByIndex(
          setting.cubismParameterList.at(index).parameterIndex
        );
      }

      this._lastSmoothedList.pushBack(parameterValue);
      this._lastDampedList.pushBack(parameterValue);
    }

    this._blendRatio = setting.blendRatio;
    this._smoothing = setting.smoothing;
    this._sampleRate = setting.sampleRate;

    this._lastTotalProcessedCount = 0;
  }

  _processor: ICubismMotionSyncProcessor;
  _blendRatio: number;
  _smoothing: number;
  _sampleRate: number;
  _audioLevelEffectRatio: number; // Unused
  _sampleBuffer: csmVector<number>;
  _sampleBufferIndex: number;
  _model: CubismModel;
  _analysisResult: CubismMotionSyncEngineAnalysisResult;
  _currentRemainTime: number;
  _lastSmoothedList: csmVector<number>;
  _lastDampedList: csmVector<number>;
  _lastTotalProcessedCount: number;
}

// Namespace definition for compatibility.
import * as $ from './live2dcubismmotionsync';
import { MotionSyncEngineConfig_CRI as MotionSyncEngineConfigCri } from './motionsyncconfig_cri';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSync = $.CubismMotionSync;
  export type CubismMotionSync = $.CubismMotionSync;
}