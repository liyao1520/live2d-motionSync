/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * 文字列クラス。
 */
export class csmString {
    /**
     * 文字列を後方に追加する
     *
     * @param c 追加する文字列
     * @return 更新された文字列
     */
    append(c, length) {
        this.s += length !== undefined ? c.substr(0, length) : c;
        return this;
    }
    /**
     * 文字サイズを拡張して文字を埋める
     * @param length    拡張する文字数
     * @param v         埋める文字
     * @return 更新された文字列
     */
    expansion(length, v) {
        for (let i = 0; i < length; i++) {
            this.append(v);
        }
        return this;
    }
    /**
     * 文字列の長さをバイト数で取得する
     */
    getBytes() {
        return encodeURIComponent(this.s).replace(/%../g, 'x').length;
    }
    /**
     * 文字列の長さを返す
     */
    getLength() {
        return this.s.length;
    }
    /**
     * 文字列比較 <
     * @param s 比較する文字列
     * @return true:    比較する文字列より小さい
     * @return false:   比較する文字列より大きい
     */
    isLess(s) {
        return this.s < s.s;
    }
    /**
     * 文字列比較 >
     * @param s 比較する文字列
     * @return true:    比較する文字列より大きい
     * @return false:   比較する文字列より小さい
     */
    isGreat(s) {
        return this.s > s.s;
    }
    /**
     * 文字列比較 ==
     * @param s 比較する文字列
     * @return true:    比較する文字列と等しい
     * @return false:   比較する文字列と異なる
     */
    isEqual(s) {
        return this.s == s;
    }
    /**
     * 文字列が空かどうか
     * @return true: 空の文字列
     * @return false: 値が設定されている
     */
    isEmpty() {
        return this.s.length == 0;
    }
    /**
     * 引数付きコンストラクタ
     */
    constructor(s) {
        this.s = s;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmstring';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmString = $.csmString;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmstring.js.map