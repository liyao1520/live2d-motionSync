/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismIdHandle } from '../id/cubismid';
import { CubismBlendMode, CubismTextureColor } from '../rendering/cubismrenderer';
import { csmVector } from '../type/csmvector';
/**
 * SDK側から与えられたDrawableの乗算色・スクリーン色上書きフラグと
 * その色を保持する構造体
 */
export declare class DrawableColorData {
  constructor(isOverwritten?: boolean, color?: CubismTextureColor);
  isOverwritten: boolean;
  color: CubismTextureColor;
}
/**
 * @brief テクスチャの色をRGBAで扱うための構造体
 */
export declare class PartColorData {
  constructor(isOverwritten?: boolean, color?: CubismTextureColor);
  isOverwritten: boolean;
  color: CubismTextureColor;
}
/**
 * テクスチャのカリング設定を管理するための構造体
 */
export declare class DrawableCullingData {
  /**
   * コンストラクタ
   *
   * @param isOverwritten
   * @param isCulling
   */
  constructor(isOverwritten?: boolean, isCulling?: boolean);
  isOverwritten: boolean;
  isCulling: boolean;
}
/**
 * モデル
 *
 * Mocデータから生成されるモデルのクラス。
 */
export declare class CubismModel {
  /**
   * モデルのパラメータの更新
   */
  update(): void;
  /**
   * PixelsPerUnitを取得する
   * @returns PixelsPerUnit
   */
  getPixelsPerUnit(): number;
  /**
   * キャンバスの幅を取得する
   */
  getCanvasWidth(): number;
  /**
   * キャンバスの高さを取得する
   */
  getCanvasHeight(): number;
  /**
   * パラメータを保存する
   */
  saveParameters(): void;
  /**
   * 乗算色を取得する
   * @param index Drawablesのインデックス
   * @returns 指定したdrawableの乗算色(RGBA)
   */
  getMultiplyColor(index: number): CubismTextureColor;
  /**
   * スクリーン色を取得する
   * @param index Drawablesのインデックス
   * @returns 指定したdrawableのスクリーン色(RGBA)
   */
  getScreenColor(index: number): CubismTextureColor;
  /**
   * 乗算色をセットする
   * @param index Drawablesのインデックス
   * @param color 設定する乗算色(CubismTextureColor)
   */
  setMultiplyColorByTextureColor(index: number, color: CubismTextureColor): void;
  /**
   * 乗算色をセットする
   * @param index Drawablesのインデックス
   * @param r 設定する乗算色のR値
   * @param g 設定する乗算色のG値
   * @param b 設定する乗算色のB値
   * @param a 設定する乗算色のA値
   */
  setMultiplyColorByRGBA(index: number, r: number, g: number, b: number, a?: number): void;
  /**
   * スクリーン色をセットする
   * @param index Drawablesのインデックス
   * @param color 設定するスクリーン色(CubismTextureColor)
   */
  setScreenColorByTextureColor(index: number, color: CubismTextureColor): void;
  /**
   * スクリーン色をセットする
   * @param index Drawablesのインデックス
   * @param r 設定するスクリーン色のR値
   * @param g 設定するスクリーン色のG値
   * @param b 設定するスクリーン色のB値
   * @param a 設定するスクリーン色のA値
   */
  setScreenColorByRGBA(index: number, r: number, g: number, b: number, a?: number): void;
  /**
   * partの乗算色を取得する
   * @param partIndex partのインデックス
   * @returns 指定したpartの乗算色
   */
  getPartMultiplyColor(partIndex: number): CubismTextureColor;
  /**
   * partのスクリーン色を取得する
   * @param partIndex partのインデックス
   * @returns 指定したpartのスクリーン色
   */
  getPartScreenColor(partIndex: number): CubismTextureColor;
  /**
   * partのOverwriteColor setter関数
   * @param partIndex partのインデックス
   * @param r 設定する色のR値
   * @param g 設定する色のG値
   * @param b 設定する色のB値
   * @param a 設定する色のA値
   * @param partColors 設定するpartのカラーデータ配列
   * @param drawableColors partに関連するDrawableのカラーデータ配列
   */
  setPartColor(partIndex: number, r: number, g: number, b: number, a: number, partColors: csmVector<PartColorData>, drawableColors: csmVector<DrawableColorData>): void;
  /**
   * 乗算色をセットする
   * @param partIndex partのインデックス
   * @param color 設定する乗算色(CubismTextureColor)
   */
  setPartMultiplyColorByTextureColor(partIndex: number, color: CubismTextureColor): void;
  /**
   * 乗算色をセットする
   * @param partIndex partのインデックス
   * @param r 設定する乗算色のR値
   * @param g 設定する乗算色のG値
   * @param b 設定する乗算色のB値
   * @param a 設定する乗算色のA値
   */
  setPartMultiplyColorByRGBA(partIndex: number, r: number, g: number, b: number, a: number): void;
  /**
   * スクリーン色をセットする
   * @param partIndex partのインデックス
   * @param color 設定するスクリーン色(CubismTextureColor)
   */
  setPartScreenColorByTextureColor(partIndex: number, color: CubismTextureColor): void;
  /**
   * スクリーン色をセットする
   * @param partIndex partのインデックス
   * @param r 設定するスクリーン色のR値
   * @param g 設定するスクリーン色のG値
   * @param b 設定するスクリーン色のB値
   * @param a 設定するスクリーン色のA値
   */
  setPartScreenColorByRGBA(partIndex: number, r: number, g: number, b: number, a: number): void;
  /**
   * SDKから指定したモデルの乗算色を上書きするか
   * @returns true -> SDKからの情報を優先する
   *          false -> モデルに設定されている色情報を使用
   */
  getOverwriteFlagForModelMultiplyColors(): boolean;
  /**
   * SDKから指定したモデルのスクリーン色を上書きするか
   * @returns true -> SDKからの情報を優先する
   *          false -> モデルに設定されている色情報を使用
   */
  getOverwriteFlagForModelScreenColors(): boolean;
  /**
   * SDKから指定したモデルの乗算色を上書きするかセットする
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   */
  setOverwriteFlagForModelMultiplyColors(value: boolean): void;
  /**
   * SDKから指定したモデルのスクリーン色を上書きするかセットする
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   */
  setOverwriteFlagForModelScreenColors(value: boolean): void;
  /**
   * SDKから指定したDrawableIndexの乗算色を上書きするか
   * @returns true -> SDKからの情報を優先する
   *          false -> モデルに設定されている色情報を使用
   */
  getOverwriteFlagForDrawableMultiplyColors(drawableindex: number): boolean;
  /**
   * SDKから指定したDrawableIndexのスクリーン色を上書きするか
   * @returns true -> SDKからの情報を優先する
   *          false -> モデルに設定されている色情報を使用
   */
  getOverwriteFlagForDrawableScreenColors(drawableindex: number): boolean;
  /**
   * SDKから指定したDrawableIndexの乗算色を上書きするかセットする
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   */
  setOverwriteFlagForDrawableMultiplyColors(drawableindex: number, value: boolean): void;
  /**
   * SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   */
  setOverwriteFlagForDrawableScreenColors(drawableindex: number, value: boolean): void;
  /**
   * SDKからpartの乗算色を上書きするか
   * @param partIndex partのインデックス
   * @returns true    ->  SDKからの情報を優先する
   *          false   ->  モデルに設定されている色情報を使用
   */
  getOverwriteColorForPartMultiplyColors(partIndex: number): boolean;
  /**
   * SDKからpartのスクリーン色を上書きするか
   * @param partIndex partのインデックス
   * @returns true    ->  SDKからの情報を優先する
   *          false   ->  モデルに設定されている色情報を使用
   */
  getOverwriteColorForPartScreenColors(partIndex: number): boolean;
  /**
   * partのOverwriteFlag setter関数
   * @param partIndex partのインデックス
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   * @param partColors 設定するpartのカラーデータ配列
   * @param drawableColors partに関連するDrawableのカラーデータ配列
   */
  setOverwriteColorForPartColors(partIndex: number, value: boolean, partColors: csmVector<PartColorData>, drawableColors: csmVector<DrawableColorData>): void;
  /**
   * SDKからpartのスクリーン色を上書きするかをセットする
   * @param partIndex partのインデックス
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   */
  setOverwriteColorForPartMultiplyColors(partIndex: number, value: boolean): void;
  /**
   * SDKからpartのスクリーン色を上書きするかをセットする
   * @param partIndex partのインデックス
   * @param value true -> SDKからの情報を優先する
   *              false -> モデルに設定されている色情報を使用
   */
  setOverwriteColorForPartScreenColors(partIndex: number, value: boolean): void;
  /**
   * Drawableのカリング情報を取得する。
   *
   * @param   drawableIndex   Drawableのインデックス
   * @return  Drawableのカリング情報
   */
  getDrawableCulling(drawableIndex: number): boolean;
  /**
   * Drawableのカリング情報を設定する。
   *
   * @param drawableIndex Drawableのインデックス
   * @param isCulling カリング情報
   */
  setDrawableCulling(drawableIndex: number, isCulling: boolean): void;
  /**
   * SDKからモデル全体のカリング設定を上書きするか。
   *
   * @retval  true    ->  SDK上のカリング設定を使用
   * @retval  false   ->  モデルのカリング設定を使用
   */
  getOverwriteFlagForModelCullings(): boolean;
  /**
   * SDKからモデル全体のカリング設定を上書きするかを設定する。
   *
   * @param isOverwrittenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
   */
  setOverwriteFlagForModelCullings(isOverwrittenCullings: boolean): void;
  /**
   *
   * @param drawableIndex Drawableのインデックス
   * @retval  true    ->  SDK上のカリング設定を使用
   * @retval  false   ->  モデルのカリング設定を使用
   */
  getOverwriteFlagForDrawableCullings(drawableIndex: number): boolean;
  /**
   *
   * @param drawableIndex Drawableのインデックス
   * @param isOverwrittenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
   */
  setOverwriteFlagForDrawableCullings(drawableIndex: number, isOverwrittenCullings: boolean): void;
  /**
   * モデルの不透明度を取得する
   *
   * @returns 不透明度の値
   */
  getModelOapcity(): number;
  /**
   * モデルの不透明度を設定する
   *
   * @param value 不透明度の値
   */
  setModelOapcity(value: number): void;
  /**
   * モデルを取得
   */
  getModel(): Live2DCubismCore.Model;
  /**
   * パーツのインデックスを取得
   * @param partId パーツのID
   * @return パーツのインデックス
   */
  getPartIndex(partId: CubismIdHandle): number;
  /**
   * パーツのIDを取得する。
   *
   * @param partIndex 取得するパーツのインデックス
   * @return パーツのID
   */
  getPartId(partIndex: number): CubismIdHandle;
  /**
   * パーツの個数の取得
   * @return パーツの個数
   */
  getPartCount(): number;
  /**
   * パーツの不透明度の設定(Index)
   * @param partIndex パーツのインデックス
   * @param opacity 不透明度
   */
  setPartOpacityByIndex(partIndex: number, opacity: number): void;
  /**
   * パーツの不透明度の設定(Id)
   * @param partId パーツのID
   * @param opacity パーツの不透明度
   */
  setPartOpacityById(partId: CubismIdHandle, opacity: number): void;
  /**
   * パーツの不透明度の取得(index)
   * @param partIndex パーツのインデックス
   * @return パーツの不透明度
   */
  getPartOpacityByIndex(partIndex: number): number;
  /**
   * パーツの不透明度の取得(id)
   * @param partId パーツのＩｄ
   * @return パーツの不透明度
   */
  getPartOpacityById(partId: CubismIdHandle): number;
  /**
   * パラメータのインデックスの取得
   * @param パラメータID
   * @return パラメータのインデックス
   */
  getParameterIndex(parameterId: CubismIdHandle): number;
  /**
   * パラメータの個数の取得
   * @return パラメータの個数
   */
  getParameterCount(): number;
  /**
   * パラメータの種類の取得
   * @param parameterIndex パラメータのインデックス
   * @return csmParameterType_Normal -> 通常のパラメータ
   *          csmParameterType_BlendShape -> ブレンドシェイプパラメータ
   */
  getParameterType(parameterIndex: number): Live2DCubismCore.csmParameterType;
  /**
   * パラメータの最大値の取得
   * @param parameterIndex パラメータのインデックス
   * @return パラメータの最大値
   */
  getParameterMaximumValue(parameterIndex: number): number;
  /**
   * パラメータの最小値の取得
   * @param parameterIndex パラメータのインデックス
   * @return パラメータの最小値
   */
  getParameterMinimumValue(parameterIndex: number): number;
  /**
   * パラメータのデフォルト値の取得
   * @param parameterIndex パラメータのインデックス
   * @return パラメータのデフォルト値
   */
  getParameterDefaultValue(parameterIndex: number): number;
  /**
   * 指定したパラメータindexのIDを取得
   *
   * @param parameterIndex パラメータのインデックス
   * @returns パラメータID
   */
  getParameterId(parameterIndex: number): CubismIdHandle;
  /**
   * パラメータの値の取得
   * @param parameterIndex    パラメータのインデックス
   * @return パラメータの値
   */
  getParameterValueByIndex(parameterIndex: number): number;
  /**
   * パラメータの値の取得
   * @param parameterId    パラメータのID
   * @return パラメータの値
   */
  getParameterValueById(parameterId: CubismIdHandle): number;
  /**
   * パラメータの値の設定
   * @param parameterIndex パラメータのインデックス
   * @param value パラメータの値
   * @param weight 重み
   */
  setParameterValueByIndex(parameterIndex: number, value: number, weight?: number): void;
  /**
   * パラメータの値の設定
   * @param parameterId パラメータのID
   * @param value パラメータの値
   * @param weight 重み
   */
  setParameterValueById(parameterId: CubismIdHandle, value: number, weight?: number): void;
  /**
   * パラメータの値の加算(index)
   * @param parameterIndex パラメータインデックス
   * @param value 加算する値
   * @param weight 重み
   */
  addParameterValueByIndex(parameterIndex: number, value: number, weight?: number): void;
  /**
   * パラメータの値の加算(id)
   * @param parameterId パラメータＩＤ
   * @param value 加算する値
   * @param weight 重み
   */
  addParameterValueById(parameterId: any, value: number, weight?: number): void;
  /**
   * パラメータの値の乗算
   * @param parameterId パラメータのID
   * @param value 乗算する値
   * @param weight 重み
   */
  multiplyParameterValueById(parameterId: CubismIdHandle, value: number, weight?: number): void;
  /**
   * パラメータの値の乗算
   * @param parameterIndex パラメータのインデックス
   * @param value 乗算する値
   * @param weight 重み
   */
  multiplyParameterValueByIndex(parameterIndex: number, value: number, weight?: number): void;
  /**
   * Drawableのインデックスの取得
   * @param drawableId DrawableのID
   * @return Drawableのインデックス
   */
  getDrawableIndex(drawableId: CubismIdHandle): number;
  /**
   * Drawableの個数の取得
   * @return drawableの個数
   */
  getDrawableCount(): number;
  /**
   * DrawableのIDを取得する
   * @param drawableIndex Drawableのインデックス
   * @return drawableのID
   */
  getDrawableId(drawableIndex: number): CubismIdHandle;
  /**
   * Drawableの描画順リストの取得
   * @return Drawableの描画順リスト
   */
  getDrawableRenderOrders(): Int32Array;
  /**
   * @deprecated
   * 関数名が誤っていたため、代替となる getDrawableTextureIndex を追加し、この関数は非推奨となりました。
   *
   * Drawableのテクスチャインデックスリストの取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableのテクスチャインデックスリスト
   */
  getDrawableTextureIndices(drawableIndex: number): number;
  /**
   * Drawableのテクスチャインデックスの取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableのテクスチャインデックス
   */
  getDrawableTextureIndex(drawableIndex: number): number;
  /**
   * DrawableのVertexPositionsの変化情報の取得
   *
   * 直近のCubismModel.update関数でDrawableの頂点情報が変化したかを取得する。
   *
   * @param   drawableIndex   Drawableのインデックス
   * @retval  true    Drawableの頂点情報が直近のCubismModel.update関数で変化した
   * @retval  false   Drawableの頂点情報が直近のCubismModel.update関数で変化していない
   */
  getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex: number): boolean;
  /**
   * Drawableの頂点インデックスの個数の取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの頂点インデックスの個数
   */
  getDrawableVertexIndexCount(drawableIndex: number): number;
  /**
   * Drawableの頂点の個数の取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの頂点の個数
   */
  getDrawableVertexCount(drawableIndex: number): number;
  /**
   * Drawableの頂点リストの取得
   * @param drawableIndex drawableのインデックス
   * @return drawableの頂点リスト
   */
  getDrawableVertices(drawableIndex: number): Float32Array;
  /**
   * Drawableの頂点インデックスリストの取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの頂点インデックスリスト
   */
  getDrawableVertexIndices(drawableIndex: number): Uint16Array;
  /**
   * Drawableの頂点リストの取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの頂点リスト
   */
  getDrawableVertexPositions(drawableIndex: number): Float32Array;
  /**
   * Drawableの頂点のUVリストの取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの頂点UVリスト
   */
  getDrawableVertexUvs(drawableIndex: number): Float32Array;
  /**
   * Drawableの不透明度の取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの不透明度
   */
  getDrawableOpacity(drawableIndex: number): number;
  /**
   * Drawableの乗算色の取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの乗算色(RGBA)
   * スクリーン色はRGBAで取得されるが、Aは必ず0
   */
  getDrawableMultiplyColor(drawableIndex: number): CubismTextureColor;
  /**
   * Drawableのスクリーン色の取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableのスクリーン色(RGBA)
   * スクリーン色はRGBAで取得されるが、Aは必ず0
   */
  getDrawableScreenColor(drawableIndex: number): CubismTextureColor;
  /**
   * Drawableの親パーツのインデックスの取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableの親パーツのインデックス
   */
  getDrawableParentPartIndex(drawableIndex: number): number;
  /**
   * Drawableのブレンドモードを取得
   * @param drawableIndex Drawableのインデックス
   * @return drawableのブレンドモード
   */
  getDrawableBlendMode(drawableIndex: number): CubismBlendMode;
  /**
   * Drawableのマスクの反転使用の取得
   *
   * Drawableのマスク使用時の反転設定を取得する。
   * マスクを使用しない場合は無視される。
   *
   * @param drawableIndex Drawableのインデックス
   * @return Drawableの反転設定
   */
  getDrawableInvertedMaskBit(drawableIndex: number): boolean;
  /**
   * Drawableのクリッピングマスクリストの取得
   * @return Drawableのクリッピングマスクリスト
   */
  getDrawableMasks(): Int32Array[];
  /**
   * Drawableのクリッピングマスクの個数リストの取得
   * @return Drawableのクリッピングマスクの個数リスト
   */
  getDrawableMaskCounts(): Int32Array;
  /**
   * クリッピングマスクの使用状態
   *
   * @return true クリッピングマスクを使用している
   * @return false クリッピングマスクを使用していない
   */
  isUsingMasking(): boolean;
  /**
   * Drawableの表示情報を取得する
   *
   * @param drawableIndex Drawableのインデックス
   * @return true Drawableが表示
   * @return false Drawableが非表示
   */
  getDrawableDynamicFlagIsVisible(drawableIndex: number): boolean;
  /**
   * DrawableのDrawOrderの変化情報の取得
   *
   * 直近のCubismModel.update関数でdrawableのdrawOrderが変化したかを取得する。
   * drawOrderはartMesh上で指定する0から1000の情報
   * @param drawableIndex drawableのインデックス
   * @return true drawableの不透明度が直近のCubismModel.update関数で変化した
   * @return false drawableの不透明度が直近のCubismModel.update関数で変化している
   */
  getDrawableDynamicFlagVisibilityDidChange(drawableIndex: number): boolean;
  /**
   * Drawableの不透明度の変化情報の取得
   *
   * 直近のCubismModel.update関数でdrawableの不透明度が変化したかを取得する。
   *
   * @param drawableIndex drawableのインデックス
   * @return true Drawableの不透明度が直近のCubismModel.update関数で変化した
   * @return false Drawableの不透明度が直近のCubismModel.update関数で変化してない
   */
  getDrawableDynamicFlagOpacityDidChange(drawableIndex: number): boolean;
  /**
   * Drawableの描画順序の変化情報の取得
   *
   * 直近のCubismModel.update関数でDrawableの描画の順序が変化したかを取得する。
   *
   * @param drawableIndex Drawableのインデックス
   * @return true Drawableの描画の順序が直近のCubismModel.update関数で変化した
   * @return false Drawableの描画の順序が直近のCubismModel.update関数で変化してない
   */
  getDrawableDynamicFlagRenderOrderDidChange(drawableIndex: number): boolean;
  /**
   * Drawableの乗算色・スクリーン色の変化情報の取得
   *
   * 直近のCubismModel.update関数でDrawableの乗算色・スクリーン色が変化したかを取得する。
   *
   * @param drawableIndex Drawableのインデックス
   * @return true Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化した
   * @return false Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化してない
   */
  getDrawableDynamicFlagBlendColorDidChange(drawableIndex: number): boolean;
  /**
   * 保存されたパラメータの読み込み
   */
  loadParameters(): void;
  /**
   * 初期化する
   */
  initialize(): void;
  /**
   * コンストラクタ
   * @param model モデル
   */
  constructor(model: Live2DCubismCore.Model);
  /**
   * デストラクタ相当の処理
   */
  release(): void;
  private _notExistPartOpacities;
  private _notExistPartId;
  private _notExistParameterValues;
  private _notExistParameterId;
  private _savedParameters;
  private _isOverwrittenModelMultiplyColors;
  private _isOverwrittenModelScreenColors;
  private _userMultiplyColors;
  private _userScreenColors;
  private _userPartScreenColors;
  private _userPartMultiplyColors;
  private _partChildDrawables;
  private _model;
  private _parameterValues;
  private _parameterMaximumValues;
  private _parameterMinimumValues;
  private _partOpacities;
  private _modelOpacity;
  public _parameterIds;
  private _partIds;
  private _drawableIds;
  private _isOverwrittenCullings;
  private _userCullings;
}
import * as $ from './cubismmodel';
export declare namespace Live2DCubismFramework {
  const CubismModel: typeof $.CubismModel;
  type CubismModel = $.CubismModel;
}
//# sourceMappingURL=cubismmodel.d.ts.map