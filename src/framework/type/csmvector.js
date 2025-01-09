/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * ベクター型（可変配列型）
 */
export class csmVector {
    /**
     * 引数付きコンストラクタ
     * @param iniitalCapacity 初期化後のキャパシティ。データサイズは_capacity * sizeof(T)
     * @param zeroClear trueなら初期化時に確保した領域を0で埋める
     */
    constructor(initialCapacity = 0) {
        if (initialCapacity < 1) {
            this._ptr = [];
            this._capacity = 0;
            this._size = 0;
        }
        else {
            this._ptr = new Array(initialCapacity);
            this._capacity = initialCapacity;
            this._size = 0;
        }
    }
    /**
     * インデックスで指定した要素を返す
     */
    at(index) {
        return this._ptr[index];
    }
    /**
     * 要素をセット
     * @param index 要素をセットするインデックス
     * @param value セットする要素
     */
    set(index, value) {
        this._ptr[index] = value;
    }
    /**
     * コンテナを取得する
     */
    get(offset = 0) {
        const ret = new Array();
        for (let i = offset; i < this._size; i++) {
            ret.push(this._ptr[i]);
        }
        return ret;
    }
    /**
     * pushBack処理、コンテナに新たな要素を追加する
     * @param value PushBack処理で追加する値
     */
    pushBack(value) {
        if (this._size >= this._capacity) {
            this.prepareCapacity(this._capacity == 0 ? csmVector.DefaultSize : this._capacity * 2);
        }
        this._ptr[this._size++] = value;
    }
    /**
     * コンテナの全要素を解放する
     */
    clear() {
        this._ptr.length = 0;
        this._size = 0;
    }
    /**
     * コンテナの要素数を返す
     * @return コンテナの要素数
     */
    getSize() {
        return this._size;
    }
    /**
     * コンテナの全要素に対して代入処理を行う
     * @param newSize 代入処理後のサイズ
     * @param value 要素に代入する値
     */
    assign(newSize, value) {
        const curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
        }
        for (let i = 0; i < newSize; i++) {
            this._ptr[i] = value;
        }
        this._size = newSize;
    }
    /**
     * サイズ変更
     */
    resize(newSize, value = null) {
        this.updateSize(newSize, value, true);
    }
    /**
     * サイズ変更
     */
    updateSize(newSize, value = null, callPlacementNew = true) {
        const curSize = this._size;
        if (curSize < newSize) {
            this.prepareCapacity(newSize); // capacity更新
            if (callPlacementNew) {
                for (let i = this._size; i < newSize; i++) {
                    if (typeof value == 'function') {
                        // new
                        this._ptr[i] = JSON.parse(JSON.stringify(new value()));
                    } // プリミティブ型なので値渡し
                    else {
                        this._ptr[i] = value;
                    }
                }
            }
            else {
                for (let i = this._size; i < newSize; i++) {
                    this._ptr[i] = value;
                }
            }
        }
        else {
            // newSize <= this._size
            //---
            const sub = this._size - newSize;
            this._ptr.splice(this._size - sub, sub); // 不要なので破棄する
        }
        this._size = newSize;
    }
    /**
     * コンテナにコンテナ要素を挿入する
     * @param position 挿入する位置
     * @param begin 挿入するコンテナの開始位置
     * @param end 挿入するコンテナの終端位置
     */
    insert(position, begin, end) {
        let dstSi = position._index;
        const srcSi = begin._index;
        const srcEi = end._index;
        const addCount = srcEi - srcSi;
        this.prepareCapacity(this._size + addCount);
        // 挿入用の既存データをシフトして隙間を作る
        const addSize = this._size - dstSi;
        if (addSize > 0) {
            for (let i = 0; i < addSize; i++) {
                this._ptr.splice(dstSi + i, 0, null);
            }
        }
        for (let i = srcSi; i < srcEi; i++, dstSi++) {
            this._ptr[dstSi] = begin._vector._ptr[i];
        }
        this._size = this._size + addCount;
    }
    /**
     * コンテナからインデックスで指定した要素を削除する
     * @param index インデックス値
     * @return true 削除実行
     * @return false 削除範囲外
     */
    remove(index) {
        if (index < 0 || this._size <= index) {
            return false; // 削除範囲外
        }
        this._ptr.splice(index, 1);
        --this._size;
        return true;
    }
    /**
     * コンテナから要素を削除して他の要素をシフトする
     * @param ite 削除する要素
     */
    erase(ite) {
        const index = ite._index;
        if (index < 0 || this._size <= index) {
            return ite; // 削除範囲外
        }
        // 削除
        this._ptr.splice(index, 1);
        --this._size;
        const ite2 = new iterator(this, index); // 終了
        return ite2;
    }
    /**
     * コンテナのキャパシティを確保する
     * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない.
     */
    prepareCapacity(newSize) {
        if (newSize > this._capacity) {
            if (this._capacity == 0) {
                this._ptr = new Array(newSize);
                this._capacity = newSize;
            }
            else {
                this._ptr.length = newSize;
                this._capacity = newSize;
            }
        }
    }
    /**
     * コンテナの先頭要素を返す
     */
    begin() {
        const ite = this._size == 0 ? this.end() : new iterator(this, 0);
        return ite;
    }
    /**
     * コンテナの終端要素を返す
     */
    end() {
        const ite = new iterator(this, this._size);
        return ite;
    }
    getOffset(offset) {
        const newVector = new csmVector();
        newVector._ptr = this.get(offset);
        newVector._size = this.get(offset).length;
        newVector._capacity = this.get(offset).length;
        return newVector;
    }
}
csmVector.DefaultSize = 10; // コンテナ初期化のデフォルトサイズ
export class iterator {
    /**
     * コンストラクタ
     */
    constructor(v, index) {
        this._vector = v != undefined ? v : null;
        this._index = index != undefined ? index : 0;
    }
    /**
     * 代入
     */
    set(ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    }
    /**
     * 前置き++演算
     */
    preIncrement() {
        ++this._index;
        return this;
    }
    /**
     * 前置き--演算
     */
    preDecrement() {
        --this._index;
        return this;
    }
    /**
     * 後置き++演算子
     */
    increment() {
        const iteold = new iterator(this._vector, this._index++); // 古い値を保存
        return iteold;
    }
    /**
     * 後置き--演算子
     */
    decrement() {
        const iteold = new iterator(this._vector, this._index--); // 古い値を保存
        return iteold;
    }
    /**
     * ptr
     */
    ptr() {
        return this._vector._ptr[this._index];
    }
    /**
     * =演算子のオーバーロード
     */
    substitution(ite) {
        this._index = ite._index;
        this._vector = ite._vector;
        return this;
    }
    /**
     * !=演算子のオーバーロード
     */
    notEqual(ite) {
        return this._index != ite._index || this._vector != ite._vector;
    }
}
// Namespace definition for compatibility.
import * as $ from './csmvector';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.csmVector = $.csmVector;
    Live2DCubismFramework.iterator = $.iterator;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=csmvector.js.map