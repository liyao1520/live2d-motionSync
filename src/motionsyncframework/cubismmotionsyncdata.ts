/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmString } from '../framework/type/csmstring';
import { csmVector } from '../framework/type/csmvector';
import { CubismLogWarning } from '../framework/utils/cubismdebug';
import { CubismModel } from '../framework/model/cubismmodel';
import { EngineType } from './cubismmotionsyncutil';
import { CubismMotionSyncDataJson } from './cubismmotionsyncdatajson';
import { CubismMotionSyncEngineMappingInfo } from './cubismmotionsyncenginemappinginfo';

export class CubismMotionSyncData {
  /**
   * インスタンスの作成
   * @param buffer    physics3.jsonが読み込まれているバッファ
   * @param size      バッファのサイズ
   * @return 作成されたインスタンス
   */
  public static create(model: CubismModel, buffer: ArrayBuffer, size: number) {
    const ret: CubismMotionSyncData = new CubismMotionSyncData();

    ret.parse(model, buffer, size);

    return ret;
  }

  /**
   * インスタンスを破棄する
   * @param motionSyncData 破棄するインスタンス
   */
  public static delete(motionSyncData: CubismMotionSyncData): void {
    if (motionSyncData != null) {
      motionSyncData.release();
      motionSyncData = null;
    }
  }
  /**
   * motionsync3.jsonをパースする。
   *
   * @param motionSyncJson  motionsync3.jsonが読み込まれているバッファ
   * @param size        バッファのサイズ
   */
  public parse(
    model: CubismModel,
    motionSyncJson: ArrayBuffer,
    size: number
  ): void {
    let json: CubismMotionSyncDataJson = new CubismMotionSyncDataJson(
      motionSyncJson,
      size
    );

    if (json._json == null || model == null) {
      CubismLogWarning('Failed to parse .motionsync3.json.');
      return;
    }

    this._version = json.getVersion();
    this._meta = json.getMeta();

    this._settings = new csmVector<CubismMotionSyncDataSetting>();
    for (let index = 0; index < this._meta.settingCount; index++) {
      this._settings.pushBack(json.getSetting(index));
    }
    this._settingCount = this._settings.getSize();

    for (let index = 0; index < this._settings.getSize(); index++) {
      const cubismParameterList = this._settings.at(index).cubismParameterList;
      const parameterCount = cubismParameterList.getSize();

      for (
        let cubismParameterIndex = 0;
        cubismParameterIndex < parameterCount;
        cubismParameterIndex++
      ) {
        let parameterIndex: number = -1;

        for (
          let modelParameterIndex = 0;
          modelParameterIndex < model.getParameterCount();
          modelParameterIndex++
        ) {
          if (
            // model
            //   .getParameterId(modelParameterIndex)
            //   .isEqual(cubismParameterList.at(cubismParameterIndex).id)

            // fix 
            model._parameterIds[modelParameterIndex] ===
            cubismParameterList.at(cubismParameterIndex).id.s
          ) {
            parameterIndex = modelParameterIndex;
            break;
          }
        }
        cubismParameterList.at(cubismParameterIndex).parameterIndex =
          parameterIndex;

        if (parameterIndex < 0) {
          CubismLogWarning(
            `Failed to find parameter index for ${
              cubismParameterList.at(cubismParameterIndex).id.s
            }`
          );
        }
      }
    }

    json.release();
    json = void 0;
    json = null;
  }

  /**
   * デストラクタ相当の処理
   */
  public release(): void {
    this._version = void 0;
    this._meta = void 0;
    this._meta = null;
    this._settings = void 0;
    this._settings = null;
    this._settingCount = 0;
  }

  public getVersion(): number {
    return this._version;
  }

  public getMeta(): CubismMotionSyncDataMeta {
    return this._meta;
  }

  public getSetting(index: number): CubismMotionSyncDataSetting {
    return this._settings.at(index);
  }

  public getSettingCount(): number {
    return this._settingCount;
  }

  public getMappingInfoList(
    index: number
  ): csmVector<CubismMotionSyncEngineMappingInfo> {
    if (this._settings.getSize() <= index) {
      return null;
    }
    const mappingInfoList: csmVector<CubismMotionSyncEngineMappingInfo> =
      new csmVector<CubismMotionSyncEngineMappingInfo>();

    const setting = this.getSetting(index);

    for (
      let audioParamIndex = 0;
      audioParamIndex < setting.audioParameterList.getSize();
      audioParamIndex++
    ) {
      const audioParamId: csmString =
        setting.audioParameterList.at(audioParamIndex).id;

      const modelParamIds: csmVector<csmString> = new csmVector<csmString>();
      const modelParamValues: csmVector<number> = new csmVector<number>();

      for (
        let serchIndex = 0;
        serchIndex < setting.audioParameterList.getSize();
        serchIndex++
      ) {
        if (
          audioParamId.isEqual(setting.mappingList.at(serchIndex).audioId.s)
        ) {
          for (
            let cubismPramIndex = 0;
            cubismPramIndex < setting.cubismParameterList.getSize();
            cubismPramIndex++
          ) {
            const target: CubismMotionSyncDataMappingTarget =
              setting.mappingList.at(serchIndex).targetList.at(cubismPramIndex);
            modelParamIds.pushBack(target.id);
            modelParamValues.pushBack(target.value);
          }
          break;
        }
      }

      const scale: number =
        setting.audioParameterList.at(audioParamIndex).scale;
      const enabled: boolean =
        setting.audioParameterList.at(audioParamIndex).enabled;

      mappingInfoList.pushBack(
        new CubismMotionSyncEngineMappingInfo(
          audioParamId,
          modelParamIds,
          modelParamValues,
          scale,
          enabled
        )
      );
    }

    return mappingInfoList;
  }

  /**
   * コンストラクタ
   */
  private constructor() {
    this._version = 0;
    this._meta = null;
    this._settings = null;
  }

  private _version: number;
  private _meta: CubismMotionSyncDataMeta;
  private _settings: csmVector<CubismMotionSyncDataSetting>;
  private _settingCount: number;
}

/**
 * モーションシンク設定のユースケース
 */
export enum CubismMotionSyncDataUseCase {
  UseCase_Mouth = 0,
  UseCase_Unknown
}

/**
 * モーションシンク設定のマッピングタイプ
 */
export enum CubismMotionSyncDataMappingType {
  MappingType_Shape = 0,
  MappingType_Unknown
}

/**
 * モーションシンク設定のIdと名称
 */
export class CubismMotionSyncDataMetaDictionary {
  public id: csmString;
  public name: csmString;
}

/**
 * メタデータ
 */
export class CubismMotionSyncDataMeta {
  public settingCount: number;
  public dictionary: csmVector<CubismMotionSyncDataMetaDictionary>;
}

/**
 * CubismParametarsに登録されているCubismParametar
 */
export class CubismMotionSyncDataCubismParameter {
  public name: csmString;
  public id: csmString;
  public min: number;
  public max: number;
  public damper: number;
  public smooth: number;
  public parameterIndex: number;
}

/**
 * AudioParametersに登録されている音声の要素
 */
export class CubismMotionSyncDataAudioParameter {
  public name: csmString;
  public id: csmString;
  public min: number;
  public max: number;
  public scale: number;
  public enabled: boolean;
}

/**
 * マッピングのターゲット
 */
export class CubismMotionSyncDataMappingTarget {
  public id: csmString;
  public value: number;
}

/**
 * マッピングデータ
 */
export class CubismMotionSyncDataMapping {
  public type: CubismMotionSyncDataMappingType;
  public audioId: csmString;
  public targetList: csmVector<CubismMotionSyncDataMappingTarget>;
}

export class CubismMotionSyncDataSetting {
  public id: csmString;
  public analysisType: EngineType;
  public useCase: CubismMotionSyncDataUseCase;
  public cubismParameterList: csmVector<CubismMotionSyncDataCubismParameter>;
  public audioParameterList: csmVector<CubismMotionSyncDataAudioParameter>;
  public mappingList: csmVector<CubismMotionSyncDataMapping>;
  public blendRatio: number;
  public smoothing: number;
  public sampleRate: number;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncdata';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSyncData = $.CubismMotionSyncData;
  export type CubismMotionSyncData = $.CubismMotionSyncData;
}