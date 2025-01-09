/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismFramework } from '../live2dcubismframework';
import { csmVector } from '../type/csmvector';
import { CubismJson } from '../utils/cubismjson';
import { ACubismMotion } from './acubismmotion';
// exp3.jsonのキーとデフォルト
const ExpressionKeyFadeIn = 'FadeInTime';
const ExpressionKeyFadeOut = 'FadeOutTime';
const ExpressionKeyParameters = 'Parameters';
const ExpressionKeyId = 'Id';
const ExpressionKeyValue = 'Value';
const ExpressionKeyBlend = 'Blend';
const BlendValueAdd = 'Add';
const BlendValueMultiply = 'Multiply';
const BlendValueOverwrite = 'Overwrite';
const DefaultFadeTime = 1.0;
/**
 * 表情のモーション
 *
 * 表情のモーションクラス。
 */
export class CubismExpressionMotion extends ACubismMotion {
    /**
     * インスタンスを作成する。
     * @param buffer expファイルが読み込まれているバッファ
     * @param size バッファのサイズ
     * @return 作成されたインスタンス
     */
    static create(buffer, size) {
        const expression = new CubismExpressionMotion();
        expression.parse(buffer, size);
        return expression;
    }
    /**
     * モデルのパラメータの更新の実行
     * @param model 対象のモデル
     * @param userTimeSeconds デルタ時間の積算値[秒]
     * @param weight モーションの重み
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     */
    doUpdateParameters(model, userTimeSeconds, weight, motionQueueEntry) {
        for (let i = 0; i < this._parameters.getSize(); ++i) {
            const parameter = this._parameters.at(i);
            switch (parameter.blendType) {
                case ExpressionBlendType.Additive: {
                    model.addParameterValueById(parameter.parameterId, parameter.value, weight);
                    break;
                }
                case ExpressionBlendType.Multiply: {
                    model.multiplyParameterValueById(parameter.parameterId, parameter.value, weight);
                    break;
                }
                case ExpressionBlendType.Overwrite: {
                    model.setParameterValueById(parameter.parameterId, parameter.value, weight);
                    break;
                }
                default:
                    // 仕様にない値を設定した時はすでに加算モードになっている
                    break;
            }
        }
    }
    /**
     * @brief 表情によるモデルのパラメータの計算
     *
     * モデルの表情に関するパラメータを計算する。
     *
     * @param[in]   model                        対象のモデル
     * @param[in]   userTimeSeconds              デルタ時間の積算値[秒]
     * @param[in]   motionQueueEntry             CubismMotionQueueManagerで管理されているモーション
     * @param[in]   expressionParameterValues    モデルに適用する各パラメータの値
     * @param[in]   expressionIndex              表情のインデックス
     * @param[in]   fadeWeight                   表情のウェイト
     */
    calculateExpressionParameters(model, userTimeSeconds, motionQueueEntry, expressionParameterValues, expressionIndex, fadeWeight) {
        if (motionQueueEntry == null || expressionParameterValues == null) {
            return;
        }
        if (!motionQueueEntry.isAvailable()) {
            return;
        }
        // CubismExpressionMotion._fadeWeight は廃止予定です。
        // 互換性のために処理は残りますが、実際には使用しておりません。
        this._fadeWeight = this.updateFadeWeight(motionQueueEntry, userTimeSeconds);
        // モデルに適用する値を計算
        for (let i = 0; i < expressionParameterValues.getSize(); ++i) {
            const expressionParameterValue = expressionParameterValues.at(i);
            if (expressionParameterValue.parameterId == null) {
                continue;
            }
            const currentParameterValue = (expressionParameterValue.overwriteValue =
                model.getParameterValueById(expressionParameterValue.parameterId));
            const expressionParameters = this.getExpressionParameters();
            let parameterIndex = -1;
            for (let j = 0; j < expressionParameters.getSize(); ++j) {
                if (expressionParameterValue.parameterId !=
                    expressionParameters.at(j).parameterId) {
                    continue;
                }
                parameterIndex = j;
                break;
            }
            // 再生中のExpressionが参照していないパラメータは初期値を適用
            if (parameterIndex < 0) {
                if (expressionIndex == 0) {
                    expressionParameterValue.additiveValue =
                        CubismExpressionMotion.DefaultAdditiveValue;
                    expressionParameterValue.multiplyValue =
                        CubismExpressionMotion.DefaultMultiplyValue;
                    expressionParameterValue.overwriteValue = currentParameterValue;
                }
                else {
                    expressionParameterValue.additiveValue = this.calculateValue(expressionParameterValue.additiveValue, CubismExpressionMotion.DefaultAdditiveValue, fadeWeight);
                    expressionParameterValue.multiplyValue = this.calculateValue(expressionParameterValue.multiplyValue, CubismExpressionMotion.DefaultMultiplyValue, fadeWeight);
                    expressionParameterValue.overwriteValue = this.calculateValue(expressionParameterValue.overwriteValue, currentParameterValue, fadeWeight);
                }
                continue;
            }
            // 値を計算
            const value = expressionParameters.at(parameterIndex).value;
            let newAdditiveValue, newMultiplyValue, newOverwriteValue;
            switch (expressionParameters.at(parameterIndex).blendType) {
                case ExpressionBlendType.Additive:
                    newAdditiveValue = value;
                    newMultiplyValue = CubismExpressionMotion.DefaultMultiplyValue;
                    newOverwriteValue = currentParameterValue;
                    break;
                case ExpressionBlendType.Multiply:
                    newAdditiveValue = CubismExpressionMotion.DefaultAdditiveValue;
                    newMultiplyValue = value;
                    newOverwriteValue = currentParameterValue;
                    break;
                case ExpressionBlendType.Overwrite:
                    newAdditiveValue = CubismExpressionMotion.DefaultAdditiveValue;
                    newMultiplyValue = CubismExpressionMotion.DefaultMultiplyValue;
                    newOverwriteValue = value;
                    break;
                default:
                    return;
            }
            if (expressionIndex == 0) {
                expressionParameterValue.additiveValue = newAdditiveValue;
                expressionParameterValue.multiplyValue = newMultiplyValue;
                expressionParameterValue.overwriteValue = newOverwriteValue;
            }
            else {
                expressionParameterValue.additiveValue =
                    expressionParameterValue.additiveValue * (1.0 - fadeWeight) +
                        newAdditiveValue * fadeWeight;
                expressionParameterValue.multiplyValue =
                    expressionParameterValue.multiplyValue * (1.0 - fadeWeight) +
                        newMultiplyValue * fadeWeight;
                expressionParameterValue.overwriteValue =
                    expressionParameterValue.overwriteValue * (1.0 - fadeWeight) +
                        newOverwriteValue * fadeWeight;
            }
        }
    }
    /**
     * @brief 表情が参照しているパラメータを取得
     *
     * 表情が参照しているパラメータを取得する
     *
     * @return 表情パラメータ
     */
    getExpressionParameters() {
        return this._parameters;
    }
    /**
     * @brief 表情のフェードの値を取得
     *
     * 現在の表情のフェードのウェイト値を取得する
     *
     * @returns 表情のフェードのウェイト値
     *
     * @deprecated CubismExpressionMotion.fadeWeightが削除予定のため非推奨。
     * CubismExpressionMotionManager.getFadeWeight(index: number): number を使用してください。
     * @see CubismExpressionMotionManager#getFadeWeight(index: number)
     */
    getFadeWeight() {
        return this._fadeWeight;
    }
    parse(buffer, size) {
        const json = CubismJson.create(buffer, size);
        if (!json) {
            return;
        }
        const root = json.getRoot();
        this.setFadeInTime(root.getValueByString(ExpressionKeyFadeIn).toFloat(DefaultFadeTime)); // フェードイン
        this.setFadeOutTime(root.getValueByString(ExpressionKeyFadeOut).toFloat(DefaultFadeTime)); // フェードアウト
        // 各パラメータについて
        const parameterCount = root
            .getValueByString(ExpressionKeyParameters)
            .getSize();
        this._parameters.prepareCapacity(parameterCount);
        for (let i = 0; i < parameterCount; ++i) {
            const param = root
                .getValueByString(ExpressionKeyParameters)
                .getValueByIndex(i);
            const parameterId = CubismFramework.getIdManager().getId(param.getValueByString(ExpressionKeyId).getRawString()); // パラメータID
            const value = param
                .getValueByString(ExpressionKeyValue)
                .toFloat(); // 値
            // 計算方法の設定
            let blendType;
            if (param.getValueByString(ExpressionKeyBlend).isNull() ||
                param.getValueByString(ExpressionKeyBlend).getString() == BlendValueAdd) {
                blendType = ExpressionBlendType.Additive;
            }
            else if (param.getValueByString(ExpressionKeyBlend).getString() ==
                BlendValueMultiply) {
                blendType = ExpressionBlendType.Multiply;
            }
            else if (param.getValueByString(ExpressionKeyBlend).getString() ==
                BlendValueOverwrite) {
                blendType = ExpressionBlendType.Overwrite;
            }
            else {
                // その他 仕様にない値を設定した時は加算モードにすることで復旧
                blendType = ExpressionBlendType.Additive;
            }
            // 設定オブジェクトを作成してリストに追加する
            const item = new ExpressionParameter();
            item.parameterId = parameterId;
            item.blendType = blendType;
            item.value = value;
            this._parameters.pushBack(item);
        }
        CubismJson.delete(json); // JSONデータは不要になったら削除する
    }
    /**
     * @brief ブレンド計算
     *
     * 入力された値でブレンド計算をする。
     *
     * @param source 現在の値
     * @param destination 適用する値
     * @param weight ウェイト
     * @returns 計算結果
     */
    calculateValue(source, destination, fadeWeight) {
        return source * (1.0 - fadeWeight) + destination * fadeWeight;
    }
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._parameters = new csmVector();
        this._fadeWeight = 0.0;
    }
}
CubismExpressionMotion.DefaultAdditiveValue = 0.0; // 加算適用の初期値
CubismExpressionMotion.DefaultMultiplyValue = 1.0; // 乗算適用の初期値
/**
 * 表情パラメータ値の計算方式
 */
export var ExpressionBlendType;
(function (ExpressionBlendType) {
    ExpressionBlendType[ExpressionBlendType["Additive"] = 0] = "Additive";
    ExpressionBlendType[ExpressionBlendType["Multiply"] = 1] = "Multiply";
    ExpressionBlendType[ExpressionBlendType["Overwrite"] = 2] = "Overwrite"; // 上書き
})(ExpressionBlendType || (ExpressionBlendType = {}));
/**
 * 表情のパラメータ情報
 */
export class ExpressionParameter {
}
// Namespace definition for compatibility.
import * as $ from './cubismexpressionmotion';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismExpressionMotion = $.CubismExpressionMotion;
    Live2DCubismFramework.ExpressionBlendType = $.ExpressionBlendType;
    Live2DCubismFramework.ExpressionParameter = $.ExpressionParameter;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismexpressionmotion.js.map