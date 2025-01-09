/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { JsonArray, JsonMap, Value } from './cubismjson';
/**
 * CubismJsonで実装されているJsonパーサを使用せず、
 * TypeScript標準のJsonパーサなどを使用し出力された結果を
 * Cubism SDKで定義されているJSONエレメントの要素に
 * 置き換える処理をするクラス。
 */
export declare class CubismJsonExtension {
    static parseJsonObject(obj: Value, map: JsonMap): JsonMap;
    protected static parseJsonArray(obj: Value): JsonArray;
}
//# sourceMappingURL=cubismjsonextension.d.ts.map