/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismJson, } from '../framework/utils/cubismjson';
import { csmVector } from '../framework/type/csmvector';
import { csmString } from '../framework/type/csmstring';
import { CubismLogWarning } from '../framework/utils/cubismdebug';
import { EngineType } from './cubismmotionsyncutil';

import {
  CubismMotionSyncDataAudioParameter,
  CubismMotionSyncDataCubismParameter,
  CubismMotionSyncDataMapping,
  CubismMotionSyncDataMappingTarget,
  CubismMotionSyncDataMappingType,
  CubismMotionSyncDataMeta,
  CubismMotionSyncDataMetaDictionary,
  CubismMotionSyncDataSetting,
  CubismMotionSyncDataUseCase
} from './cubismmotionsyncdata';

// JSON keys
const Version = 'Version';
const Meta = 'Meta';
const SettingCount = 'SettingCount';
const Dictionary = 'Dictionary';
const Id = 'Id';
const Name = 'Name';
const Settings = 'Settings';
const AnalysisType = 'AnalysisType';
const UseCase = 'UseCase';
const CubismParameters = 'CubismParameters';
const Min = 'Min';
const Max = 'Max';
const Damper = 'Damper';
const Smooth = 'Smooth';
const AudioParameters = 'AudioParameters';
const Scale = 'Scale';
const Enabled = 'Enabled';
const Mappings = 'Mappings';
const Type = 'Type';
const Targets = 'Targets';
const Value = 'Value';
const PostProcessing = 'PostProcessing';
const BlendRatio = 'BlendRatio';
const Smoothing = 'Smoothing';
const SampleRate = 'SampleRate';

/**
 * motionsync3.jsonのコンテナ。
 */
export class CubismMotionSyncDataJson {
  /**
   * コンストラクタ
   * @param buffer motionsync3.jsonが読み込まれているバッファ
   * @param size バッファのサイズ
   */
  public constructor(buffer: ArrayBuffer, size: number) {
    this._json = CubismJson.create(buffer, size);
  }

  /**
   * デストラクタ相当の処理
   */
  public release(): void {
    CubismJson.delete(this._json);
  }

  /**
   * バージョン情報を取得する
   * @return バージョン数
   */
  public getVersion(): number {
    return this._json.getRoot().getValueByString(Version).toInt();
  }

  // --- Meta ---

  /**
   * モーションシンク設定のメタ情報を取得する
   * @return ーションシンク設定のメタ情報
   */
  public getMeta(): CubismMotionSyncDataMeta {
    let meta: CubismMotionSyncDataMeta = null;
    meta = new CubismMotionSyncDataMeta();

    meta.settingCount = this.getSettingCount();
    meta.dictionary = new csmVector<CubismMotionSyncDataMetaDictionary>();

    for (let index = 0; index < meta.settingCount; index++) {
      meta.dictionary.pushBack(this.getMetaDictionaryItem(index));
    }

    return meta;
  }

  /**
   * Metaのモーションシンク設定リストのアイテムを取得する
   * @param index アイテムのインデックス
   * @return モーションシンク設定リストのアイテム
   */
  public getMetaDictionaryItem(
    index: number
  ): CubismMotionSyncDataMetaDictionary {
    const dictionary: CubismMotionSyncDataMetaDictionary =
      new CubismMotionSyncDataMetaDictionary();
    dictionary.id = new csmString(this.getIdFromMeta(index));
    dictionary.name = new csmString(this.getName(index));

    return dictionary;
  }

  /**
   * モーションシンク設定の数を取得する
   * @return モーションシンク設定の数
   */
  public getSettingCount(): number {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(SettingCount)
      .toInt();
  }

  /**
   * Metaからモーションシンク設定のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定のId
   */
  public getIdFromMeta(settingIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(Dictionary)
      .getValueByIndex(settingIndex)
      .getValueByString(Id)
      .getString();
  }

  /**
   * モーションシンク設定の名前を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定の名前
   */
  public getName(settingIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(Meta)
      .getValueByString(Dictionary)
      .getValueByIndex(settingIndex)
      .getValueByString(Name)
      .getString();
  }

  // --- Settings ---

  /**
   * Settingsからモーションシンク設定を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定
   */
  public getSetting(settingIndex: number): CubismMotionSyncDataSetting {
    const setting: CubismMotionSyncDataSetting =
      new CubismMotionSyncDataSetting();

    // Id
    setting.id = new csmString(this.getIdFromSettings(settingIndex));

    // AnalysisType
    const analysisType: string = this.getAnalysisType(settingIndex);
    switch (analysisType) {
      case 'CRI':
        setting.analysisType = EngineType.EngineType_Cri;
        break;
      default:
        CubismLogWarning('Unknown Settings.AnalysisType.');
        setting.analysisType = EngineType.EngineType_Unknown;
        break;
    }

    // UseCase
    const useCase: string = this.getUseCase(settingIndex);
    switch (useCase) {
      case 'Mouth':
        setting.useCase = CubismMotionSyncDataUseCase.UseCase_Mouth;
        break;
      default:
        CubismLogWarning('Unknown Settings.UseCase.');
        setting.useCase = CubismMotionSyncDataUseCase.UseCase_Unknown;
        break;
    }

    // CubismParametars
    const cubismParametarsCount: number = this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getSize();

    setting.cubismParameterList =
      new csmVector<CubismMotionSyncDataCubismParameter>();
    for (let index = 0; index < cubismParametarsCount; index++) {
      setting.cubismParameterList.pushBack(
        this.getCubismParametarsElement(settingIndex, index)
      );
    }

    // AudioParameters
    const audioParametersCount: number = this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getSize();

    setting.audioParameterList =
      new csmVector<CubismMotionSyncDataAudioParameter>();
    for (let index = 0; index < audioParametersCount; index++) {
      setting.audioParameterList.pushBack(
        this.getAudioParametersElement(settingIndex, index)
      );
    }

    // Mappings
    setting.mappingList = new csmVector<CubismMotionSyncDataMapping>();
    for (let index = 0; index < audioParametersCount; index++) {
      setting.mappingList.pushBack(
        this.getMappingsElement(settingIndex, index, cubismParametarsCount)
      );
    }

    // PostProcessing
    setting.blendRatio = this.getBlendRatio(settingIndex);
    setting.smoothing = this.getSmoothingFromPostProcessing(settingIndex);
    setting.sampleRate = this.getSampleRate(settingIndex);

    return setting;
  }

  /**
   * Settingsからモーションシンク設定のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定のId
   */
  public getIdFromSettings(settingIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(Id)
      .getString();
  }

  /**
   * モーションシンク設定の音声解析タイプを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return 音声解析タイプ
   */
  public getAnalysisType(settingIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AnalysisType)
      .getString();
  }

  /**
   * モーションシンク設定のユースケースを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return ユースケース
   */
  public getUseCase(settingIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(UseCase)
      .getString();
  }

  // --- CubismParametars ---

  /**
   * CubismParametarsに登録されているCubismParametarアイテムを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarアイテム
   */
  public getCubismParametarsElement(
    settingIndex: number,
    elementIndex: number
  ): CubismMotionSyncDataCubismParameter {
    const cubismParametar: CubismMotionSyncDataCubismParameter =
      new CubismMotionSyncDataCubismParameter();
    cubismParametar.name = new csmString(
      this.getNameFromCubismParameters(settingIndex, elementIndex)
    );
    cubismParametar.id = new csmString(
      this.getIdFromCubismParameters(settingIndex, elementIndex)
    );
    cubismParametar.min = this.getMinFromCubismParameters(
      settingIndex,
      elementIndex
    );
    cubismParametar.max = this.getMaxFromCubismParameters(
      settingIndex,
      elementIndex
    );
    cubismParametar.damper = this.getDamperFromCubismParameters(
      settingIndex,
      elementIndex
    );
    cubismParametar.smooth = this.getSmoothFromCubismParameters(
      settingIndex,
      elementIndex
    );

    return cubismParametar;
  }

  /**
   * CubismParametarsに登録されているCubismParametarの名称を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの名称
   */
  public getNameFromCubismParameters(
    settingIndex: number,
    elementIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Name)
      .getString();
  }

  /**
   * CubismParametarsに登録されているCubismParametarのIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarのId
   */
  public getIdFromCubismParameters(
    settingIndex: number,
    elementIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Id)
      .getString();
  }

  /**
   * CubismParametarsに登録されているCubismParametarの最小値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの最小値
   */
  public getMinFromCubismParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Min)
      .toFloat();
  }

  /**
   * CubismParametarsに登録されているCubismParametarの最大値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの最大値
   */
  public getMaxFromCubismParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Max)
      .toFloat();
  }

  /**
   * CubismParametarsに登録されているCubismParametarの減衰値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの減衰値
   */
  public getDamperFromCubismParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Damper)
      .toFloat();
  }

  /**
   * CubismParametarsに登録されているCubismParametarのスムージング値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarのスムージング値
   */
  public getSmoothFromCubismParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(CubismParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Smooth)
      .toFloat();
  }

  // --- AudioParameters ---

  /**
   * AudioParametersに登録されている音声の要素を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素
   */
  public getAudioParametersElement(
    settingIndex: number,
    elementIndex: number
  ): CubismMotionSyncDataAudioParameter {
    const audioParameter: CubismMotionSyncDataAudioParameter =
      new CubismMotionSyncDataAudioParameter();
    audioParameter.name = new csmString(
      this.getNameFromAudioParameters(settingIndex, elementIndex)
    );
    audioParameter.id = new csmString(
      this.getIdFromAudioParameters(settingIndex, elementIndex)
    );
    audioParameter.min = this.getMinFromAudioParameters(
      settingIndex,
      elementIndex
    );
    audioParameter.max = this.getMaxFromAudioParameters(
      settingIndex,
      elementIndex
    );
    audioParameter.scale = this.getScaleFromAudioParameters(
      settingIndex,
      elementIndex
    );
    audioParameter.enabled = this.getEnabledFromAudioParameters(
      settingIndex,
      elementIndex
    );

    return audioParameter;
  }

  /**
   * AudioParametersに登録されている音声の要素の名称を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の名称
   */
  public getNameFromAudioParameters(
    settingIndex: number,
    elementIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Name)
      .getString();
  }

  /**
   * AudioParametersに登録されている音声の要素のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素のId
   */
  public getIdFromAudioParameters(
    settingIndex: number,
    elementIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Id)
      .getString();
  }

  /**
   * AudioParametersに登録されている音声の要素の最小値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の最小値
   */
  public getMinFromAudioParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Min)
      .toFloat();
  }

  /**
   * AudioParametersに登録されている音声の要素の最大値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の最大値
   */
  public getMaxFromAudioParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Max)
      .toFloat();
  }

  /**
   * AudioParametersに登録されている音声の要素のスケール値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素のスケール値
   */
  public getScaleFromAudioParameters(
    settingIndex: number,
    elementIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Scale)
      .toFloat();
  }

  /**
   * AudioParametersに登録されている音声の要素の有効フラグを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の有効フラグ
   */
  public getEnabledFromAudioParameters(
    settingIndex: number,
    elementIndex: number
  ): boolean {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(AudioParameters)
      .getValueByIndex(elementIndex)
      .getValueByString(Enabled)
      .toBoolean();
  }

  // --- Mappings ---

  /**
   * Mappingsに登録されているマッピングデータを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex Mappingsから取得したい要素のインデックス
   * @return マッピングデータ
   */
  public getMappingsElement(
    settingIndex: number,
    elementIndex: number,
    targetCount: number
  ): CubismMotionSyncDataMapping {
    const mapping: CubismMotionSyncDataMapping =
      new CubismMotionSyncDataMapping();
    const type: string = this.getMappingType(settingIndex, elementIndex);

    switch (type) {
      case 'Shape':
        mapping.type = CubismMotionSyncDataMappingType.MappingType_Shape;
        break;
      default:
        CubismLogWarning('Unknown Mappings.Type.');
        mapping.type = CubismMotionSyncDataMappingType.MappingType_Unknown;
        break;
    }

    mapping.audioId = new csmString(
      this.getAudioParamIdFromMappings(settingIndex, elementIndex)
    );

    mapping.targetList = new csmVector<CubismMotionSyncDataMappingTarget>();

    for (let targetIndex = 0; targetIndex < targetCount; targetIndex++) {
      mapping.targetList.pushBack(
        this.getMappingTargetsElement(settingIndex, elementIndex, targetIndex)
      );
    }

    return mapping;
  }

  /**
   * Mappingsに登録されているTargetsの要素を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param mappingIndex Mappingsから取得したい要素のインデックス
   * @param TargetsIndex Targetsから取得したい要素のインデックス
   * @return Targetsの要素
   */
  public getMappingTargetsElement(
    settingIndex: number,
    mappingIndex: number,
    targetIndex: number
  ): CubismMotionSyncDataMappingTarget {
    const target: CubismMotionSyncDataMappingTarget =
      new CubismMotionSyncDataMappingTarget();
    target.id = new csmString(
      this.getCubismIdFromMappingTarget(settingIndex, mappingIndex, targetIndex)
    );
    target.value = this.getValueFromMappingTarget(
      settingIndex,
      mappingIndex,
      targetIndex
    );

    return target;
  }

  /**
   * マッピングのタイプを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex Mappingsから取得したい要素のインデックス
   * @return マッピングのタイプ
   */
  public getMappingType(settingIndex: number, elementIndex: number): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(Mappings)
      .getValueByIndex(elementIndex)
      .getValueByString(Type)
      .getString();
  }

  /**
   * Mappingsに登録されている音声の要素のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex Mappingsから取得したい要素のインデックス
   * @return 音声の要素のId
   */
  public getAudioParamIdFromMappings(
    settingIndex: number,
    elementIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(Mappings)
      .getValueByIndex(elementIndex)
      .getValueByString(Id)
      .getString();
  }

  /**
   * Targetsに登録されているCubismParameterのIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param mappingIndex Mappingsから取得したい要素のインデックス
   * @param TargetsIndex Targetsから取得したい要素のインデックス
   * @return CubismParameterのId
   */
  public getCubismIdFromMappingTarget(
    settingIndex: number,
    mappingIndex: number,
    targetIndex: number
  ): string {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(Mappings)
      .getValueByIndex(mappingIndex)
      .getValueByString(Targets)
      .getValueByIndex(targetIndex)
      .getValueByString(Id)
      .getString();
  }

  /**
   * Targetsに登録されているCubismParameterの値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param mappingIndex Mappingsから取得したい要素のインデックス
   * @param TargetsIndex Targetsから取得したい要素のインデックス
   * @return CubismParameterの値
   */
  public getValueFromMappingTarget(
    settingIndex: number,
    mappingIndex: number,
    targetIndex: number
  ): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(Mappings)
      .getValueByIndex(mappingIndex)
      .getValueByString(Targets)
      .getValueByIndex(targetIndex)
      .getValueByString(Value)
      .toFloat();
  }

  // --- PostProcessing ---

  /**
   * ブレンド率を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return ブレンド率
   */
  public getBlendRatio(settingIndex: number): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(PostProcessing)
      .getValueByString(BlendRatio)
      .toFloat();
  }

  /**
   * スムージング値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return スムージング値
   */
  public getSmoothingFromPostProcessing(settingIndex: number): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(PostProcessing)
      .getValueByString(Smoothing)
      .toInt();
  }

  /**
   * 設定フレームレートを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return 設定フレームレート
   */
  public getSampleRate(settingIndex: number): number {
    return this._json
      .getRoot()
      .getValueByString(Settings)
      .getValueByIndex(settingIndex)
      .getValueByString(PostProcessing)
      .getValueByString(SampleRate)
      .toFloat();
  }

  _json: CubismJson; // motionsync3.jsonのデータ
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncdatajson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSyncDataJson = $.CubismMotionSyncDataJson;
  export type CubismMotionSyncDataJson = $.CubismMotionSyncDataJson;
}
