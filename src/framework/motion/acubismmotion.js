/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismMath } from '../math/cubismmath';
import { csmVector } from '../type/csmvector';
import { CSM_ASSERT, CubismDebug } from '../utils/cubismdebug';
/**
 * モーションの抽象基底クラス
 *
 * モーションの抽象基底クラス。MotionQueueManagerによってモーションの再生を管理する。
 */
export class ACubismMotion {
    /**
     * インスタンスの破棄
     */
    static delete(motion) {
        motion.release();
        motion = null;
    }
    /**
     * コンストラクタ
     */
    constructor() {
        /**
         * モーション再生終了コールバックの登録
         *
         * モーション再生終了コールバックを登録する。
         * isFinishedフラグを設定するタイミングで呼び出される。
         * 以下の状態の際には呼び出されない:
         *   1. 再生中のモーションが「ループ」として設定されているとき
         *   2. コールバックが登録されていない時
         *
         * @param onFinishedMotionHandler モーション再生終了コールバック関数
         */
        this.setFinishedMotionHandler = (onFinishedMotionHandler) => (this._onFinishedMotion = onFinishedMotionHandler);
        /**
         * モーション再生終了コールバックの取得
         *
         * モーション再生終了コールバックを取得する。
         *
         * @return 登録されているモーション再生終了コールバック関数
         */
        this.getFinishedMotionHandler = () => this._onFinishedMotion;
        this._fadeInSeconds = -1.0;
        this._fadeOutSeconds = -1.0;
        this._weight = 1.0;
        this._offsetSeconds = 0.0; // 再生の開始時刻
        this._firedEventValues = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        this._weight = 0.0;
    }
    /**
     * モデルのパラメータ
     * @param model 対象のモデル
     * @param motionQueueEntry CubismMotionQueueManagerで管理されているモーション
     * @param userTimeSeconds デルタ時間の積算値[秒]
     */
    updateParameters(model, motionQueueEntry, userTimeSeconds) {
        if (!motionQueueEntry.isAvailable() || motionQueueEntry.isFinished()) {
            return;
        }
        this.setupMotionQueueEntry(motionQueueEntry, userTimeSeconds);
        const fadeWeight = this.updateFadeWeight(motionQueueEntry, userTimeSeconds);
        //---- 全てのパラメータIDをループする ----
        this.doUpdateParameters(model, userTimeSeconds, fadeWeight, motionQueueEntry);
        // 後処理
        // 終了時刻を過ぎたら終了フラグを立てる(CubismMotionQueueManager)
        if (motionQueueEntry.getEndTime() > 0 &&
            motionQueueEntry.getEndTime() < userTimeSeconds) {
            motionQueueEntry.setIsFinished(true); // 終了
        }
    }
    /**
     * @brief モデルの再生開始処理
     *
     * モーションの再生を開始するためのセットアップを行う。
     *
     * @param[in]   motionQueueEntry    CubismMotionQueueManagerで管理されているモーション
     * @param[in]   userTimeSeconds     デルタ時間の積算値[秒]
     */
    setupMotionQueueEntry(motionQueueEntry, userTimeSeconds) {
        if (motionQueueEntry == null || motionQueueEntry.isStarted()) {
            return;
        }
        if (!motionQueueEntry.isAvailable()) {
            return;
        }
        motionQueueEntry.setIsStarted(true);
        motionQueueEntry.setStartTime(userTimeSeconds - this._offsetSeconds); // モーションの開始時刻を記録
        motionQueueEntry.setFadeInStartTime(userTimeSeconds); // フェードインの開始時刻
        const duration = this.getDuration();
        if (motionQueueEntry.getEndTime() < 0.0) {
            // 開始していないうちに終了設定している場合がある
            motionQueueEntry.setEndTime(duration <= 0.0 ? -1 : motionQueueEntry.getStartTime() + duration);
            // duration == -1 の場合はループする
        }
    }
    /**
     * @brief モデルのウェイト更新
     *
     * モーションのウェイトを更新する。
     *
     * @param[in]   motionQueueEntry    CubismMotionQueueManagerで管理されているモーション
     * @param[in]   userTimeSeconds     デルタ時間の積算値[秒]
     */
    updateFadeWeight(motionQueueEntry, userTimeSeconds) {
        if (motionQueueEntry == null) {
            CubismDebug.print(LogLevel.LogLevel_Error, 'motionQueueEntry is null.');
        }
        let fadeWeight = this._weight; // 現在の値と掛け合わせる割合
        //---- フェードイン・アウトの処理 ----
        // 単純なサイン関数でイージングする
        const fadeIn = this._fadeInSeconds == 0.0
            ? 1.0
            : CubismMath.getEasingSine((userTimeSeconds - motionQueueEntry.getFadeInStartTime()) /
                this._fadeInSeconds);
        const fadeOut = this._fadeOutSeconds == 0.0 || motionQueueEntry.getEndTime() < 0.0
            ? 1.0
            : CubismMath.getEasingSine((motionQueueEntry.getEndTime() - userTimeSeconds) /
                this._fadeOutSeconds);
        fadeWeight = fadeWeight * fadeIn * fadeOut;
        motionQueueEntry.setState(userTimeSeconds, fadeWeight);
        CSM_ASSERT(0.0 <= fadeWeight && fadeWeight <= 1.0);
        return fadeWeight;
    }
    /**
     * フェードインの時間を設定する
     * @param fadeInSeconds フェードインにかかる時間[秒]
     */
    setFadeInTime(fadeInSeconds) {
        this._fadeInSeconds = fadeInSeconds;
    }
    /**
     * フェードアウトの時間を設定する
     * @param fadeOutSeconds フェードアウトにかかる時間[秒]
     */
    setFadeOutTime(fadeOutSeconds) {
        this._fadeOutSeconds = fadeOutSeconds;
    }
    /**
     * フェードアウトにかかる時間の取得
     * @return フェードアウトにかかる時間[秒]
     */
    getFadeOutTime() {
        return this._fadeOutSeconds;
    }
    /**
     * フェードインにかかる時間の取得
     * @return フェードインにかかる時間[秒]
     */
    getFadeInTime() {
        return this._fadeInSeconds;
    }
    /**
     * モーション適用の重みの設定
     * @param weight 重み（0.0 - 1.0）
     */
    setWeight(weight) {
        this._weight = weight;
    }
    /**
     * モーション適用の重みの取得
     * @return 重み（0.0 - 1.0）
     */
    getWeight() {
        return this._weight;
    }
    /**
     * モーションの長さの取得
     * @return モーションの長さ[秒]
     *
     * @note ループの時は「-1」。
     *       ループでない場合は、オーバーライドする。
     *       正の値の時は取得される時間で終了する。
     *       「-1」の時は外部から停止命令がない限り終わらない処理となる。
     */
    getDuration() {
        return -1.0;
    }
    /**
     * モーションのループ1回分の長さの取得
     * @return モーションのループ一回分の長さ[秒]
     *
     * @note ループしない場合は、getDuration()と同じ値を返す
     *       ループ一回分の長さが定義できない場合(プログラム的に動き続けるサブクラスなど)の場合は「-1」を返す
     */
    getLoopDuration() {
        return -1.0;
    }
    /**
     * モーション再生の開始時刻の設定
     * @param offsetSeconds モーション再生の開始時刻[秒]
     */
    setOffsetTime(offsetSeconds) {
        this._offsetSeconds = offsetSeconds;
    }
    /**
     * モデルのパラメータ更新
     *
     * イベント発火のチェック。
     * 入力する時間は呼ばれるモーションタイミングを０とした秒数で行う。
     *
     * @param beforeCheckTimeSeconds 前回のイベントチェック時間[秒]
     * @param motionTimeSeconds 今回の再生時間[秒]
     */
    getFiredEvent(beforeCheckTimeSeconds, motionTimeSeconds) {
        return this._firedEventValues;
    }
    /**
     * 透明度のカーブが存在するかどうかを確認する
     *
     * @returns true  -> キーが存在する
     *          false -> キーが存在しない
     */
    isExistModelOpacity() {
        return false;
    }
    /**
     * 透明度のカーブのインデックスを返す
     *
     * @returns success:透明度のカーブのインデックス
     */
    getModelOpacityIndex() {
        return -1;
    }
    /**
     * 透明度のIdを返す
     *
     * @param index モーションカーブのインデックス
     * @returns success:透明度のId
     */
    getModelOpacityId(index) {
        return null;
    }
    /**
     * 指定時間の透明度の値を返す
     *
     * @returns success:モーションの現在時間におけるOpacityの値
     *
     * @note  更新後の値を取るにはUpdateParameters() の後に呼び出す。
     */
    getModelOpacityValue() {
        return 1.0;
    }
}
// Namespace definition for compatibility.
import * as $ from './acubismmotion';
import { LogLevel } from '../live2dcubismframework';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.ACubismMotion = $.ACubismMotion;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=acubismmotion.js.map