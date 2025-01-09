/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { ACubismMotion } from './acubismmotion';
/**
 * CubismMotionQueueManagerで再生している各モーションの管理クラス。
 */
export class CubismMotionQueueEntry {
    /**
     * コンストラクタ
     */
    constructor() {
        this._autoDelete = false;
        this._motion = null;
        this._available = true;
        this._finished = false;
        this._started = false;
        this._startTimeSeconds = -1.0;
        this._fadeInStartTimeSeconds = 0.0;
        this._endTimeSeconds = -1.0;
        this._stateTimeSeconds = 0.0;
        this._stateWeight = 0.0;
        this._lastEventCheckSeconds = 0.0;
        this._motionQueueEntryHandle = this;
        this._fadeOutSeconds = 0.0;
        this._isTriggeredFadeOut = false;
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        if (this._autoDelete && this._motion) {
            ACubismMotion.delete(this._motion); //
        }
    }
    /**
     * フェードアウト時間と開始判定の設定
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     */
    setFadeOut(fadeOutSeconds) {
        this._fadeOutSeconds = fadeOutSeconds;
        this._isTriggeredFadeOut = true;
    }
    /**
     * フェードアウトの開始
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     * @param userTimeSeconds デルタ時間の積算値[秒]
     */
    startFadeOut(fadeOutSeconds, userTimeSeconds) {
        const newEndTimeSeconds = userTimeSeconds + fadeOutSeconds;
        this._isTriggeredFadeOut = true;
        if (this._endTimeSeconds < 0.0 ||
            newEndTimeSeconds < this._endTimeSeconds) {
            this._endTimeSeconds = newEndTimeSeconds;
        }
    }
    /**
     * モーションの終了の確認
     *
     * @return true モーションが終了した
     * @return false 終了していない
     */
    isFinished() {
        return this._finished;
    }
    /**
     * モーションの開始の確認
     * @return true モーションが開始した
     * @return false 開始していない
     */
    isStarted() {
        return this._started;
    }
    /**
     * モーションの開始時刻の取得
     * @return モーションの開始時刻[秒]
     */
    getStartTime() {
        return this._startTimeSeconds;
    }
    /**
     * フェードインの開始時刻の取得
     * @return フェードインの開始時刻[秒]
     */
    getFadeInStartTime() {
        return this._fadeInStartTimeSeconds;
    }
    /**
     * フェードインの終了時刻の取得
     * @return フェードインの終了時刻の取得
     */
    getEndTime() {
        return this._endTimeSeconds;
    }
    /**
     * モーションの開始時刻の設定
     * @param startTime モーションの開始時刻
     */
    setStartTime(startTime) {
        this._startTimeSeconds = startTime;
    }
    /**
     * フェードインの開始時刻の設定
     * @param startTime フェードインの開始時刻[秒]
     */
    setFadeInStartTime(startTime) {
        this._fadeInStartTimeSeconds = startTime;
    }
    /**
     * フェードインの終了時刻の設定
     * @param endTime フェードインの終了時刻[秒]
     */
    setEndTime(endTime) {
        this._endTimeSeconds = endTime;
    }
    /**
     * モーションの終了の設定
     * @param f trueならモーションの終了
     */
    setIsFinished(f) {
        this._finished = f;
    }
    /**
     * モーション開始の設定
     * @param f trueならモーションの開始
     */
    setIsStarted(f) {
        this._started = f;
    }
    /**
     * モーションの有効性の確認
     * @return true モーションは有効
     * @return false モーションは無効
     */
    isAvailable() {
        return this._available;
    }
    /**
     * モーションの有効性の設定
     * @param v trueならモーションは有効
     */
    setIsAvailable(v) {
        this._available = v;
    }
    /**
     * モーションの状態の設定
     * @param timeSeconds 現在時刻[秒]
     * @param weight モーション尾重み
     */
    setState(timeSeconds, weight) {
        this._stateTimeSeconds = timeSeconds;
        this._stateWeight = weight;
    }
    /**
     * モーションの現在時刻の取得
     * @return モーションの現在時刻[秒]
     */
    getStateTime() {
        return this._stateTimeSeconds;
    }
    /**
     * モーションの重みの取得
     * @return モーションの重み
     */
    getStateWeight() {
        return this._stateWeight;
    }
    /**
     * 最後にイベントの発火をチェックした時間を取得
     *
     * @return 最後にイベントの発火をチェックした時間[秒]
     */
    getLastCheckEventSeconds() {
        return this._lastEventCheckSeconds;
    }
    /**
     * 最後にイベントをチェックした時間を設定
     * @param checkSeconds 最後にイベントをチェックした時間[秒]
     */
    setLastCheckEventSeconds(checkSeconds) {
        this._lastEventCheckSeconds = checkSeconds;
    }
    /**
     * フェードアウト開始判定の取得
     * @return フェードアウト開始するかどうか
     */
    isTriggeredFadeOut() {
        return this._isTriggeredFadeOut;
    }
    /**
     * フェードアウト時間の取得
     * @return フェードアウト時間[秒]
     */
    getFadeOutSeconds() {
        return this._fadeOutSeconds;
    }
    /**
     * モーションの取得
     *
     * @return モーション
     */
    getCubismMotion() {
        return this._motion;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismmotionqueueentry';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionQueueEntry = $.CubismMotionQueueEntry;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmotionqueueentry.js.map