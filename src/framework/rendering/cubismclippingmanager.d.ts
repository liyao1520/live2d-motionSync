/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { csmVector } from '../type/csmvector';
import { csmRect } from '../type/csmrectf';
import { CubismMatrix44 } from '../math/cubismmatrix44';
import { CubismModel } from '../model/cubismmodel';
import { CubismClippingContext, CubismTextureColor } from './cubismrenderer';
export type ClippingContextConstructor<T_ClippingContext extends CubismClippingContext> = new (manager: CubismClippingManager<T_ClippingContext>, drawableMasks: Int32Array, drawableMaskCounts: number) => T_ClippingContext;
export interface ICubismClippingManager {
    getClippingMaskBufferSize(): number;
}
export declare abstract class CubismClippingManager<T_ClippingContext extends CubismClippingContext> implements ICubismClippingManager {
    /**
     * コンストラクタ
     */
    constructor(clippingContextFactory: ClippingContextConstructor<T_ClippingContext>);
    /**
     * デストラクタ相当の処理
     */
    release(): void;
    /**
     * マネージャの初期化処理
     * クリッピングマスクを使う描画オブジェクトの登録を行う
     * @param model モデルのインスタンス
     * @param renderTextureCount バッファの生成数
     */
    initialize(model: CubismModel, renderTextureCount: number): void;
    /**
     * 既にマスクを作っているかを確認
     * 作っている様であれば該当するクリッピングマスクのインスタンスを返す
     * 作っていなければNULLを返す
     * @param drawableMasks 描画オブジェクトをマスクする描画オブジェクトのリスト
     * @param drawableMaskCounts 描画オブジェクトをマスクする描画オブジェクトの数
     * @return 該当するクリッピングマスクが存在すればインスタンスを返し、なければNULLを返す
     */
    findSameClip(drawableMasks: Int32Array, drawableMaskCounts: number): T_ClippingContext;
    /**
     * 高精細マスク処理用の行列を計算する
     * @param model モデルのインスタンス
     * @param isRightHanded 処理が右手系であるか
     */
    setupMatrixForHighPrecision(model: CubismModel, isRightHanded: boolean): void;
    /**
     * マスク作成・描画用の行列を作成する。
     * @param isRightHanded 座標を右手系として扱うかを指定
     * @param layoutBoundsOnTex01 マスクを収める領域
     * @param scaleX 描画オブジェクトの伸縮率
     * @param scaleY 描画オブジェクトの伸縮率
     */
    createMatrixForMask(isRightHanded: boolean, layoutBoundsOnTex01: csmRect, scaleX: number, scaleY: number): void;
    /**
     * クリッピングコンテキストを配置するレイアウト
     * 指定された数のレンダーテクスチャを極力いっぱいに使ってマスクをレイアウトする
     * マスクグループの数が4以下ならRGBA各チャンネルに一つずつマスクを配置し、5以上6以下ならRGBAを2,2,1,1と配置する。
     *
     * @param usingClipCount 配置するクリッピングコンテキストの数
     */
    setupLayoutBounds(usingClipCount: number): void;
    /**
     * マスクされる描画オブジェクト群全体を囲む矩形（モデル座標系）を計算する
     * @param model モデルのインスタンス
     * @param clippingContext クリッピングマスクのコンテキスト
     */
    calcClippedDrawTotalBounds(model: CubismModel, clippingContext: T_ClippingContext): void;
    /**
     * 画面描画に使用するクリッピングマスクのリストを取得する
     * @return 画面描画に使用するクリッピングマスクのリスト
     */
    getClippingContextListForDraw(): csmVector<T_ClippingContext>;
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    getClippingMaskBufferSize(): number;
    /**
     * このバッファのレンダーテクスチャの枚数を取得する
     * @return このバッファのレンダーテクスチャの枚数
     */
    getRenderTextureCount(): number;
    /**
     * カラーチャンネル（RGBA）のフラグを取得する
     * @param channelNo カラーチャンネル（RGBA）の番号（0:R, 1:G, 2:B, 3:A）
     */
    getChannelFlagAsColor(channelNo: number): CubismTextureColor;
    /**
     * クリッピングマスクバッファのサイズを設定する
     * @param size クリッピングマスクバッファのサイズ
     */
    setClippingMaskBufferSize(size: number): void;
    protected _clearedFrameBufferFlags: csmVector<boolean>;
    protected _channelColors: csmVector<CubismTextureColor>;
    protected _clippingContextListForMask: csmVector<T_ClippingContext>;
    protected _clippingContextListForDraw: csmVector<T_ClippingContext>;
    protected _clippingMaskBufferSize: number;
    protected _renderTextureCount: number;
    protected _tmpMatrix: CubismMatrix44;
    protected _tmpMatrixForMask: CubismMatrix44;
    protected _tmpMatrixForDraw: CubismMatrix44;
    protected _tmpBoundsOnModel: csmRect;
    protected _clippingContexttConstructor: ClippingContextConstructor<T_ClippingContext>;
}
//# sourceMappingURL=cubismclippingmanager.d.ts.map