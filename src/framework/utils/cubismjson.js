/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { strtod } from '../live2dcubismframework';
import { csmMap } from '../type/csmmap';
import { csmString } from '../type/csmstring';
import { csmVector } from '../type/csmvector';
import { CubismLogInfo } from './cubismdebug';
// StaticInitializeNotForClientCall()で初期化する
const CSM_JSON_ERROR_TYPE_MISMATCH = 'Error: type mismatch';
const CSM_JSON_ERROR_INDEX_OF_BOUNDS = 'Error: index out of bounds';
/**
 * パースしたJSONエレメントの要素の基底クラス。
 */
export class Value {
    /**
     * コンストラクタ
     */
    constructor() { }
    /**
     * 要素を文字列型で返す(string)
     */
    getRawString(defaultValue, indent) {
        return this.getString(defaultValue, indent);
    }
    /**
     * 要素を数値型で返す(number)
     */
    toInt(defaultValue = 0) {
        return defaultValue;
    }
    /**
     * 要素を数値型で返す(number)
     */
    toFloat(defaultValue = 0) {
        return defaultValue;
    }
    /**
     * 要素を真偽値で返す(boolean)
     */
    toBoolean(defaultValue = false) {
        return defaultValue;
    }
    /**
     * サイズを返す
     */
    getSize() {
        return 0;
    }
    /**
     * 要素を配列で返す(Value[])
     */
    getArray(defaultValue = null) {
        return defaultValue;
    }
    /**
     * 要素をコンテナで返す(array)
     */
    getVector(defaultValue = new csmVector()) {
        return defaultValue;
    }
    /**
     * 要素をマップで返す(csmMap<csmString, Value>)
     */
    getMap(defaultValue) {
        return defaultValue;
    }
    /**
     * 添字演算子[index]
     */
    getValueByIndex(index) {
        return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    }
    /**
     * 添字演算子[string | csmString]
     */
    getValueByString(s) {
        return Value.nullValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    }
    /**
     * マップのキー一覧をコンテナで返す
     *
     * @return マップのキーの一覧
     */
    getKeys() {
        return Value.dummyKeys;
    }
    /**
     * Valueの種類がエラー値ならtrue
     */
    isError() {
        return false;
    }
    /**
     * Valueの種類がnullならtrue
     */
    isNull() {
        return false;
    }
    /**
     * Valueの種類が真偽値ならtrue
     */
    isBool() {
        return false;
    }
    /**
     * Valueの種類が数値型ならtrue
     */
    isFloat() {
        return false;
    }
    /**
     * Valueの種類が文字列ならtrue
     */
    isString() {
        return false;
    }
    /**
     * Valueの種類が配列ならtrue
     */
    isArray() {
        return false;
    }
    /**
     * Valueの種類がマップ型ならtrue
     */
    isMap() {
        return false;
    }
    equals(value) {
        return false;
    }
    /**
     * Valueの値が静的ならtrue、静的なら解放しない
     */
    isStatic() {
        return false;
    }
    /**
     * Valueにエラー値をセットする
     */
    setErrorNotForClientCall(errorStr) {
        return JsonError.errorValue;
    }
    /**
     * 初期化用メソッド
     */
    static staticInitializeNotForClientCall() {
        JsonBoolean.trueValue = new JsonBoolean(true);
        JsonBoolean.falseValue = new JsonBoolean(false);
        Value.errorValue = new JsonError('ERROR', true);
        Value.nullValue = new JsonNullvalue();
        Value.dummyKeys = new csmVector();
    }
    /**
     * リリース用メソッド
     */
    static staticReleaseNotForClientCall() {
        JsonBoolean.trueValue = null;
        JsonBoolean.falseValue = null;
        Value.errorValue = null;
        Value.nullValue = null;
        Value.dummyKeys = null;
    }
}
/**
 * Ascii文字のみ対応した最小限の軽量JSONパーサ。
 * 仕様はJSONのサブセットとなる。
 * 設定ファイル(model3.json)などのロード用
 *
 * [未対応項目]
 * ・日本語などの非ASCII文字
 * ・eによる指数表現
 */
export class CubismJson {
    /**
     * コンストラクタ
     */
    constructor(buffer, length) {
        this._parseCallback = CubismJsonExtension.parseJsonObject; // パース時に使う処理のコールバック関数
        this._error = null;
        this._lineCount = 0;
        this._root = null;
        if (buffer != undefined) {
            this.parseBytes(buffer, length, this._parseCallback);
        }
    }
    /**
     * バイトデータから直接ロードしてパースする
     *
     * @param buffer バッファ
     * @param size バッファサイズ
     * @return CubismJsonクラスのインスタンス。失敗したらNULL
     */
    static create(buffer, size) {
        const json = new CubismJson();
        const succeeded = json.parseBytes(buffer, size, json._parseCallback);
        if (!succeeded) {
            CubismJson.delete(json);
            return null;
        }
        else {
            return json;
        }
    }
    /**
     * パースしたJSONオブジェクトの解放処理
     *
     * @param instance CubismJsonクラスのインスタンス
     */
    static delete(instance) {
        instance = null;
    }
    /**
     * パースしたJSONのルート要素を返す
     */
    getRoot() {
        return this._root;
    }
    /**
     *  UnicodeのバイナリをStringに変換
     *
     * @param buffer 変換するバイナリデータ
     * @return 変換後の文字列
     */
    static arrayBufferToString(buffer) {
        const uint8Array = new Uint8Array(buffer);
        let str = '';
        for (let i = 0, len = uint8Array.length; i < len; ++i) {
            str += '%' + this.pad(uint8Array[i].toString(16));
        }
        str = decodeURIComponent(str);
        return str;
    }
    /**
     * エンコード、パディング
     */
    static pad(n) {
        return n.length < 2 ? '0' + n : n;
    }
    /**
     * JSONのパースを実行する
     * @param buffer    パース対象のデータバイト
     * @param size      データバイトのサイズ
     * return true : 成功
     * return false: 失敗
     */
    parseBytes(buffer, size, parseCallback) {
        const endPos = new Array(1); // 参照渡しにするため配列
        const decodeBuffer = CubismJson.arrayBufferToString(buffer);
        if (parseCallback == undefined) {
            this._root = this.parseValue(decodeBuffer, size, 0, endPos);
        }
        else {
            // TypeScript標準のJSONパーサを使う
            this._root = parseCallback(JSON.parse(decodeBuffer), new JsonMap());
        }
        if (this._error) {
            let strbuf = '\0';
            strbuf = 'Json parse error : @line ' + (this._lineCount + 1) + '\n';
            this._root = new JsonString(strbuf);
            CubismLogInfo('{0}', this._root.getRawString());
            return false;
        }
        else if (this._root == null) {
            this._root = new JsonError(new csmString(this._error), false); // rootは解放されるのでエラーオブジェクトを別途作成する
            return false;
        }
        return true;
    }
    /**
     * パース時のエラー値を返す
     */
    getParseError() {
        return this._error;
    }
    /**
     * ルート要素の次の要素がファイルの終端だったらtrueを返す
     */
    checkEndOfFile() {
        return this._root.getArray()[1].equals('EOF');
    }
    /**
     * JSONエレメントからValue(float,String,Value*,Array,null,true,false)をパースする
     * エレメントの書式に応じて内部でParseString(), ParseObject(), ParseArray()を呼ぶ
     *
     * @param   buffer      JSONエレメントのバッファ
     * @param   length      パースする長さ
     * @param   begin       パースを開始する位置
     * @param   outEndPos   パース終了時の位置
     * @return      パースから取得したValueオブジェクト
     */
    parseValue(buffer, length, begin, outEndPos) {
        if (this._error)
            return null;
        let o = null;
        let i = begin;
        let f;
        for (; i < length; i++) {
            const c = buffer[i];
            switch (c) {
                case '-':
                case '.':
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9': {
                    const afterString = new Array(1); // 参照渡しにするため
                    f = strtod(buffer.slice(i), afterString);
                    outEndPos[0] = buffer.indexOf(afterString[0]);
                    return new JsonFloat(f);
                }
                case '"':
                    return new JsonString(this.parseString(buffer, length, i + 1, outEndPos)); // \"の次の文字から
                case '[':
                    o = this.parseArray(buffer, length, i + 1, outEndPos);
                    return o;
                case '{':
                    o = this.parseObject(buffer, length, i + 1, outEndPos);
                    return o;
                case 'n': // null以外にない
                    if (i + 3 < length) {
                        o = new JsonNullvalue(); // 解放できるようにする
                        outEndPos[0] = i + 4;
                    }
                    else {
                        this._error = 'parse null';
                    }
                    return o;
                case 't': // true以外にない
                    if (i + 3 < length) {
                        o = JsonBoolean.trueValue;
                        outEndPos[0] = i + 4;
                    }
                    else {
                        this._error = 'parse true';
                    }
                    return o;
                case 'f': // false以外にない
                    if (i + 4 < length) {
                        o = JsonBoolean.falseValue;
                        outEndPos[0] = i + 5;
                    }
                    else {
                        this._error = "illegal ',' position";
                    }
                    return o;
                case ',': // Array separator
                    this._error = "illegal ',' position";
                    return null;
                case ']': // 不正な｝だがスキップする。配列の最後に不要な , があると思われる
                    outEndPos[0] = i; // 同じ文字を再処理
                    return null;
                case '\n':
                    this._lineCount++;
                // falls through
                case ' ':
                case '\t':
                case '\r':
                default:
                    // スキップ
                    break;
            }
        }
        this._error = 'illegal end of value';
        return null;
    }
    /**
     * 次の「"」までの文字列をパースする。
     *
     * @param   string  ->  パース対象の文字列
     * @param   length  ->  パースする長さ
     * @param   begin   ->  パースを開始する位置
     * @param  outEndPos   ->  パース終了時の位置
     * @return      パースした文F字列要素
     */
    parseString(string, length, begin, outEndPos) {
        if (this._error) {
            return null;
        }
        if (!string) {
            this._error = 'string is null';
            return null;
        }
        let i = begin;
        let c, c2;
        const ret = new csmString('');
        let bufStart = begin; // sbufに登録されていない文字の開始位置
        for (; i < length; i++) {
            c = string[i];
            switch (c) {
                case '"': {
                    // 終端の”、エスケープ文字は別に処理されるのでここに来ない
                    outEndPos[0] = i + 1; // ”の次の文字
                    ret.append(string.slice(bufStart), i - bufStart); // 前の文字までを登録する
                    return ret.s;
                }
                // falls through
                case '//': {
                    // エスケープの場合
                    i++; // ２文字をセットで扱う
                    if (i - 1 > bufStart) {
                        ret.append(string.slice(bufStart), i - bufStart); // 前の文字までを登録する
                    }
                    bufStart = i + 1; // エスケープ（２文字)の次の文字から
                    if (i < length) {
                        c2 = string[i];
                        switch (c2) {
                            case '\\':
                                ret.expansion(1, '\\');
                                break;
                            case '"':
                                ret.expansion(1, '"');
                                break;
                            case '/':
                                ret.expansion(1, '/');
                                break;
                            case 'b':
                                ret.expansion(1, '\b');
                                break;
                            case 'f':
                                ret.expansion(1, '\f');
                                break;
                            case 'n':
                                ret.expansion(1, '\n');
                                break;
                            case 'r':
                                ret.expansion(1, '\r');
                                break;
                            case 't':
                                ret.expansion(1, '\t');
                                break;
                            case 'u':
                                this._error = 'parse string/unicord escape not supported';
                                break;
                            default:
                                break;
                        }
                    }
                    else {
                        this._error = 'parse string/escape error';
                    }
                }
                // falls through
                default: {
                    break;
                }
            }
        }
        this._error = 'parse string/illegal end';
        return null;
    }
    /**
     * JSONのオブジェクトエレメントをパースしてValueオブジェクトを返す
     *
     * @param buffer    JSONエレメントのバッファ
     * @param length    パースする長さ
     * @param begin     パースを開始する位置
     * @param outEndPos パース終了時の位置
     * @return パースから取得したValueオブジェクト
     */
    parseObject(buffer, length, begin, outEndPos) {
        if (this._error) {
            return null;
        }
        if (!buffer) {
            this._error = 'buffer is null';
            return null;
        }
        const ret = new JsonMap();
        // Key: Value
        let key = '';
        let i = begin;
        let c = '';
        const localRetEndPos2 = Array(1);
        let ok = false;
        // , が続く限りループ
        for (; i < length; i++) {
            FOR_LOOP: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case '"':
                        key = this.parseString(buffer, length, i + 1, localRetEndPos2);
                        if (this._error) {
                            return null;
                        }
                        i = localRetEndPos2[0];
                        ok = true;
                        break FOR_LOOP; //-- loopから出る
                    case '}': // 閉じカッコ
                        outEndPos[0] = i + 1;
                        return ret; // 空
                    case ':':
                        this._error = "illegal ':' position";
                        break;
                    case '\n':
                        this._lineCount++;
                    // falls through
                    default:
                        break; // スキップする文字
                }
            }
            if (!ok) {
                this._error = 'key not found';
                return null;
            }
            ok = false;
            // : をチェック
            FOR_LOOP2: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case ':':
                        ok = true;
                        i++;
                        break FOR_LOOP2;
                    case '}':
                        this._error = "illegal '}' position";
                        break;
                    // falls through
                    case '\n':
                        this._lineCount++;
                    // case ' ': case '\t' : case '\r':
                    // falls through
                    default:
                        break; // スキップする文字
                }
            }
            if (!ok) {
                this._error = "':' not found";
                return null;
            }
            // 値をチェック
            const value = this.parseValue(buffer, length, i, localRetEndPos2);
            if (this._error) {
                return null;
            }
            i = localRetEndPos2[0];
            // ret.put(key, value);
            ret.put(key, value);
            FOR_LOOP3: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case ',':
                        break FOR_LOOP3;
                    case '}':
                        outEndPos[0] = i + 1;
                        return ret; // 正常終了
                    case '\n':
                        this._lineCount++;
                    // falls through
                    default:
                        break; // スキップ
                }
            }
        }
        this._error = 'illegal end of perseObject';
        return null;
    }
    /**
     * 次の「"」までの文字列をパースする。
     * @param buffer    JSONエレメントのバッファ
     * @param length    パースする長さ
     * @param begin     パースを開始する位置
     * @param outEndPos パース終了時の位置
     * @return パースから取得したValueオブジェクト
     */
    parseArray(buffer, length, begin, outEndPos) {
        if (this._error) {
            return null;
        }
        if (!buffer) {
            this._error = 'buffer is null';
            return null;
        }
        let ret = new JsonArray();
        // key : value
        let i = begin;
        let c;
        const localRetEndpos2 = new Array(1);
        // , が続く限りループ
        for (; i < length; i++) {
            // : をチェック
            const value = this.parseValue(buffer, length, i, localRetEndpos2);
            if (this._error) {
                return null;
            }
            i = localRetEndpos2[0];
            if (value) {
                ret.add(value);
            }
            // FOR_LOOP3:
            // boolean breakflag = false;
            FOR_LOOP: for (; i < length; i++) {
                c = buffer[i];
                switch (c) {
                    case ',':
                        // breakflag = true;
                        // break; // 次のKEY, VAlUEへ
                        break FOR_LOOP;
                    case ']':
                        outEndPos[0] = i + 1;
                        return ret; // 終了
                    case '\n':
                        ++this._lineCount;
                    //case ' ': case '\t': case '\r':
                    // falls through
                    default:
                        break; // スキップ
                }
            }
        }
        ret = void 0;
        this._error = 'illegal end of parseObject';
        return null;
    }
}
/**
 * パースしたJSONの要素をfloat値として扱う
 */
export class JsonFloat extends Value {
    /**
     * コンストラクタ
     */
    constructor(v) {
        super();
        this._value = v;
    }
    /**
     * Valueの種類が数値型ならtrue
     */
    isFloat() {
        return true;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
        const strbuf = '\0';
        this._value = parseFloat(strbuf);
        this._stringBuffer = strbuf;
        return this._stringBuffer;
    }
    /**
     * 要素を数値型で返す(number)
     */
    toInt(defaultValue = 0) {
        return parseInt(this._value.toString());
    }
    /**
     * 要素を数値型で返す(number)
     */
    toFloat(defaultValue = 0.0) {
        return this._value;
    }
    equals(value) {
        if ('number' === typeof value) {
            // int
            if (Math.round(value)) {
                return false;
            }
            // float
            else {
                return value == this._value;
            }
        }
        return false;
    }
}
/**
 * パースしたJSONの要素を真偽値として扱う
 */
export class JsonBoolean extends Value {
    /**
     * Valueの種類が真偽値ならtrue
     */
    isBool() {
        return true;
    }
    /**
     * 要素を真偽値で返す(boolean)
     */
    toBoolean(defaultValue = false) {
        return this._boolValue;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
        this._stringBuffer = this._boolValue ? 'true' : 'false';
        return this._stringBuffer;
    }
    equals(value) {
        if ('boolean' === typeof value) {
            return value == this._boolValue;
        }
        return false;
    }
    /**
     * Valueの値が静的ならtrue, 静的なら解放しない
     */
    isStatic() {
        return true;
    }
    /**
     * 引数付きコンストラクタ
     */
    constructor(v) {
        super();
        this._boolValue = v;
    }
}
/**
 * パースしたJSONの要素を文字列として扱う
 */
export class JsonString extends Value {
    constructor(s) {
        super();
        if ('string' === typeof s) {
            this._stringBuffer = s;
        }
        if (s instanceof csmString) {
            this._stringBuffer = s.s;
        }
    }
    /**
     * Valueの種類が文字列ならtrue
     */
    isString() {
        return true;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
        return this._stringBuffer;
    }
    equals(value) {
        if ('string' === typeof value) {
            return this._stringBuffer == value;
        }
        if (value instanceof csmString) {
            return this._stringBuffer == value.s;
        }
        return false;
    }
}
/**
 * JSONパース時のエラー結果。文字列型のようにふるまう
 */
export class JsonError extends JsonString {
    /**
     * Valueの値が静的ならtrue、静的なら解放しない
     */
    isStatic() {
        return this._isStatic;
    }
    /**
     * エラー情報をセットする
     */
    setErrorNotForClientCall(s) {
        this._stringBuffer = s;
        return this;
    }
    /**
     * 引数付きコンストラクタ
     */
    constructor(s, isStatic) {
        if ('string' === typeof s) {
            super(s);
        }
        else {
            super(s);
        }
        this._isStatic = isStatic;
    }
    /**
     * Valueの種類がエラー値ならtrue
     */
    isError() {
        return true;
    }
}
/**
 * パースしたJSONの要素をNULL値として持つ
 */
export class JsonNullvalue extends Value {
    /**
     * Valueの種類がNULL値ならtrue
     */
    isNull() {
        return true;
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
        return this._stringBuffer;
    }
    /**
     * Valueの値が静的ならtrue, 静的なら解放しない
     */
    isStatic() {
        return true;
    }
    /**
     * Valueにエラー値をセットする
     */
    setErrorNotForClientCall(s) {
        this._stringBuffer = s;
        return JsonError.nullValue;
    }
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._stringBuffer = 'NullValue';
    }
}
/**
 * パースしたJSONの要素を配列として持つ
 */
export class JsonArray extends Value {
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._array = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        for (let ite = this._array.begin(); ite.notEqual(this._array.end()); ite.preIncrement()) {
            let v = ite.ptr();
            if (v && !v.isStatic()) {
                v = void 0;
                v = null;
            }
        }
    }
    /**
     * Valueの種類が配列ならtrue
     */
    isArray() {
        return true;
    }
    /**
     * 添字演算子[index]
     */
    getValueByIndex(index) {
        if (index < 0 || this._array.getSize() <= index) {
            return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_INDEX_OF_BOUNDS);
        }
        const v = this._array.at(index);
        if (v == null) {
            return Value.nullValue;
        }
        return v;
    }
    /**
     * 添字演算子[string | csmString]
     */
    getValueByString(s) {
        return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
        const stringBuffer = indent + '[\n';
        for (let ite = this._array.begin(); ite.notEqual(this._array.end()); ite.increment()) {
            const v = ite.ptr();
            this._stringBuffer += indent + '' + v.getString(indent + ' ') + '\n';
        }
        this._stringBuffer = stringBuffer + indent + ']\n';
        return this._stringBuffer;
    }
    /**
     * 配列要素を追加する
     * @param v 追加する要素
     */
    add(v) {
        this._array.pushBack(v);
    }
    /**
     * 要素をコンテナで返す(csmVector<Value>)
     */
    getVector(defaultValue = null) {
        return this._array;
    }
    /**
     * 要素の数を返す
     */
    getSize() {
        return this._array.getSize();
    }
}
/**
 * パースしたJSONの要素をマップとして持つ
 */
export class JsonMap extends Value {
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._map = new csmMap();
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        const ite = this._map.begin();
        while (ite.notEqual(this._map.end())) {
            let v = ite.ptr().second;
            if (v && !v.isStatic()) {
                v = void 0;
                v = null;
            }
            ite.preIncrement();
        }
    }
    /**
     * Valueの値がMap型ならtrue
     */
    isMap() {
        return true;
    }
    /**
     * 添字演算子[string | csmString]
     */
    getValueByString(s) {
        if (s instanceof csmString) {
            const ret = this._map.getValue(s.s);
            if (ret == null) {
                return Value.nullValue;
            }
            return ret;
        }
        for (let iter = this._map.begin(); iter.notEqual(this._map.end()); iter.preIncrement()) {
            if (iter.ptr().first == s) {
                if (iter.ptr().second == null) {
                    return Value.nullValue;
                }
                return iter.ptr().second;
            }
        }
        return Value.nullValue;
    }
    /**
     * 添字演算子[index]
     */
    getValueByIndex(index) {
        return Value.errorValue.setErrorNotForClientCall(CSM_JSON_ERROR_TYPE_MISMATCH);
    }
    /**
     * 要素を文字列で返す(csmString型)
     */
    getString(defaultValue, indent) {
        this._stringBuffer = indent + '{\n';
        const ite = this._map.begin();
        while (ite.notEqual(this._map.end())) {
            const key = ite.ptr().first;
            const v = ite.ptr().second;
            this._stringBuffer +=
                indent + ' ' + key + ' : ' + v.getString(indent + '   ') + ' \n';
            ite.preIncrement();
        }
        this._stringBuffer += indent + '}\n';
        return this._stringBuffer;
    }
    /**
     * 要素をMap型で返す
     */
    getMap(defaultValue) {
        return this._map;
    }
    /**
     * Mapに要素を追加する
     */
    put(key, v) {
        this._map.setValue(key, v);
    }
    /**
     * Mapからキーのリストを取得する
     */
    getKeys() {
        if (!this._keys) {
            this._keys = new csmVector();
            const ite = this._map.begin();
            while (ite.notEqual(this._map.end())) {
                const key = ite.ptr().first;
                this._keys.pushBack(key);
                ite.preIncrement();
            }
        }
        return this._keys;
    }
    /**
     * Mapの要素数を取得する
     */
    getSize() {
        return this._keys.getSize();
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismjson';
import { CubismJsonExtension } from './cubismjsonextension';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismJson = $.CubismJson;
    Live2DCubismFramework.JsonArray = $.JsonArray;
    Live2DCubismFramework.JsonBoolean = $.JsonBoolean;
    Live2DCubismFramework.JsonError = $.JsonError;
    Live2DCubismFramework.JsonFloat = $.JsonFloat;
    Live2DCubismFramework.JsonMap = $.JsonMap;
    Live2DCubismFramework.JsonNullvalue = $.JsonNullvalue;
    Live2DCubismFramework.JsonString = $.JsonString;
    Live2DCubismFramework.Value = $.Value;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismjson.js.map