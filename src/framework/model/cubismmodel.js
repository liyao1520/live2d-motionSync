/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismFramework } from '../live2dcubismframework';
import { CubismBlendMode, CubismTextureColor } from '../rendering/cubismrenderer';
import { csmMap } from '../type/csmmap';
import { csmVector } from '../type/csmvector';
import { CSM_ASSERT } from '../utils/cubismdebug';
/**
 * SDK側から与えられたDrawableの乗算色・スクリーン色上書きフラグと
 * その色を保持する構造体
 */
export class DrawableColorData {
    constructor(isOverwritten = false, color = new CubismTextureColor()) {
        this.isOverwritten = isOverwritten;
        this.color = color;
    }
}
/**
 * @brief テクスチャの色をRGBAで扱うための構造体
 */
export class PartColorData {
    constructor(isOverwritten = false, color = new CubismTextureColor()) {
        this.isOverwritten = isOverwritten;
        this.color = color;
    }
}
/**
 * テクスチャのカリング設定を管理するための構造体
 */
export class DrawableCullingData {
    /**
     * コンストラクタ
     *
     * @param isOverwritten
     * @param isCulling
     */
    constructor(isOverwritten = false, isCulling = false) {
        this.isOverwritten = isOverwritten;
        this.isCulling = isCulling;
    }
}
/**
 * モデル
 *
 * Mocデータから生成されるモデルのクラス。
 */
export class CubismModel {
    /**
     * モデルのパラメータの更新
     */
    update() {
        // Update model
        this._model.update();
        this._model.drawables.resetDynamicFlags();
    }
    /**
     * PixelsPerUnitを取得する
     * @returns PixelsPerUnit
     */
    getPixelsPerUnit() {
        if (this._model == null) {
            return 0.0;
        }
        return this._model.canvasinfo.PixelsPerUnit;
    }
    /**
     * キャンバスの幅を取得する
     */
    getCanvasWidth() {
        if (this._model == null) {
            return 0.0;
        }
        return (this._model.canvasinfo.CanvasWidth / this._model.canvasinfo.PixelsPerUnit);
    }
    /**
     * キャンバスの高さを取得する
     */
    getCanvasHeight() {
        if (this._model == null) {
            return 0.0;
        }
        return (this._model.canvasinfo.CanvasHeight / this._model.canvasinfo.PixelsPerUnit);
    }
    /**
     * パラメータを保存する
     */
    saveParameters() {
        const parameterCount = this._model.parameters.count;
        const savedParameterCount = this._savedParameters.getSize();
        for (let i = 0; i < parameterCount; ++i) {
            if (i < savedParameterCount) {
                this._savedParameters.set(i, this._parameterValues[i]);
            }
            else {
                this._savedParameters.pushBack(this._parameterValues[i]);
            }
        }
    }
    /**
     * 乗算色を取得する
     * @param index Drawablesのインデックス
     * @returns 指定したdrawableの乗算色(RGBA)
     */
    getMultiplyColor(index) {
        // Drawableとモデル全体の乗算色上書きフラグがどちらもtrueな場合、モデル全体の上書きフラグが優先される
        if (this.getOverwriteFlagForModelMultiplyColors() ||
            this.getOverwriteFlagForDrawableMultiplyColors(index)) {
            return this._userMultiplyColors.at(index).color;
        }
        const color = this.getDrawableMultiplyColor(index);
        return color;
    }
    /**
     * スクリーン色を取得する
     * @param index Drawablesのインデックス
     * @returns 指定したdrawableのスクリーン色(RGBA)
     */
    getScreenColor(index) {
        // Drawableとモデル全体のスクリーン色上書きフラグがどちらもtrueな場合、モデル全体の上書きフラグが優先される
        if (this.getOverwriteFlagForModelScreenColors() ||
            this.getOverwriteFlagForDrawableScreenColors(index)) {
            return this._userScreenColors.at(index).color;
        }
        const color = this.getDrawableScreenColor(index);
        return color;
    }
    /**
     * 乗算色をセットする
     * @param index Drawablesのインデックス
     * @param color 設定する乗算色(CubismTextureColor)
     */
    setMultiplyColorByTextureColor(index, color) {
        this.setMultiplyColorByRGBA(index, color.r, color.g, color.b, color.a);
    }
    /**
     * 乗算色をセットする
     * @param index Drawablesのインデックス
     * @param r 設定する乗算色のR値
     * @param g 設定する乗算色のG値
     * @param b 設定する乗算色のB値
     * @param a 設定する乗算色のA値
     */
    setMultiplyColorByRGBA(index, r, g, b, a = 1.0) {
        this._userMultiplyColors.at(index).color.r = r;
        this._userMultiplyColors.at(index).color.g = g;
        this._userMultiplyColors.at(index).color.b = b;
        this._userMultiplyColors.at(index).color.a = a;
    }
    /**
     * スクリーン色をセットする
     * @param index Drawablesのインデックス
     * @param color 設定するスクリーン色(CubismTextureColor)
     */
    setScreenColorByTextureColor(index, color) {
        this.setScreenColorByRGBA(index, color.r, color.g, color.b, color.a);
    }
    /**
     * スクリーン色をセットする
     * @param index Drawablesのインデックス
     * @param r 設定するスクリーン色のR値
     * @param g 設定するスクリーン色のG値
     * @param b 設定するスクリーン色のB値
     * @param a 設定するスクリーン色のA値
     */
    setScreenColorByRGBA(index, r, g, b, a = 1.0) {
        this._userScreenColors.at(index).color.r = r;
        this._userScreenColors.at(index).color.g = g;
        this._userScreenColors.at(index).color.b = b;
        this._userScreenColors.at(index).color.a = a;
    }
    /**
     * partの乗算色を取得する
     * @param partIndex partのインデックス
     * @returns 指定したpartの乗算色
     */
    getPartMultiplyColor(partIndex) {
        return this._userPartMultiplyColors.at(partIndex).color;
    }
    /**
     * partのスクリーン色を取得する
     * @param partIndex partのインデックス
     * @returns 指定したpartのスクリーン色
     */
    getPartScreenColor(partIndex) {
        return this._userPartScreenColors.at(partIndex).color;
    }
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
    setPartColor(partIndex, r, g, b, a, partColors, drawableColors) {
        partColors.at(partIndex).color.r = r;
        partColors.at(partIndex).color.g = g;
        partColors.at(partIndex).color.b = b;
        partColors.at(partIndex).color.a = a;
        if (partColors.at(partIndex).isOverwritten) {
            for (let i = 0; i < this._partChildDrawables.at(partIndex).getSize(); ++i) {
                const drawableIndex = this._partChildDrawables.at(partIndex).at(i);
                drawableColors.at(drawableIndex).color.r = r;
                drawableColors.at(drawableIndex).color.g = g;
                drawableColors.at(drawableIndex).color.b = b;
                drawableColors.at(drawableIndex).color.a = a;
            }
        }
    }
    /**
     * 乗算色をセットする
     * @param partIndex partのインデックス
     * @param color 設定する乗算色(CubismTextureColor)
     */
    setPartMultiplyColorByTextureColor(partIndex, color) {
        this.setPartMultiplyColorByRGBA(partIndex, color.r, color.g, color.b, color.a);
    }
    /**
     * 乗算色をセットする
     * @param partIndex partのインデックス
     * @param r 設定する乗算色のR値
     * @param g 設定する乗算色のG値
     * @param b 設定する乗算色のB値
     * @param a 設定する乗算色のA値
     */
    setPartMultiplyColorByRGBA(partIndex, r, g, b, a) {
        this.setPartColor(partIndex, r, g, b, a, this._userPartMultiplyColors, this._userMultiplyColors);
    }
    /**
     * スクリーン色をセットする
     * @param partIndex partのインデックス
     * @param color 設定するスクリーン色(CubismTextureColor)
     */
    setPartScreenColorByTextureColor(partIndex, color) {
        this.setPartScreenColorByRGBA(partIndex, color.r, color.g, color.b, color.a);
    }
    /**
     * スクリーン色をセットする
     * @param partIndex partのインデックス
     * @param r 設定するスクリーン色のR値
     * @param g 設定するスクリーン色のG値
     * @param b 設定するスクリーン色のB値
     * @param a 設定するスクリーン色のA値
     */
    setPartScreenColorByRGBA(partIndex, r, g, b, a) {
        this.setPartColor(partIndex, r, g, b, a, this._userPartScreenColors, this._userScreenColors);
    }
    /**
     * SDKから指定したモデルの乗算色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForModelMultiplyColors() {
        return this._isOverwrittenModelMultiplyColors;
    }
    /**
     * SDKから指定したモデルのスクリーン色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForModelScreenColors() {
        return this._isOverwrittenModelScreenColors;
    }
    /**
     * SDKから指定したモデルの乗算色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForModelMultiplyColors(value) {
        this._isOverwrittenModelMultiplyColors = value;
    }
    /**
     * SDKから指定したモデルのスクリーン色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForModelScreenColors(value) {
        this._isOverwrittenModelScreenColors = value;
    }
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForDrawableMultiplyColors(drawableindex) {
        return this._userMultiplyColors.at(drawableindex).isOverwritten;
    }
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするか
     * @returns true -> SDKからの情報を優先する
     *          false -> モデルに設定されている色情報を使用
     */
    getOverwriteFlagForDrawableScreenColors(drawableindex) {
        return this._userScreenColors.at(drawableindex).isOverwritten;
    }
    /**
     * SDKから指定したDrawableIndexの乗算色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForDrawableMultiplyColors(drawableindex, value) {
        this._userMultiplyColors.at(drawableindex).isOverwritten = value;
    }
    /**
     * SDKから指定したDrawableIndexのスクリーン色を上書きするかセットする
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteFlagForDrawableScreenColors(drawableindex, value) {
        this._userScreenColors.at(drawableindex).isOverwritten = value;
    }
    /**
     * SDKからpartの乗算色を上書きするか
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    getOverwriteColorForPartMultiplyColors(partIndex) {
        return this._userPartMultiplyColors.at(partIndex).isOverwritten;
    }
    /**
     * SDKからpartのスクリーン色を上書きするか
     * @param partIndex partのインデックス
     * @returns true    ->  SDKからの情報を優先する
     *          false   ->  モデルに設定されている色情報を使用
     */
    getOverwriteColorForPartScreenColors(partIndex) {
        return this._userPartScreenColors.at(partIndex).isOverwritten;
    }
    /**
     * partのOverwriteFlag setter関数
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     * @param partColors 設定するpartのカラーデータ配列
     * @param drawableColors partに関連するDrawableのカラーデータ配列
     */
    setOverwriteColorForPartColors(partIndex, value, partColors, drawableColors) {
        partColors.at(partIndex).isOverwritten = value;
        for (let i = 0; i < this._partChildDrawables.at(partIndex).getSize(); ++i) {
            const drawableIndex = this._partChildDrawables.at(partIndex).at(i);
            drawableColors.at(drawableIndex).isOverwritten = value;
            if (value) {
                drawableColors.at(drawableIndex).color.r =
                    partColors.at(partIndex).color.r;
                drawableColors.at(drawableIndex).color.g =
                    partColors.at(partIndex).color.g;
                drawableColors.at(drawableIndex).color.b =
                    partColors.at(partIndex).color.b;
                drawableColors.at(drawableIndex).color.a =
                    partColors.at(partIndex).color.a;
            }
        }
    }
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteColorForPartMultiplyColors(partIndex, value) {
        this._userPartMultiplyColors.at(partIndex).isOverwritten = value;
        this.setOverwriteColorForPartColors(partIndex, value, this._userPartMultiplyColors, this._userMultiplyColors);
    }
    /**
     * SDKからpartのスクリーン色を上書きするかをセットする
     * @param partIndex partのインデックス
     * @param value true -> SDKからの情報を優先する
     *              false -> モデルに設定されている色情報を使用
     */
    setOverwriteColorForPartScreenColors(partIndex, value) {
        this._userPartScreenColors.at(partIndex).isOverwritten = value;
        this.setOverwriteColorForPartColors(partIndex, value, this._userPartScreenColors, this._userScreenColors);
    }
    /**
     * Drawableのカリング情報を取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @return  Drawableのカリング情報
     */
    getDrawableCulling(drawableIndex) {
        if (this.getOverwriteFlagForModelCullings() ||
            this.getOverwriteFlagForDrawableCullings(drawableIndex)) {
            return this._userCullings.at(drawableIndex).isCulling;
        }
        const constantFlags = this._model.drawables.constantFlags;
        return !Live2DCubismCore.Utils.hasIsDoubleSidedBit(constantFlags[drawableIndex]);
    }
    /**
     * Drawableのカリング情報を設定する。
     *
     * @param drawableIndex Drawableのインデックス
     * @param isCulling カリング情報
     */
    setDrawableCulling(drawableIndex, isCulling) {
        this._userCullings.at(drawableIndex).isCulling = isCulling;
    }
    /**
     * SDKからモデル全体のカリング設定を上書きするか。
     *
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    getOverwriteFlagForModelCullings() {
        return this._isOverwrittenCullings;
    }
    /**
     * SDKからモデル全体のカリング設定を上書きするかを設定する。
     *
     * @param isOverwrittenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    setOverwriteFlagForModelCullings(isOverwrittenCullings) {
        this._isOverwrittenCullings = isOverwrittenCullings;
    }
    /**
     *
     * @param drawableIndex Drawableのインデックス
     * @retval  true    ->  SDK上のカリング設定を使用
     * @retval  false   ->  モデルのカリング設定を使用
     */
    getOverwriteFlagForDrawableCullings(drawableIndex) {
        return this._userCullings.at(drawableIndex).isOverwritten;
    }
    /**
     *
     * @param drawableIndex Drawableのインデックス
     * @param isOverwrittenCullings SDK上のカリング設定を使うならtrue、モデルのカリング設定を使うならfalse
     */
    setOverwriteFlagForDrawableCullings(drawableIndex, isOverwrittenCullings) {
        this._userCullings.at(drawableIndex).isOverwritten = isOverwrittenCullings;
    }
    /**
     * モデルの不透明度を取得する
     *
     * @returns 不透明度の値
     */
    getModelOapcity() {
        return this._modelOpacity;
    }
    /**
     * モデルの不透明度を設定する
     *
     * @param value 不透明度の値
     */
    setModelOapcity(value) {
        this._modelOpacity = value;
    }
    /**
     * モデルを取得
     */
    getModel() {
        return this._model;
    }
    /**
     * パーツのインデックスを取得
     * @param partId パーツのID
     * @return パーツのインデックス
     */
    getPartIndex(partId) {
        let partIndex;
        const partCount = this._model.parts.count;
        for (partIndex = 0; partIndex < partCount; ++partIndex) {
            if (partId == this._partIds.at(partIndex)) {
                return partIndex;
            }
        }
        // モデルに存在していない場合、非存在パーツIDリスト内にあるかを検索し、そのインデックスを返す
        if (this._notExistPartId.isExist(partId)) {
            return this._notExistPartId.getValue(partId);
        }
        // 非存在パーツIDリストにない場合、新しく要素を追加する
        partIndex = partCount + this._notExistPartId.getSize();
        this._notExistPartId.setValue(partId, partIndex);
        this._notExistPartOpacities.appendKey(partIndex);
        return partIndex;
    }
    /**
     * パーツのIDを取得する。
     *
     * @param partIndex 取得するパーツのインデックス
     * @return パーツのID
     */
    getPartId(partIndex) {
        const partId = this._model.parts.ids[partIndex];
        return CubismFramework.getIdManager().getId(partId);
    }
    /**
     * パーツの個数の取得
     * @return パーツの個数
     */
    getPartCount() {
        const partCount = this._model.parts.count;
        return partCount;
    }
    /**
     * パーツの不透明度の設定(Index)
     * @param partIndex パーツのインデックス
     * @param opacity 不透明度
     */
    setPartOpacityByIndex(partIndex, opacity) {
        if (this._notExistPartOpacities.isExist(partIndex)) {
            this._notExistPartOpacities.setValue(partIndex, opacity);
            return;
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
        this._partOpacities[partIndex] = opacity;
    }
    /**
     * パーツの不透明度の設定(Id)
     * @param partId パーツのID
     * @param opacity パーツの不透明度
     */
    setPartOpacityById(partId, opacity) {
        // 高速化のためにPartIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        const index = this.getPartIndex(partId);
        if (index < 0) {
            return; // パーツがないのでスキップ
        }
        this.setPartOpacityByIndex(index, opacity);
    }
    /**
     * パーツの不透明度の取得(index)
     * @param partIndex パーツのインデックス
     * @return パーツの不透明度
     */
    getPartOpacityByIndex(partIndex) {
        if (this._notExistPartOpacities.isExist(partIndex)) {
            // モデルに存在しないパーツIDの場合、非存在パーツリストから不透明度を返す。
            return this._notExistPartOpacities.getValue(partIndex);
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= partIndex && partIndex < this.getPartCount());
        return this._partOpacities[partIndex];
    }
    /**
     * パーツの不透明度の取得(id)
     * @param partId パーツのＩｄ
     * @return パーツの不透明度
     */
    getPartOpacityById(partId) {
        // 高速化のためにPartIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        const index = this.getPartIndex(partId);
        if (index < 0) {
            return 0; // パーツが無いのでスキップ
        }
        return this.getPartOpacityByIndex(index);
    }
    /**
     * パラメータのインデックスの取得
     * @param パラメータID
     * @return パラメータのインデックス
     */
    getParameterIndex(parameterId) {
        let parameterIndex;
        const idCount = this._model.parameters.count;
        for (parameterIndex = 0; parameterIndex < idCount; ++parameterIndex) {
            if (parameterId != this._parameterIds.at(parameterIndex)) {
                continue;
            }
            return parameterIndex;
        }
        // モデルに存在していない場合、非存在パラメータIDリスト内を検索し、そのインデックスを返す
        if (this._notExistParameterId.isExist(parameterId)) {
            return this._notExistParameterId.getValue(parameterId);
        }
        // 非存在パラメータIDリストにない場合新しく要素を追加する
        parameterIndex =
            this._model.parameters.count + this._notExistParameterId.getSize();
        this._notExistParameterId.setValue(parameterId, parameterIndex);
        this._notExistParameterValues.appendKey(parameterIndex);
        return parameterIndex;
    }
    /**
     * パラメータの個数の取得
     * @return パラメータの個数
     */
    getParameterCount() {
        return this._model.parameters.count;
    }
    /**
     * パラメータの種類の取得
     * @param parameterIndex パラメータのインデックス
     * @return csmParameterType_Normal -> 通常のパラメータ
     *          csmParameterType_BlendShape -> ブレンドシェイプパラメータ
     */
    getParameterType(parameterIndex) {
        return this._model.parameters.types[parameterIndex];
    }
    /**
     * パラメータの最大値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最大値
     */
    getParameterMaximumValue(parameterIndex) {
        return this._model.parameters.maximumValues[parameterIndex];
    }
    /**
     * パラメータの最小値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータの最小値
     */
    getParameterMinimumValue(parameterIndex) {
        return this._model.parameters.minimumValues[parameterIndex];
    }
    /**
     * パラメータのデフォルト値の取得
     * @param parameterIndex パラメータのインデックス
     * @return パラメータのデフォルト値
     */
    getParameterDefaultValue(parameterIndex) {
        return this._model.parameters.defaultValues[parameterIndex];
    }
    /**
     * 指定したパラメータindexのIDを取得
     *
     * @param parameterIndex パラメータのインデックス
     * @returns パラメータID
     */
    getParameterId(parameterIndex) {
        return CubismFramework.getIdManager().getId(this._model.parameters.ids[parameterIndex]);
    }
    /**
     * パラメータの値の取得
     * @param parameterIndex    パラメータのインデックス
     * @return パラメータの値
     */
    getParameterValueByIndex(parameterIndex) {
        if (this._notExistParameterValues.isExist(parameterIndex)) {
            return this._notExistParameterValues.getValue(parameterIndex);
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= parameterIndex && parameterIndex < this.getParameterCount());
        return this._parameterValues[parameterIndex];
    }
    /**
     * パラメータの値の取得
     * @param parameterId    パラメータのID
     * @return パラメータの値
     */
    getParameterValueById(parameterId) {
        // 高速化のためにparameterIndexを取得できる機構になっているが、外部からの設定の時は呼び出し頻度が低いため不要
        const parameterIndex = this.getParameterIndex(parameterId);
        return this.getParameterValueByIndex(parameterIndex);
    }
    /**
     * パラメータの値の設定
     * @param parameterIndex パラメータのインデックス
     * @param value パラメータの値
     * @param weight 重み
     */
    setParameterValueByIndex(parameterIndex, value, weight = 1.0) {
        if (this._notExistParameterValues.isExist(parameterIndex)) {
            this._notExistParameterValues.setValue(parameterIndex, weight == 1
                ? value
                : this._notExistParameterValues.getValue(parameterIndex) *
                    (1 - weight) +
                    value * weight);
            return;
        }
        // インデックスの範囲内検知
        CSM_ASSERT(0 <= parameterIndex && parameterIndex < this.getParameterCount());
        if (this._model.parameters.maximumValues[parameterIndex] < value) {
            value = this._model.parameters.maximumValues[parameterIndex];
        }
        if (this._model.parameters.minimumValues[parameterIndex] > value) {
            value = this._model.parameters.minimumValues[parameterIndex];
        }
        this._parameterValues[parameterIndex] =
            weight == 1
                ? value
                : (this._parameterValues[parameterIndex] =
                    this._parameterValues[parameterIndex] * (1 - weight) +
                        value * weight);
    }
    /**
     * パラメータの値の設定
     * @param parameterId パラメータのID
     * @param value パラメータの値
     * @param weight 重み
     */
    setParameterValueById(parameterId, value, weight = 1.0) {
        const index = this.getParameterIndex(parameterId);
        this.setParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の加算(index)
     * @param parameterIndex パラメータインデックス
     * @param value 加算する値
     * @param weight 重み
     */
    addParameterValueByIndex(parameterIndex, value, weight = 1.0) {
        this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) + value * weight);
    }
    /**
     * パラメータの値の加算(id)
     * @param parameterId パラメータＩＤ
     * @param value 加算する値
     * @param weight 重み
     */
    addParameterValueById(parameterId, value, weight = 1.0) {
        const index = this.getParameterIndex(parameterId);
        this.addParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の乗算
     * @param parameterId パラメータのID
     * @param value 乗算する値
     * @param weight 重み
     */
    multiplyParameterValueById(parameterId, value, weight = 1.0) {
        const index = this.getParameterIndex(parameterId);
        this.multiplyParameterValueByIndex(index, value, weight);
    }
    /**
     * パラメータの値の乗算
     * @param parameterIndex パラメータのインデックス
     * @param value 乗算する値
     * @param weight 重み
     */
    multiplyParameterValueByIndex(parameterIndex, value, weight = 1.0) {
        this.setParameterValueByIndex(parameterIndex, this.getParameterValueByIndex(parameterIndex) *
            (1.0 + (value - 1.0) * weight));
    }
    /**
     * Drawableのインデックスの取得
     * @param drawableId DrawableのID
     * @return Drawableのインデックス
     */
    getDrawableIndex(drawableId) {
        const drawableCount = this._model.drawables.count;
        for (let drawableIndex = 0; drawableIndex < drawableCount; ++drawableIndex) {
            if (this._drawableIds.at(drawableIndex) == drawableId) {
                return drawableIndex;
            }
        }
        return -1;
    }
    /**
     * Drawableの個数の取得
     * @return drawableの個数
     */
    getDrawableCount() {
        const drawableCount = this._model.drawables.count;
        return drawableCount;
    }
    /**
     * DrawableのIDを取得する
     * @param drawableIndex Drawableのインデックス
     * @return drawableのID
     */
    getDrawableId(drawableIndex) {
        const parameterIds = this._model.drawables.ids;
        return CubismFramework.getIdManager().getId(parameterIds[drawableIndex]);
    }
    /**
     * Drawableの描画順リストの取得
     * @return Drawableの描画順リスト
     */
    getDrawableRenderOrders() {
        const renderOrders = this._model.drawables.renderOrders;
        return renderOrders;
    }
    /**
     * @deprecated
     * 関数名が誤っていたため、代替となる getDrawableTextureIndex を追加し、この関数は非推奨となりました。
     *
     * Drawableのテクスチャインデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックスリスト
     */
    getDrawableTextureIndices(drawableIndex) {
        return this.getDrawableTextureIndex(drawableIndex);
    }
    /**
     * Drawableのテクスチャインデックスの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのテクスチャインデックス
     */
    getDrawableTextureIndex(drawableIndex) {
        const textureIndices = this._model.drawables.textureIndices;
        return textureIndices[drawableIndex];
    }
    /**
     * DrawableのVertexPositionsの変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの頂点情報が変化したかを取得する。
     *
     * @param   drawableIndex   Drawableのインデックス
     * @retval  true    Drawableの頂点情報が直近のCubismModel.update関数で変化した
     * @retval  false   Drawableの頂点情報が直近のCubismModel.update関数で変化していない
     */
    getDrawableDynamicFlagVertexPositionsDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVertexPositionsDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの頂点インデックスの個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスの個数
     */
    getDrawableVertexIndexCount(drawableIndex) {
        const indexCounts = this._model.drawables.indexCounts;
        return indexCounts[drawableIndex];
    }
    /**
     * Drawableの頂点の個数の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点の個数
     */
    getDrawableVertexCount(drawableIndex) {
        const vertexCounts = this._model.drawables.vertexCounts;
        return vertexCounts[drawableIndex];
    }
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex drawableのインデックス
     * @return drawableの頂点リスト
     */
    getDrawableVertices(drawableIndex) {
        return this.getDrawableVertexPositions(drawableIndex);
    }
    /**
     * Drawableの頂点インデックスリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点インデックスリスト
     */
    getDrawableVertexIndices(drawableIndex) {
        const indicesArray = this._model.drawables.indices;
        return indicesArray[drawableIndex];
    }
    /**
     * Drawableの頂点リストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点リスト
     */
    getDrawableVertexPositions(drawableIndex) {
        const verticesArray = this._model.drawables.vertexPositions;
        return verticesArray[drawableIndex];
    }
    /**
     * Drawableの頂点のUVリストの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの頂点UVリスト
     */
    getDrawableVertexUvs(drawableIndex) {
        const uvsArray = this._model.drawables.vertexUvs;
        return uvsArray[drawableIndex];
    }
    /**
     * Drawableの不透明度の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの不透明度
     */
    getDrawableOpacity(drawableIndex) {
        const opacities = this._model.drawables.opacities;
        return opacities[drawableIndex];
    }
    /**
     * Drawableの乗算色の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの乗算色(RGBA)
     * スクリーン色はRGBAで取得されるが、Aは必ず0
     */
    getDrawableMultiplyColor(drawableIndex) {
        const multiplyColors = this._model.drawables.multiplyColors;
        const index = drawableIndex * 4;
        const multiplyColor = new CubismTextureColor();
        multiplyColor.r = multiplyColors[index];
        multiplyColor.g = multiplyColors[index + 1];
        multiplyColor.b = multiplyColors[index + 2];
        multiplyColor.a = multiplyColors[index + 3];
        return multiplyColor;
    }
    /**
     * Drawableのスクリーン色の取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのスクリーン色(RGBA)
     * スクリーン色はRGBAで取得されるが、Aは必ず0
     */
    getDrawableScreenColor(drawableIndex) {
        const screenColors = this._model.drawables.screenColors;
        const index = drawableIndex * 4;
        const screenColor = new CubismTextureColor();
        screenColor.r = screenColors[index];
        screenColor.g = screenColors[index + 1];
        screenColor.b = screenColors[index + 2];
        screenColor.a = screenColors[index + 3];
        return screenColor;
    }
    /**
     * Drawableの親パーツのインデックスの取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableの親パーツのインデックス
     */
    getDrawableParentPartIndex(drawableIndex) {
        return this._model.drawables.parentPartIndices[drawableIndex];
    }
    /**
     * Drawableのブレンドモードを取得
     * @param drawableIndex Drawableのインデックス
     * @return drawableのブレンドモード
     */
    getDrawableBlendMode(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasBlendAdditiveBit(constantFlags[drawableIndex])
            ? CubismBlendMode.CubismBlendMode_Additive
            : Live2DCubismCore.Utils.hasBlendMultiplicativeBit(constantFlags[drawableIndex])
                ? CubismBlendMode.CubismBlendMode_Multiplicative
                : CubismBlendMode.CubismBlendMode_Normal;
    }
    /**
     * Drawableのマスクの反転使用の取得
     *
     * Drawableのマスク使用時の反転設定を取得する。
     * マスクを使用しない場合は無視される。
     *
     * @param drawableIndex Drawableのインデックス
     * @return Drawableの反転設定
     */
    getDrawableInvertedMaskBit(drawableIndex) {
        const constantFlags = this._model.drawables.constantFlags;
        return Live2DCubismCore.Utils.hasIsInvertedMaskBit(constantFlags[drawableIndex]);
    }
    /**
     * Drawableのクリッピングマスクリストの取得
     * @return Drawableのクリッピングマスクリスト
     */
    getDrawableMasks() {
        const masks = this._model.drawables.masks;
        return masks;
    }
    /**
     * Drawableのクリッピングマスクの個数リストの取得
     * @return Drawableのクリッピングマスクの個数リスト
     */
    getDrawableMaskCounts() {
        const maskCounts = this._model.drawables.maskCounts;
        return maskCounts;
    }
    /**
     * クリッピングマスクの使用状態
     *
     * @return true クリッピングマスクを使用している
     * @return false クリッピングマスクを使用していない
     */
    isUsingMasking() {
        for (let d = 0; d < this._model.drawables.count; ++d) {
            if (this._model.drawables.maskCounts[d] <= 0) {
                continue;
            }
            return true;
        }
        return false;
    }
    /**
     * Drawableの表示情報を取得する
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableが表示
     * @return false Drawableが非表示
     */
    getDrawableDynamicFlagIsVisible(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasIsVisibleBit(dynamicFlags[drawableIndex]);
    }
    /**
     * DrawableのDrawOrderの変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableのdrawOrderが変化したかを取得する。
     * drawOrderはartMesh上で指定する0から1000の情報
     * @param drawableIndex drawableのインデックス
     * @return true drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false drawableの不透明度が直近のCubismModel.update関数で変化している
     */
    getDrawableDynamicFlagVisibilityDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasVisibilityDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの不透明度の変化情報の取得
     *
     * 直近のCubismModel.update関数でdrawableの不透明度が変化したかを取得する。
     *
     * @param drawableIndex drawableのインデックス
     * @return true Drawableの不透明度が直近のCubismModel.update関数で変化した
     * @return false Drawableの不透明度が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagOpacityDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasOpacityDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの描画順序の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの描画の順序が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの描画の順序が直近のCubismModel.update関数で変化した
     * @return false Drawableの描画の順序が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagRenderOrderDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasRenderOrderDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * Drawableの乗算色・スクリーン色の変化情報の取得
     *
     * 直近のCubismModel.update関数でDrawableの乗算色・スクリーン色が変化したかを取得する。
     *
     * @param drawableIndex Drawableのインデックス
     * @return true Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化した
     * @return false Drawableの乗算色・スクリーン色が直近のCubismModel.update関数で変化してない
     */
    getDrawableDynamicFlagBlendColorDidChange(drawableIndex) {
        const dynamicFlags = this._model.drawables.dynamicFlags;
        return Live2DCubismCore.Utils.hasBlendColorDidChangeBit(dynamicFlags[drawableIndex]);
    }
    /**
     * 保存されたパラメータの読み込み
     */
    loadParameters() {
        let parameterCount = this._model.parameters.count;
        const savedParameterCount = this._savedParameters.getSize();
        if (parameterCount > savedParameterCount) {
            parameterCount = savedParameterCount;
        }
        for (let i = 0; i < parameterCount; ++i) {
            this._parameterValues[i] = this._savedParameters.at(i);
        }
    }
    /**
     * 初期化する
     */
    initialize() {
        CSM_ASSERT(this._model);
        this._parameterValues = this._model.parameters.values;
        this._partOpacities = this._model.parts.opacities;
        this._parameterMaximumValues = this._model.parameters.maximumValues;
        this._parameterMinimumValues = this._model.parameters.minimumValues;
        {
            const parameterIds = this._model.parameters.ids;
            const parameterCount = this._model.parameters.count;
            this._parameterIds.prepareCapacity(parameterCount);
            for (let i = 0; i < parameterCount; ++i) {
                this._parameterIds.pushBack(CubismFramework.getIdManager().getId(parameterIds[i]));
            }
        }
        const partCount = this._model.parts.count;
        {
            const partIds = this._model.parts.ids;
            this._partIds.prepareCapacity(partCount);
            for (let i = 0; i < partCount; ++i) {
                this._partIds.pushBack(CubismFramework.getIdManager().getId(partIds[i]));
            }
            this._userPartMultiplyColors.prepareCapacity(partCount);
            this._userPartScreenColors.prepareCapacity(partCount);
            this._partChildDrawables.prepareCapacity(partCount);
        }
        {
            const drawableIds = this._model.drawables.ids;
            const drawableCount = this._model.drawables.count;
            this._userMultiplyColors.prepareCapacity(drawableCount);
            this._userScreenColors.prepareCapacity(drawableCount);
            // カリング設定
            this._userCullings.prepareCapacity(drawableCount);
            const userCulling = new DrawableCullingData(false, false);
            // Part
            {
                for (let i = 0; i < partCount; ++i) {
                    const multiplyColor = new CubismTextureColor(1.0, 1.0, 1.0, 1.0);
                    const screenColor = new CubismTextureColor(0.0, 0.0, 0.0, 1.0);
                    const userMultiplyColor = new PartColorData(false, multiplyColor);
                    const userScreenColor = new PartColorData(false, screenColor);
                    this._userPartMultiplyColors.pushBack(userMultiplyColor);
                    this._userPartScreenColors.pushBack(userScreenColor);
                    this._partChildDrawables.pushBack(new csmVector());
                    this._partChildDrawables.at(i).prepareCapacity(drawableCount);
                }
            }
            // Drawables
            {
                for (let i = 0; i < drawableCount; ++i) {
                    const multiplyColor = new CubismTextureColor(1.0, 1.0, 1.0, 1.0);
                    const screenColor = new CubismTextureColor(0.0, 0.0, 0.0, 1.0);
                    const userMultiplyColor = new DrawableColorData(false, multiplyColor);
                    const userScreenColor = new DrawableColorData(false, screenColor);
                    this._drawableIds.pushBack(CubismFramework.getIdManager().getId(drawableIds[i]));
                    this._userMultiplyColors.pushBack(userMultiplyColor);
                    this._userScreenColors.pushBack(userScreenColor);
                    this._userCullings.pushBack(userCulling);
                    const parentIndex = this.getDrawableParentPartIndex(i);
                    if (parentIndex >= 0) {
                        this._partChildDrawables.at(parentIndex).pushBack(i);
                    }
                }
            }
        }
    }
    /**
     * コンストラクタ
     * @param model モデル
     */
    constructor(model) {
        this._model = model;
        this._parameterValues = null;
        this._parameterMaximumValues = null;
        this._parameterMinimumValues = null;
        this._partOpacities = null;
        this._savedParameters = new csmVector();
        this._parameterIds = new csmVector();
        this._drawableIds = new csmVector();
        this._partIds = new csmVector();
        this._isOverwrittenModelMultiplyColors = false;
        this._isOverwrittenModelScreenColors = false;
        this._isOverwrittenCullings = false;
        this._modelOpacity = 1.0;
        this._userMultiplyColors = new csmVector();
        this._userScreenColors = new csmVector();
        this._userCullings = new csmVector();
        this._userPartMultiplyColors = new csmVector();
        this._userPartScreenColors = new csmVector();
        this._partChildDrawables = new csmVector();
        this._notExistPartId = new csmMap();
        this._notExistParameterId = new csmMap();
        this._notExistParameterValues = new csmMap();
        this._notExistPartOpacities = new csmMap();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        this._model.release();
        this._model = null;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismmodel';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModel = $.CubismModel;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodel.js.map