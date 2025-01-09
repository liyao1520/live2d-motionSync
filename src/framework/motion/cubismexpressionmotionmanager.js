import { csmDelete } from '../live2dcubismframework';
import { csmVector } from '../type/csmvector';
import { CubismExpressionMotion } from './cubismexpressionmotion';
import { CubismMotionQueueManager } from './cubismmotionqueuemanager';
/**
 * @brief パラメータに適用する表情の値を持たせる構造体
 */
export class ExpressionParameterValue {
}
/**
 * @brief 表情モーションの管理
 *
 * 表情モーションの管理をおこなうクラス。
 */
export class CubismExpressionMotionManager extends CubismMotionQueueManager {
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._currentPriority = 0;
        this._reservePriority = 0;
        this._expressionParameterValues = new csmVector();
        this._fadeWeights = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        if (this._expressionParameterValues) {
            csmDelete(this._expressionParameterValues);
            this._expressionParameterValues = null;
        }
        if (this._fadeWeights) {
            csmDelete(this._fadeWeights);
            this._fadeWeights = null;
        }
    }
    /**
     * @brief 再生中のモーションの優先度の取得
     *
     * 再生中のモーションの優先度を取得する。
     *
     * @returns モーションの優先度
     */
    getCurrentPriority() {
        return this._currentPriority;
    }
    /**
     * @brief 予約中のモーションの優先度の取得
     *
     * 予約中のモーションの優先度を取得する。
     *
     * @return  モーションの優先度
     */
    getReservePriority() {
        return this._reservePriority;
    }
    /**
     * @brief 再生中のモーションのウェイトを取得する。
     *
     * @param[in]    index    表情のインデックス
     * @returns               表情モーションのウェイト
     */
    getFadeWeight(index) {
        return this._fadeWeights.at(index);
    }
    /**
     * @brief 予約中のモーションの優先度の設定
     *
     * 予約中のモーションの優先度を設定する。
     *
     * @param[in]   priority     優先度
     */
    setReservePriority(priority) {
        this._reservePriority = priority;
    }
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
    startMotionPriority(motion, autoDelete, priority) {
        if (priority == this.getReservePriority()) {
            this.setReservePriority(0);
        }
        this._currentPriority = priority;
        this._fadeWeights.pushBack(0.0);
        return this.startMotion(motion, autoDelete);
    }
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
    updateMotion(model, deltaTimeSeconds) {
        this._userTimeSeconds += deltaTimeSeconds;
        let updated = false;
        const motions = this.getCubismMotionQueueEntries();
        let expressionWeight = 0.0;
        let expressionIndex = 0;
        // ------- 処理を行う --------
        // 既にモーションがあれば終了フラグを立てる
        for (let ite = this._motions.begin(); ite.notEqual(this._motions.end());) {
            const motionQueueEntry = ite.ptr();
            if (motionQueueEntry == null) {
                ite = motions.erase(ite); //削除
                continue;
            }
            const expressionMotion = (motionQueueEntry.getCubismMotion());
            if (expressionMotion == null) {
                csmDelete(motionQueueEntry);
                ite = motions.erase(ite); //削除
                continue;
            }
            const expressionParameters = expressionMotion.getExpressionParameters();
            if (motionQueueEntry.isAvailable()) {
                // 再生中のExpressionが参照しているパラメータをすべてリストアップ
                for (let i = 0; i < expressionParameters.getSize(); ++i) {
                    if (expressionParameters.at(i).parameterId == null) {
                        continue;
                    }
                    let index = -1;
                    // リストにパラメータIDが存在するか検索
                    for (let j = 0; j < this._expressionParameterValues.getSize(); ++j) {
                        if (this._expressionParameterValues.at(j).parameterId !=
                            expressionParameters.at(i).parameterId) {
                            continue;
                        }
                        index = j;
                        break;
                    }
                    if (index >= 0) {
                        continue;
                    }
                    // パラメータがリストに存在しないなら新規追加
                    const item = new ExpressionParameterValue();
                    item.parameterId = expressionParameters.at(i).parameterId;
                    item.additiveValue = CubismExpressionMotion.DefaultAdditiveValue;
                    item.multiplyValue = CubismExpressionMotion.DefaultMultiplyValue;
                    item.overwriteValue = model.getParameterValueById(item.parameterId);
                    this._expressionParameterValues.pushBack(item);
                }
            }
            // ------ 値を計算する ------
            expressionMotion.setupMotionQueueEntry(motionQueueEntry, this._userTimeSeconds);
            this._fadeWeights.set(expressionIndex, expressionMotion.updateFadeWeight(motionQueueEntry, this._userTimeSeconds));
            expressionMotion.calculateExpressionParameters(model, this._userTimeSeconds, motionQueueEntry, this._expressionParameterValues, expressionIndex, this._fadeWeights.at(expressionIndex));
            expressionWeight +=
                expressionMotion.getFadeInTime() == 0.0
                    ? 1.0
                    : CubismMath.getEasingSine((this._userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                        expressionMotion.getFadeInTime());
            updated = true;
            if (motionQueueEntry.isTriggeredFadeOut()) {
                // フェードアウト開始
                motionQueueEntry.startFadeOut(motionQueueEntry.getFadeOutSeconds(), this._userTimeSeconds);
            }
            ite.preIncrement();
            ++expressionIndex;
        }
        // ----- 最新のExpressionのフェードが完了していればそれ以前を削除する ------
        if (motions.getSize() > 1) {
            const expressionMotion = (motions.at(motions.getSize() - 1).getCubismMotion());
            const latestFadeWeight = this._fadeWeights.at(this._fadeWeights.getSize() - 1);
            if (latestFadeWeight >= 1.0) {
                // 配列の最後の要素は削除しない
                for (let i = motions.getSize() - 2; i >= 0; --i) {
                    const motionQueueEntry = motions.at(i);
                    csmDelete(motionQueueEntry);
                    motions.remove(i);
                    this._fadeWeights.remove(i);
                }
            }
        }
        if (expressionWeight > 1.0) {
            expressionWeight = 1.0;
        }
        // モデルに各値を適用
        for (let i = 0; i < this._expressionParameterValues.getSize(); ++i) {
            const expressionParameterValue = this._expressionParameterValues.at(i);
            model.setParameterValueById(expressionParameterValue.parameterId, (expressionParameterValue.overwriteValue +
                expressionParameterValue.additiveValue) *
                expressionParameterValue.multiplyValue, expressionWeight);
            expressionParameterValue.additiveValue =
                CubismExpressionMotion.DefaultAdditiveValue;
            expressionParameterValue.multiplyValue =
                CubismExpressionMotion.DefaultMultiplyValue;
        }
        return updated;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismexpressionmotionmanager';
import { CubismMath } from '../math/cubismmath';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismExpressionMotionManager = $.CubismExpressionMotionManager;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismexpressionmotionmanager.js.map