/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismVector2 } from '../math/cubismvector2';
import { csmVector } from '../type/csmvector';
import { CubismModel } from '../model/cubismmodel';
import { CubismPhysicsRig } from './cubismphysicsinternal';
/**
 * 物理演算クラス
 */
export declare class CubismPhysics {
    /**
     * インスタンスの作成
     * @param buffer    physics3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     * @return 作成されたインスタンス
     */
    static create(buffer: ArrayBuffer, size: number): CubismPhysics;
    /**
     * インスタンスを破棄する
     * @param physics 破棄するインスタンス
     */
    static delete(physics: CubismPhysics): void;
    /**
     * physics3.jsonをパースする。
     * @param physicsJson physics3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    parse(physicsJson: ArrayBuffer, size: number): void;
    /**
     * 現在のパラメータ値で物理演算が安定化する状態を演算する。
     * @param model 物理演算の結果を適用するモデル
     */
    stabilization(model: CubismModel): void;
    /**
     * 物理演算の評価
     *
     * Pendulum interpolation weights
     *
     * 振り子の計算結果は保存され、パラメータへの出力は保存された前回の結果で補間されます。
     * The result of the pendulum calculation is saved and
     * the output to the parameters is interpolated with the saved previous result of the pendulum calculation.
     *
     * 図で示すと[1]と[2]で補間されます。
     * The figure shows the interpolation between [1] and [2].
     *
     * 補間の重みは最新の振り子計算タイミングと次回のタイミングの間で見た現在時間で決定する。
     * The weight of the interpolation are determined by the current time seen between
     * the latest pendulum calculation timing and the next timing.
     *
     * 図で示すと[2]と[4]の間でみた(3)の位置の重みになる。
     * Figure shows the weight of position (3) as seen between [2] and [4].
     *
     * 解釈として振り子計算のタイミングと重み計算のタイミングがズレる。
     * As an interpretation, the pendulum calculation and weights are misaligned.
     *
     * physics3.jsonにFPS情報が存在しない場合は常に前の振り子状態で設定される。
     * If there is no FPS information in physics3.json, it is always set in the previous pendulum state.
     *
     * この仕様は補間範囲を逸脱したことが原因の震えたような見た目を回避を目的にしている。
     * The purpose of this specification is to avoid the quivering appearance caused by deviations from the interpolation range.
     *
     * ------------ time -------------->
     *
     *                 |+++++|------| <- weight
     * ==[1]====#=====[2]---(3)----(4)
     *          ^ output contents
     *
     * 1:_previousRigOutputs
     * 2:_currentRigOutputs
     * 3:_currentRemainTime (now rendering)
     * 4:next particles timing
     * @param model 物理演算の結果を適用するモデル
     * @param deltaTimeSeconds デルタ時間[秒]
     */
    evaluate(model: CubismModel, deltaTimeSeconds: number): void;
    /**
     * 物理演算結果の適用
     * 振り子演算の最新の結果と一つ前の結果から指定した重みで適用する。
     * @param model 物理演算の結果を適用するモデル
     * @param weight 最新結果の重み
     */
    interpolate(model: CubismModel, weight: number): void;
    /**
     * オプションの設定
     * @param options オプション
     */
    setOptions(options: Options): void;
    /**
     * オプションの取得
     * @return オプション
     */
    getOption(): Options;
    /**
     * コンストラクタ
     */
    constructor();
    /**
     * デストラクタ相当の処理
     */
    release(): void;
    /**
     * 初期化する
     */
    initialize(): void;
    _physicsRig: CubismPhysicsRig;
    _options: Options;
    _currentRigOutputs: csmVector<PhysicsOutput>;
    _previousRigOutputs: csmVector<PhysicsOutput>;
    _currentRemainTime: number;
    _parameterCaches: Float32Array;
    _parameterInputCaches: Float32Array;
}
/**
 * 物理演算のオプション
 */
export declare class Options {
    constructor();
    gravity: CubismVector2;
    wind: CubismVector2;
}
/**
 * パラメータに適用する前の物理演算の出力結果
 */
export declare class PhysicsOutput {
    constructor();
    outputs: csmVector<number>;
}
import * as $ from './cubismphysics';
export declare namespace Live2DCubismFramework {
    const CubismPhysics: typeof $.CubismPhysics;
    type CubismPhysics = $.CubismPhysics;
    const Options: typeof $.Options;
    type Options = $.Options;
}
//# sourceMappingURL=cubismphysics.d.ts.map