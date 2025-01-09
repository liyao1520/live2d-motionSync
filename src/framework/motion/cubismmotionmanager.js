/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismMotionQueueManager } from './cubismmotionqueuemanager';
/**
 * モーションの管理
 *
 * モーションの管理を行うクラス
 */
export class CubismMotionManager extends CubismMotionQueueManager {
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._currentPriority = 0;
        this._reservePriority = 0;
    }
    /**
     * 再生中のモーションの優先度の取得
     * @return  モーションの優先度
     */
    getCurrentPriority() {
        return this._currentPriority;
    }
    /**
     * 予約中のモーションの優先度を取得する。
     * @return  モーションの優先度
     */
    getReservePriority() {
        return this._reservePriority;
    }
    /**
     * 予約中のモーションの優先度を設定する。
     * @param   val     優先度
     */
    setReservePriority(val) {
        this._reservePriority = val;
    }
    /**
     * 優先度を設定してモーションを開始する。
     *
     * @param motion          モーション
     * @param autoDelete      再生が狩猟したモーションのインスタンスを削除するならtrue
     * @param priority        優先度
     * @return                開始したモーションの識別番号を返す。個別のモーションが終了したか否かを判定するIsFinished()の引数で使用する。開始できない時は「-1」
     */
    startMotionPriority(motion, autoDelete, priority) {
        if (priority == this._reservePriority) {
            this._reservePriority = 0; // 予約を解除
        }
        this._currentPriority = priority; // 再生中モーションの優先度を設定
        return super.startMotion(motion, autoDelete);
    }
    /**
     * モーションを更新して、モデルにパラメータ値を反映する。
     *
     * @param model   対象のモデル
     * @param deltaTimeSeconds    デルタ時間[秒]
     * @return  true    更新されている
     * @return  false   更新されていない
     */
    updateMotion(model, deltaTimeSeconds) {
        this._userTimeSeconds += deltaTimeSeconds;
        const updated = super.doUpdateMotion(model, this._userTimeSeconds);
        if (this.isFinished()) {
            this._currentPriority = 0; // 再生中のモーションの優先度を解除
        }
        return updated;
    }
    /**
     * モーションを予約する。
     *
     * @param   priority    優先度
     * @return  true    予約できた
     * @return  false   予約できなかった
     */
    reserveMotion(priority) {
        if (priority <= this._reservePriority ||
            priority <= this._currentPriority) {
            return false;
        }
        this._reservePriority = priority;
        return true;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismmotionmanager';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionManager = $.CubismMotionManager;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmotionmanager.js.map