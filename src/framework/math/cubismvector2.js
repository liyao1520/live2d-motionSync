/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * 2次元ベクトル型
 *
 * 2次元ベクトル型の機能を提供する。
 */
export class CubismVector2 {
    /**
     * コンストラクタ
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.x = x == undefined ? 0.0 : x;
        this.y = y == undefined ? 0.0 : y;
    }
    /**
     * ベクトルの加算
     *
     * @param vector2 加算するベクトル値
     * @return 加算結果 ベクトル値
     */
    add(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x + vector2.x;
        ret.y = this.y + vector2.y;
        return ret;
    }
    /**
     * ベクトルの減算
     *
     * @param vector2 減算するベクトル値
     * @return 減算結果 ベクトル値
     */
    substract(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x - vector2.x;
        ret.y = this.y - vector2.y;
        return ret;
    }
    /**
     * ベクトルの乗算
     *
     * @param vector2 乗算するベクトル値
     * @return 乗算結果 ベクトル値
     */
    multiply(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x * vector2.x;
        ret.y = this.y * vector2.y;
        return ret;
    }
    /**
     * ベクトルの乗算(スカラー)
     *
     * @param scalar 乗算するスカラー値
     * @return 乗算結果 ベクトル値
     */
    multiplyByScaler(scalar) {
        return this.multiply(new CubismVector2(scalar, scalar));
    }
    /**
     * ベクトルの除算
     *
     * @param vector2 除算するベクトル値
     * @return 除算結果 ベクトル値
     */
    division(vector2) {
        const ret = new CubismVector2(0.0, 0.0);
        ret.x = this.x / vector2.x;
        ret.y = this.y / vector2.y;
        return ret;
    }
    /**
     * ベクトルの除算(スカラー)
     *
     * @param scalar 除算するスカラー値
     * @return 除算結果 ベクトル値
     */
    divisionByScalar(scalar) {
        return this.division(new CubismVector2(scalar, scalar));
    }
    /**
     * ベクトルの長さを取得する
     *
     * @return ベクトルの長さ
     */
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    /**
     * ベクトルの距離の取得
     *
     * @param a 点
     * @return ベクトルの距離
     */
    getDistanceWith(a) {
        return Math.sqrt((this.x - a.x) * (this.x - a.x) + (this.y - a.y) * (this.y - a.y));
    }
    /**
     * ドット積の計算
     *
     * @param a 値
     * @return 結果
     */
    dot(a) {
        return this.x * a.x + this.y * a.y;
    }
    /**
     * 正規化の適用
     */
    normalize() {
        const length = Math.pow(this.x * this.x + this.y * this.y, 0.5);
        this.x = this.x / length;
        this.y = this.y / length;
    }
    /**
     * 等しさの確認（等しいか？）
     *
     * 値が等しいか？
     *
     * @param rhs 確認する値
     * @return true 値は等しい
     * @return false 値は等しくない
     */
    isEqual(rhs) {
        return this.x == rhs.x && this.y == rhs.y;
    }
    /**
     * 等しさの確認（等しくないか？）
     *
     * 値が等しくないか？
     *
     * @param rhs 確認する値
     * @return true 値は等しくない
     * @return false 値は等しい
     */
    isNotEqual(rhs) {
        return !this.isEqual(rhs);
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismvector2';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismVector2 = $.CubismVector2;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismvector2.js.map