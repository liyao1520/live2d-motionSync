/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismModel } from '../model/cubismmodel';
import { csmMap } from '../type/csmmap';
import { csmVector } from '../type/csmvector';
import { CubismClippingManager } from './cubismclippingmanager';
import { CubismClippingContext, CubismRenderer } from './cubismrenderer';
/**
 * クリッピングマスクの処理を実行するクラス
 */
export declare class CubismClippingManager_WebGL extends CubismClippingManager<CubismClippingContext_WebGL> {
    /**
     * テンポラリのレンダーテクスチャのアドレスを取得する
     * FrameBufferObjectが存在しない場合、新しく生成する
     *
     * @return レンダーテクスチャの配列
     */
    getMaskRenderTexture(): csmVector<WebGLFramebuffer>;
    /**
     * WebGLレンダリングコンテキストを設定する
     * @param gl WebGLレンダリングコンテキスト
     */
    setGL(gl: WebGLRenderingContext): void;
    /**
     * コンストラクタ
     */
    constructor();
    /**
     * クリッピングコンテキストを作成する。モデル描画時に実行する。
     * @param model モデルのインスタンス
     * @param renderer レンダラのインスタンス
     */
    setupClippingContext(model: CubismModel, renderer: CubismRenderer_WebGL): void;
    /**
     * カラーバッファを取得する
     * @return カラーバッファ
     */
    getColorBuffer(): csmVector<WebGLTexture>;
    /**
     * マスクの合計数をカウント
     * @returns
     */
    getClippingMaskCount(): number;
    _currentMaskRenderTexture: WebGLFramebuffer;
    _maskRenderTextures: csmVector<WebGLFramebuffer>;
    _maskColorBuffers: csmVector<WebGLTexture>;
    _currentFrameNo: number;
    _maskTexture: CubismRenderTextureResource;
    gl: WebGLRenderingContext;
}
/**
 * レンダーテクスチャのリソースを定義する構造体
 * クリッピングマスクで使用する
 */
export declare class CubismRenderTextureResource {
    /**
     * 引数付きコンストラクタ
     * @param frameNo レンダラーのフレーム番号
     * @param texture テクスチャのアドレス
     */
    constructor(frameNo: number, texture: csmVector<WebGLFramebuffer>);
    frameNo: number;
    textures: csmVector<WebGLFramebuffer>;
}
/**
 * クリッピングマスクのコンテキスト
 */
export declare class CubismClippingContext_WebGL extends CubismClippingContext {
    /**
     * 引数付きコンストラクタ
     */
    constructor(manager: CubismClippingManager_WebGL, clippingDrawableIndices: Int32Array, clipCount: number);
    /**
     * このマスクを管理するマネージャのインスタンスを取得する
     * @return クリッピングマネージャのインスタンス
     */
    getClippingManager(): CubismClippingManager_WebGL;
    setGl(gl: WebGLRenderingContext): void;
    private _owner;
}
export declare class CubismRendererProfile_WebGL {
    private setGlEnable;
    private setGlEnableVertexAttribArray;
    save(): void;
    restore(): void;
    setGl(gl: WebGLRenderingContext): void;
    constructor();
    private _lastArrayBufferBinding;
    private _lastElementArrayBufferBinding;
    private _lastProgram;
    private _lastActiveTexture;
    private _lastTexture0Binding2D;
    private _lastTexture1Binding2D;
    private _lastVertexAttribArrayEnabled;
    private _lastScissorTest;
    private _lastBlend;
    private _lastStencilTest;
    private _lastDepthTest;
    private _lastCullFace;
    private _lastFrontFace;
    private _lastColorMask;
    private _lastBlending;
    private _lastFBO;
    private _lastViewport;
    gl: WebGLRenderingContext;
}
/**
 * WebGL用の描画命令を実装したクラス
 */
export declare class CubismRenderer_WebGL extends CubismRenderer {
    /**
     * レンダラの初期化処理を実行する
     * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
     *
     * @param model モデルのインスタンス
     * @param maskBufferCount バッファの生成数
     */
    initialize(model: CubismModel, maskBufferCount?: number): void;
    /**
     * WebGLテクスチャのバインド処理
     * CubismRendererにテクスチャを設定し、CubismRenderer内でその画像を参照するためのIndex値を戻り値とする
     * @param modelTextureNo セットするモデルテクスチャの番号
     * @param glTextureNo WebGLテクスチャの番号
     */
    bindTexture(modelTextureNo: number, glTexture: WebGLTexture): void;
    /**
     * WebGLにバインドされたテクスチャのリストを取得する
     * @return テクスチャのリスト
     */
    getBindedTextures(): csmMap<number, WebGLTexture>;
    /**
     * クリッピングマスクバッファのサイズを設定する
     * マスク用のFrameBufferを破棄、再作成する為処理コストは高い
     * @param size クリッピングマスクバッファのサイズ
     */
    setClippingMaskBufferSize(size: number): void;
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    getClippingMaskBufferSize(): number;
    /**
     * レンダーテクスチャの枚数を取得する
     * @return レンダーテクスチャの枚数
     */
    getRenderTextureCount(): number;
    /**
     * コンストラクタ
     */
    constructor();
    /**
     * デストラクタ相当の処理
     */
    release(): void;
    /**
     * モデルを描画する実際の処理
     */
    doDrawModel(): void;
    /**
     * 描画オブジェクト（アートメッシュ）を描画する。
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    drawMeshWebGL(model: Readonly<CubismModel>, index: number): void;
    protected saveProfile(): void;
    protected restoreProfile(): void;
    /**
     * レンダラが保持する静的なリソースを解放する
     * WebGLの静的なシェーダープログラムを解放する
     */
    static doStaticRelease(): void;
    /**
     * レンダーステートを設定する
     * @param fbo アプリケーション側で指定しているフレームバッファ
     * @param viewport ビューポート
     */
    setRenderState(fbo: WebGLFramebuffer, viewport: number[]): void;
    /**
     * 描画開始時の追加処理
     * モデルを描画する前にクリッピングマスクに必要な処理を実装している
     */
    preDraw(): void;
    /**
     * マスクテクスチャに描画するクリッピングコンテキストをセットする
     */
    setClippingContextBufferForMask(clip: CubismClippingContext_WebGL): void;
    /**
     * マスクテクスチャに描画するクリッピングコンテキストを取得する
     * @return マスクテクスチャに描画するクリッピングコンテキスト
     */
    getClippingContextBufferForMask(): CubismClippingContext_WebGL;
    /**
     * 画面上に描画するクリッピングコンテキストをセットする
     */
    setClippingContextBufferForDraw(clip: CubismClippingContext_WebGL): void;
    /**
     * 画面上に描画するクリッピングコンテキストを取得する
     * @return 画面上に描画するクリッピングコンテキスト
     */
    getClippingContextBufferForDraw(): CubismClippingContext_WebGL;
    /**
     * マスク生成時かを判定する
     * @returns 判定値
     */
    isGeneratingMask(): boolean;
    /**
     * glの設定
     */
    startUp(gl: WebGLRenderingContext): void;
    _textures: csmMap<number, WebGLTexture>;
    _sortedDrawableIndexList: csmVector<number>;
    _clippingManager: CubismClippingManager_WebGL;
    _clippingContextBufferForMask: CubismClippingContext_WebGL;
    _clippingContextBufferForDraw: CubismClippingContext_WebGL;
    _rendererProfile: CubismRendererProfile_WebGL;
    firstDraw: boolean;
    _bufferData: {
        vertex: WebGLBuffer;
        uv: WebGLBuffer;
        index: WebGLBuffer;
    };
    _extension: any;
    gl: WebGLRenderingContext;
}
import * as $ from './cubismrenderer_webgl';
export declare namespace Live2DCubismFramework {
    const CubismClippingContext: typeof CubismClippingContext_WebGL;
    type CubismClippingContext = $.CubismClippingContext_WebGL;
    const CubismClippingManager_WebGL: typeof $.CubismClippingManager_WebGL;
    type CubismClippingManager_WebGL = $.CubismClippingManager_WebGL;
    const CubismRenderTextureResource: typeof $.CubismRenderTextureResource;
    type CubismRenderTextureResource = $.CubismRenderTextureResource;
    const CubismRenderer_WebGL: typeof $.CubismRenderer_WebGL;
    type CubismRenderer_WebGL = $.CubismRenderer_WebGL;
}
//# sourceMappingURL=cubismrenderer_webgl.d.ts.map