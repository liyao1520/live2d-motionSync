/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismIdHandle } from '../id/cubismid';
import { CubismModel } from '../model/cubismmodel';
import { csmVector } from '../type/csmvector';
import { ACubismMotion } from './acubismmotion';
import { CubismMotionQueueEntry } from './cubismmotionqueueentry';
/**
 * 表情のモーション
 *
 * 表情のモーションクラス。
 */
export declare class CubismExpressionMotion extends ACubismMotion {
    static readonly DefaultAdditiveValue = 0;
    static readonly DefaultMultiplyValue = 1;
    /**
     * インスタンスを作成する。
     * @param buffer expファイルが読み込まれているバッファ
     * @param size バッファのサイズ
     * @return 作成されたインスタンス
     */
    static create(buffer: ArrayBuffer, size: number): CubismExpressionMotion;
    /**
     * モデルのパラメータの更新の実行
     * @param model 対象のモデル
     * @param userTimeSeconds デルタ時間の積算値[秒]
     * @param weight モーションの重み
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     */
    doUpdateParameters(model: CubismModel, userTimeSeconds: number, weight: number, motionQueueEntry: CubismMotionQueueEntry): void;
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
    calculateExpressionParameters(model: CubismModel, userTimeSeconds: number, motionQueueEntry: CubismMotionQueueEntry, expressionParameterValues: csmVector<ExpressionParameterValue>, expressionIndex: number, fadeWeight: number): void;
    /**
     * @brief 表情が参照しているパラメータを取得
     *
     * 表情が参照しているパラメータを取得する
     *
     * @return 表情パラメータ
     */
    getExpressionParameters(): csmVector<ExpressionParameter>;
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
    getFadeWeight(): number;
    protected parse(buffer: ArrayBuffer, size: number): void;
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
    calculateValue(source: number, destination: number, fadeWeight: number): number;
    /**
     * コンストラクタ
     */
    protected constructor();
    private _parameters;
    /**
     * 表情の現在のウェイト
     *
     * @deprecated 不具合を引き起こす要因となるため非推奨。
     */
    private _fadeWeight;
}
/**
 * 表情パラメータ値の計算方式
 */
export declare enum ExpressionBlendType {
    Additive = 0,// 加算
    Multiply = 1,// 乗算
    Overwrite = 2
}
/**
 * 表情のパラメータ情報
 */
export declare class ExpressionParameter {
    parameterId: CubismIdHandle;
    blendType: ExpressionBlendType;
    value: number;
}
import * as $ from './cubismexpressionmotion';
import { ExpressionParameterValue } from './cubismexpressionmotionmanager';
export declare namespace Live2DCubismFramework {
    const CubismExpressionMotion: typeof $.CubismExpressionMotion;
    type CubismExpressionMotion = $.CubismExpressionMotion;
    const ExpressionBlendType: typeof $.ExpressionBlendType;
    type ExpressionBlendType = $.ExpressionBlendType;
    const ExpressionParameter: typeof $.ExpressionParameter;
    type ExpressionParameter = $.ExpressionParameter;
}
//# sourceMappingURL=cubismexpressionmotion.d.ts.map