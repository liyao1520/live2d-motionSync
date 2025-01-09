import { CubismIdHandle } from '../id/cubismid';
import { CubismModel } from '../model/cubismmodel';
import { ACubismMotion } from './acubismmotion';
import { CubismMotionQueueEntryHandle, CubismMotionQueueManager } from './cubismmotionqueuemanager';
/**
 * @brief パラメータに適用する表情の値を持たせる構造体
 */
export declare class ExpressionParameterValue {
    parameterId: CubismIdHandle;
    additiveValue: number;
    multiplyValue: number;
    overwriteValue: number;
}
/**
 * @brief 表情モーションの管理
 *
 * 表情モーションの管理をおこなうクラス。
 */
export declare class CubismExpressionMotionManager extends CubismMotionQueueManager {
    /**
     * コンストラクタ
     */
    constructor();
    /**
     * デストラクタ相当の処理
     */
    release(): void;
    /**
     * @brief 再生中のモーションの優先度の取得
     *
     * 再生中のモーションの優先度を取得する。
     *
     * @returns モーションの優先度
     */
    getCurrentPriority(): number;
    /**
     * @brief 予約中のモーションの優先度の取得
     *
     * 予約中のモーションの優先度を取得する。
     *
     * @return  モーションの優先度
     */
    getReservePriority(): number;
    /**
     * @brief 再生中のモーションのウェイトを取得する。
     *
     * @param[in]    index    表情のインデックス
     * @returns               表情モーションのウェイト
     */
    getFadeWeight(index: number): number;
    /**
     * @brief 予約中のモーションの優先度の設定
     *
     * 予約中のモーションの優先度を設定する。
     *
     * @param[in]   priority     優先度
     */
    setReservePriority(priority: number): void;
    /**
     * @brief 優先度を設定してモーションの開始
     *
     * 優先度を設定してモーションを開始する。
     *
     * @param[in]   motion          モーション
     * @param[in]   autoDelete      再生が終了したモーションのインスタンスを削除するならtrue
     * @param[in]   priority        優先度
     * @return                      開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するIsFinished()の引数で使用する。開始できない時は「-1」
     */
    startMotionPriority(motion: ACubismMotion, autoDelete: boolean, priority: number): CubismMotionQueueEntryHandle;
    /**
     * @brief モーションの更新
     *
     * モーションを更新して、モデルにパラメータ値を反映する。
     *
     * @param[in]   model   対象のモデル
     * @param[in]   deltaTimeSeconds    デルタ時間[秒]
     * @retval  true    更新されている
     * @retval  false   更新されていない
     */
    updateMotion(model: CubismModel, deltaTimeSeconds: number): boolean;
    private _expressionParameterValues;
    private _fadeWeights;
    private _currentPriority;
    private _reservePriority;
    private _startExpressionTime;
}
import * as $ from './cubismexpressionmotionmanager';
export declare namespace Live2DCubismFramework {
    const CubismExpressionMotionManager: typeof $.CubismExpressionMotionManager;
    type CubismExpressionMotionManager = $.CubismExpressionMotionManager;
}
//# sourceMappingURL=cubismexpressionmotionmanager.d.ts.map