/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmString } from '../framework/type/csmstring';
import { csmVector } from '../framework/type/csmvector';
import { CubismLogError, } from '../framework/utils/cubismdebug';
import ToPointer = Live2DCubismMotionSyncCore.ToPointer;

export const MappingInfoStructSize = 6;

export class CubismMotionSyncEngineMappingInfo {
  public constructor(
    audioParameterId: csmString,
    modelParameterIds: csmVector<csmString>,
    modelParameterValues: csmVector<number>,
    scale: number,
    enabled: boolean
  ) {
    if (audioParameterId.getLength() == 0) {
      CubismLogError('The audio parameter ID is null.');
    }
    if (modelParameterIds.getSize() == 0) {
      CubismLogError(
        'The array length of IDs differs from the array length of parameter values. Please make them the same'
      );
    }
    if (modelParameterValues.getSize() == 0) {
      CubismLogError(
        'The model parameter ID array or the model parameter value array length is 0.'
      );
    }
    if (!(0.1 <= scale && scale <= 10.0)) {
      CubismLogError(
        'The value of scale is incorrect. The value is limited to between 0.1 and 10.0.'
      );
    }

    this._audioParameterId = audioParameterId;
    this._modelParameterIds = modelParameterIds;
    this._modelParameterValues = modelParameterValues;
    this._scale = scale;
    this._enabled = Number(enabled);
  }

  public toNativeArray(forceConversion: boolean): Float32Array {
    // 強制的に新規作成しないのであれば既にあるものを返す
    if (!forceConversion && this._nativeArray) {
      return this._nativeArray;
    }

    if (this._nativeArray) {
      this.releaseNativeArray();
    }
    this._nativeArray = new Float32Array(MappingInfoStructSize);
    this._nativeArrayPtr = ToPointer.Malloc(
      this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT
    );

    const mappingInfoModelParameterIds = new Array<string>();
    const mappingInfoModelParameterValues = new Array<number>();
    for (
      let mappingInfoIndex = 0;
      mappingInfoIndex < this._modelParameterIds.getSize();
      mappingInfoIndex++
    ) {
      // 直接 csmStringとstringは変換できないので一度確保する
      mappingInfoModelParameterIds.push(
        this._modelParameterIds.at(mappingInfoIndex).s
      );

      // 事故防止のためIds同様に一度確保する
      mappingInfoModelParameterValues.push(
        this._modelParameterValues.at(mappingInfoIndex)
      );
    }

    // Nativeポインタへの変換
    this._nativeArray = ToPointer.ConvertMappingInfoCriToFloat32Array(
      this._nativeArray,
      this._nativeArrayPtr,
      this._audioParameterId.s,
      mappingInfoModelParameterIds,
      mappingInfoModelParameterValues,
      this._modelParameterIds.getSize(),
      this._scale,
      this._enabled
    );

    return this._nativeArray;
  }

  public releaseNativeArray(): void {
    this.deallocNativeArrayPtr();
    this._nativeArray = void 0;
  }

  public getAudioParameterId(): csmString {
    return this._audioParameterId;
  }

  public getModelParameterIds(): csmVector<csmString> {
    return this._modelParameterIds;
  }

  public getModelParameterValues(): csmVector<number> {
    return this._modelParameterValues;
  }

  public getScale(): number {
    return this._scale;
  }

  public getEnabled(): number {
    return this._enabled;
  }

  private deallocNativeArrayPtr(): void {
    // 参照渡しになっている箇所だけ先にメモリ解放
    ToPointer.Free(this._nativeArray[0]);
    ToPointer.Free(this._nativeArray[1]);
    ToPointer.Free(this._nativeArray[2]);

    // 配列本体を解放
    ToPointer.Free(this._nativeArrayPtr);
    this._nativeArrayPtr = 0;
  }

  private _audioParameterId: csmString;
  private _modelParameterIds: csmVector<csmString>;
  private _modelParameterValues: csmVector<number>;
  private _scale: number;
  private _enabled: number;
  private _nativeArray: Float32Array;
  private _nativeArrayPtr: number;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncenginemappinginfo';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSyncEngineMappingInfo =
    $.CubismMotionSyncEngineMappingInfo;
  export type CubismMotionSyncEngineMappingInfo =
    $.CubismMotionSyncEngineMappingInfo;
}
