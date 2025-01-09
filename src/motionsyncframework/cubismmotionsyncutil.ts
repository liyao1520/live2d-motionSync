/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmVector } from '../framework/type/csmvector';
import { CubismMotionSyncContext } from './cubismmotionsyncenginelib';
import {
  CubismMotionSyncEngineMappingInfo,
  MappingInfoStructSize
} from './cubismmotionsyncenginemappinginfo';
import ToPointer = Live2DCubismMotionSyncCore.ToPointer;

export enum EngineType {
  EngineType_Cri = 0,
  EngineType_Unknown
}

export class MotionSyncUtil {
  /**
   * @deprecated 非推奨になりました。代わりにCubismMath.fmodを使用してください。
   *
   * 浮動小数点の余りを求める。
   *
   * @param x 被除数（割られる値）
   * @param y 除数（割る値）
   * @returns 余り
   */
  public static fmod(x: number, y: number) {
    return Number((x - Math.floor(x / y) * y).toPrecision(8));
  }
}

export class MappingInfoListMapper {
  // デストラクタ
  public release(): void {
    this.deleteMappingInfoList();
  }

  public setJObject(
    mappingInfoList: csmVector<CubismMotionSyncEngineMappingInfo>
  ): void {
    this.deleteMappingInfoList();
    this._infoBufferList = new csmVector<Float32Array>();
    this.ConvertObjectToNative(mappingInfoList);
  }

  public ConvertObjectToNative(
    infoList: csmVector<CubismMotionSyncEngineMappingInfo>
  ): void {
    const infoListCount: number = infoList.getSize();

    for (let index = 0; index < infoListCount; index++) {
      this._infoBufferList.pushBack(infoList.at(index).toNativeArray(true));
    }

    // メモリ確保
    let mappingInfoListPtr = ToPointer.Malloc(
      this._infoBufferList.at(0).length *
      infoListCount *
      this._infoBufferList.at(0).BYTES_PER_ELEMENT
    );
    // 先頭アドレスを保存
    this._mappingInfoListFirstPtr = mappingInfoListPtr;

    // メモリ上で1列に並べる
    for (
      let infoListIndex = 0;
      infoListIndex < infoListCount;
      infoListIndex++
    ) {
      // 要素の数分回す
      for (
        let infoElementIndex = 0;
        infoElementIndex < MappingInfoStructSize;
        infoElementIndex++
      ) {
        if (infoElementIndex == 4) {
          // Floatの値渡しなのでここだけこのようにする
          ToPointer.AddValuePtrFloat(
            mappingInfoListPtr,
            infoElementIndex * Float32Array.BYTES_PER_ELEMENT,
            this._infoBufferList.at(infoListIndex)[infoElementIndex]
          );
        } else {
          ToPointer.AddValuePtrInt32(
            mappingInfoListPtr,
            infoElementIndex * Float32Array.BYTES_PER_ELEMENT,
            this._infoBufferList.at(infoListIndex)[infoElementIndex]
          );
        }
      }
      // 利用したバイト数分ポインタを進める
      mappingInfoListPtr +=
        MappingInfoStructSize * Float32Array.BYTES_PER_ELEMENT;
    }
  }

  public deleteMappingInfoList(): void {
    if (!this._infoBufferList) {
      return;
    }

    this._infoBufferList.clear();
    this._infoBufferList = void 0;
    this._infoBufferList = null;
  }

  public getMappingInfoListPtr(): number {
    return this._mappingInfoListFirstPtr;
  }

  private _infoBufferList: csmVector<Float32Array>;
  private _mappingInfoListFirstPtr: number;
}

export class MotionSyncContext {
  public constructor(
    context: CubismMotionSyncContext,
    mapper: MappingInfoListMapper,
    cubismParameterCount: number
  ) {
    this._context = context;
    this._mapper = mapper;
    this._cubismParameterCount = cubismParameterCount;
  }

  public release() {
    this._context?.csmMotionSyncDelete();
    this._context = void 0;
    this._context = null;

    this._mapper?.release();
    this._mapper = void 0;
    this._mapper = null;

    this._cubismParameterCount = 0;
  }

  public getContext(): CubismMotionSyncContext {
    return this._context;
  }

  public getMapper(): MappingInfoListMapper {
    return this._mapper;
  }

  public getCubismParameterCount(): number {
    return this._cubismParameterCount;
  }

  private _context: CubismMotionSyncContext;
  private _mapper: MappingInfoListMapper;
  private _cubismParameterCount: number;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncutil';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const MotionSyncUtil = $.MotionSyncUtil;
  export type MotionSyncUtil = $.MotionSyncUtil;
  export const MotionSyncContext = $.MotionSyncContext;
  export type MotionSyncContext = $.MotionSyncContext;
  export const MappingInfoListMapper = $.MappingInfoListMapper;
  export type MappingInfoListMapper = $.MappingInfoListMapper;
}
