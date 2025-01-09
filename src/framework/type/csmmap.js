/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismLogDebug } from '../utils/cubismdebug';
/**
 * Key-Valueのペアを定義するクラス
 * csmMapクラスの内部データで使用する。
 */
export class csmPair {
    /**
     * コンストラクタ
     * @param key Keyとしてセットする値
     * @param value Valueとしてセットする値
     */
    constructor(key, value) {
        this.first = key == undefined ? null : key;
        this.second = value == undefined ? null : value;
    }
}
/**
 * マップ型
 */
export class csmMap {
    /**
     * 引数付きコンストラクタ
     * @param size 初期化時点で確保するサイズ
     */
    constructor(size) {
        if (size != undefined) {
            if (size < 1) {
                this._keyValues = [];
                this._dummyValue = null;
                this._size = 0;
            }
            else {
                this._keyValues = new Array(size);
                this._size = size;
            }
        }
        else {
            this._keyValues = [];
            this._dummyValue = null;
            this._size = 0;
        }
    }
    /**
     * デストラクタ
     */
    release() {
        this.clear();
    }
    /**
     * キーを追加する
     * @param key 新たに追加するキー
     */
    appendKey(key) {
        // 新しくKey/Valueのペアを作る
        this.prepareCapacity(this._size + 1, false); // 1つ以上入る隙間を作る
        // 新しいkey/valueのインデックスは_size
        this._keyValues[this._size] = new csmPair(key);
        this._size += 1;
    }
    /**
     * 添字演算子[key]のオーバーロード(get)
     * @param key 添字から特定されるValue値
     */
    getValue(key) {
        let found = -1;
        for (let i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            return this._keyValues[found].second;
        }
        else {
            this.appendKey(key); // 新規キーを追加
            return this._keyValues[this._size - 1].second;
        }
    }
    /**
     * 添字演算子[key]のオーバーロード(set)
     * @param key 添字から特定されるValue値
     * @param value 代入するValue値
     */
    setValue(key, value) {
        let found = -1;
        for (let i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                found = i;
                break;
            }
        }
        if (found >= 0) {
            this._keyValues[found].second = value;
        }
        else {
            this.appendKey(key); // 新規キーを追加
            this._keyValues[this._size - 1].second = value;
        }
    }
    /**
     * 引数で渡したKeyを持つ要素が存在するか
     * @param key 存在を確認するkey
     * @return true 引数で渡したkeyを持つ要素が存在する
     * @return false 引数で渡したkeyを持つ要素が存在しない
     */
    isExist(key) {
        for (let i = 0; i < this._size; i++) {
            if (this._keyValues[i].first == key) {
                return true;
            }
        }
        return false;
    }
    /**
     * keyValueのポインタを全て解放する
     */
    clear() {
        this._keyValues = void 0;
        this._keyValues = null;
        this._keyValues = [];
        this._size = 0;
    }
    /**
     * コンテナのサイズを取得する
     *
     * @return コンテナのサイズ
     */
    getSize() {
        return this._size;
    }
    /**
     * コンテナのキャパシティを確保する
     * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない。
     * @param fitToSize trueなら指定したサイズに合わせる。falseならサイズを2倍確保しておく。
     */
    prepareCapacity(newSize, fitToSize) {
        if (newSize > this._keyValues.length) {
            if (this._keyValues.length == 0) {
                if (!fitToSize && newSize < csmMap.DefaultSize)
                    newSize = csmMap.DefaultSize;
                this._keyValues.length = newSize;
            }
            else {
                if (!fitToSize && newSize < this._keyValues.length * 2)
                    newSize = this._keyValues.length * 2;
                this._keyValues.length = newSize;
            }
        }
    }
    /**
     * コンテナの先頭要素を返す
     */
    begin() {
        const ite = new iterator(this, 0);
        return ite;
    }
    /**
     * コンテナの終端要素を返す
     */
    end() {
        const ite = new iterator(this, this._size); // 終了
        return ite;
    }
    /**
     * コンテナから要素を削除する
     *
     * @param ite 削除する要素
     */
    erase(ite) {
        const index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // 削除範囲外
        }
        // 削除
        this._keyValues.splice(index, 1);
        --this._size;
        const ite2 = new iterator(this, index); // 終了
        return ite2;
    }
    /**
     * コンテナの値を32ビット符号付き整数型でダンプする
     */
    dumpAsInt() {
        for (let i = 0; i < this._size; i++) {
            CubismLogDebug('{0} ,', this._keyValues[i]);
            CubismLogDebug('\n');
        }
    }
}
csmMap.DefaultSize = 10; // コンテナの初期化のデフォルトサイズ
/**
 * csmMap<T>のイテレータ
 */
export class iterator {
    /**
     * コンストラクタ
     */
    constructor(v, idx) {
        this._map = v != undefined ? v : new csmMap();
        this._index = idx != undefined ? idx : 0;
    }
    /**
     * =演算子のオーバーロード
     */
    set(ite) {
        this._index = ite._index;
        this._map = ite._map;
        return this;
    }
    /**
     * 前置き++演算子のオーバーロード
     */
    preIncrement() {
        ++this._index;
        return this;
    }
    /**
     * 前置き--演算子のオーバーロード
     */
    preDecrement() {
        --this._index;
        return this;
    }
    /**
     * 後置き++演算子のオーバーロード
     */
    increment() {
        const iteold = new iterator(this._map, this._index++); // 古い値を保存
        return iteold;
    }
    /**
     * 後置き--演算子のオーバーロード
     */
    decrement() {
        const iteold = new iterator(this._map, this._index); // 古い値を保存
        this._map = iteold._map;
        this._index = iteold._index;
        return this;
    }
    /**
     * *演算子のオーバーロード
     */
    ptr() {
        return this._map._keyValues[this._index];
    }
    /**
     * !=演算
     */
    notEqual(ite) {
        return this._index != ite._index || this._map != ite._map;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmmap';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmMap = $.csmMap;
    Live2DCubismFramework.csmPair = $.csmPair;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmmap.js.map