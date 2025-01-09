/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { csmString } from '../type/csmstring';
/**
 * パラメータ名・パーツ名・Drawable名を保持
 *
 * パラメータ名・パーツ名・Drawable名を保持するクラス。
 *
 * @note 指定したID文字列からCubismIdを取得する際はこのクラスの生成メソッドを呼ばず、
 *       CubismIdManager().getId(id)を使用してください
 */
export declare class CubismId {
    /**
     * 内部で使用するCubismIdクラス生成メソッド
     *
     * @param id ID文字列
     * @returns CubismId
     * @note 指定したID文字列からCubismIdを取得する際は
     *       CubismIdManager().getId(id)を使用してください
     */
    static createIdInternal(id: string | csmString): CubismId;
    /**
     * ID名を取得する
     */
    getString(): csmString;
    /**
     * idを比較
     * @param c 比較するid
     * @return 同じならばtrue,異なっていればfalseを返す
     */
    isEqual(c: string | csmString | CubismId): boolean;
    /**
     * idを比較
     * @param c 比較するid
     * @return 同じならばtrue,異なっていればfalseを返す
     */
    isNotEqual(c: string | csmString | CubismId): boolean;
    /**
     * プライベートコンストラクタ
     *
     * @note ユーザーによる生成は許可しません
     */
    private constructor();
    private _id;
}
export declare type CubismIdHandle = CubismId;
import * as $ from './cubismid';
export declare namespace Live2DCubismFramework {
    const CubismId: typeof $.CubismId;
    type CubismId = $.CubismId;
    type CubismIdHandle = $.CubismIdHandle;
}
//# sourceMappingURL=cubismid.d.ts.map