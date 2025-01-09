/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { csmMap } from '../type/csmmap';
import { csmVector } from '../type/csmvector';
import { CubismLogError } from '../utils/cubismdebug';
import { CubismClippingManager } from './cubismclippingmanager';
import { CubismClippingContext, CubismRenderer } from './cubismrenderer';
import { CubismShader_WebGL } from './cubismshader_webgl';
let s_viewport;
let s_fbo;
/**
 * クリッピングマスクの処理を実行するクラス
 */
export class CubismClippingManager_WebGL extends CubismClippingManager {
    /**
     * テンポラリのレンダーテクスチャのアドレスを取得する
     * FrameBufferObjectが存在しない場合、新しく生成する
     *
     * @return レンダーテクスチャの配列
     */
    getMaskRenderTexture() {
        // テンポラリのRenderTextureを取得する
        if (this._maskTexture && this._maskTexture.textures != null) {
            // 前回使ったものを返す
            this._maskTexture.frameNo = this._currentFrameNo;
        }
        else {
            // FrameBufferObjectが存在しない場合、新しく生成する
            if (this._maskRenderTextures != null) {
                this._maskRenderTextures.clear();
            }
            this._maskRenderTextures = new csmVector();
            // ColorBufferObjectが存在しない場合、新しく生成する
            if (this._maskColorBuffers != null) {
                this._maskColorBuffers.clear();
            }
            this._maskColorBuffers = new csmVector();
            // クリッピングバッファサイズを取得
            const size = this._clippingMaskBufferSize;
            for (let index = 0; index < this._renderTextureCount; index++) {
                this._maskColorBuffers.pushBack(this.gl.createTexture()); // 直接代入
                this.gl.bindTexture(this.gl.TEXTURE_2D, this._maskColorBuffers.at(index));
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, size, size, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, null);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR);
                this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.LINEAR);
                this.gl.bindTexture(this.gl.TEXTURE_2D, null);
                this._maskRenderTextures.pushBack(this.gl.createFramebuffer());
                this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._maskRenderTextures.at(index));
                this.gl.framebufferTexture2D(this.gl.FRAMEBUFFER, this.gl.COLOR_ATTACHMENT0, this.gl.TEXTURE_2D, this._maskColorBuffers.at(index), 0);
            }
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo);
            this._maskTexture = new CubismRenderTextureResource(this._currentFrameNo, this._maskRenderTextures);
        }
        return this._maskTexture.textures;
    }
    /**
     * WebGLレンダリングコンテキストを設定する
     * @param gl WebGLレンダリングコンテキスト
     */
    setGL(gl) {
        this.gl = gl;
    }
    /**
     * コンストラクタ
     */
    constructor() {
        super(CubismClippingContext_WebGL);
    }
    /**
     * クリッピングコンテキストを作成する。モデル描画時に実行する。
     * @param model モデルのインスタンス
     * @param renderer レンダラのインスタンス
     */
    setupClippingContext(model, renderer) {
        this._currentFrameNo++;
        // 全てのクリッピングを用意する
        // 同じクリップ（複数の場合はまとめて一つのクリップ）を使う場合は1度だけ設定する
        let usingClipCount = 0;
        for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
            // 1つのクリッピングマスクに関して
            const cc = this._clippingContextListForMask.at(clipIndex);
            // このクリップを利用する描画オブジェクト群全体を囲む矩形を計算
            this.calcClippedDrawTotalBounds(model, cc);
            if (cc._isUsing) {
                usingClipCount++; // 使用中としてカウント
            }
        }
        // マスク作成処理
        if (usingClipCount > 0) {
            // 生成したFrameBufferと同じサイズでビューポートを設定
            this.gl.viewport(0, 0, this._clippingMaskBufferSize, this._clippingMaskBufferSize);
            // 後の計算のためにインデックスの最初をセット
            this._currentMaskRenderTexture = this.getMaskRenderTexture().at(0);
            renderer.preDraw(); // バッファをクリアする
            this.setupLayoutBounds(usingClipCount);
            // ---------- マスク描画処理 ----------
            // マスク用RenderTextureをactiveにセット
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentMaskRenderTexture);
            // サイズがレンダーテクスチャの枚数と合わない場合は合わせる
            if (this._clearedFrameBufferFlags.getSize() != this._renderTextureCount) {
                this._clearedFrameBufferFlags.clear();
                this._clearedFrameBufferFlags = new csmVector(this._renderTextureCount);
            }
            // マスクのクリアフラグを毎フレーム開始時に初期化
            for (let index = 0; index < this._clearedFrameBufferFlags.getSize(); index++) {
                this._clearedFrameBufferFlags.set(index, false);
            }
            // 実際にマスクを生成する
            // 全てのマスクをどのようにレイアウトして描くかを決定し、ClipContext, ClippedDrawContextに記憶する
            for (let clipIndex = 0; clipIndex < this._clippingContextListForMask.getSize(); clipIndex++) {
                // --- 実際に1つのマスクを描く ---
                const clipContext = this._clippingContextListForMask.at(clipIndex);
                const allClipedDrawRect = clipContext._allClippedDrawRect; // このマスクを使う、すべての描画オブジェクトの論理座標上の囲み矩形
                const layoutBoundsOnTex01 = clipContext._layoutBounds; // この中にマスクを収める
                const margin = 0.05; // モデル座標上の矩形を、適宜マージンを付けて使う
                let scaleX = 0;
                let scaleY = 0;
                // clipContextに設定したレンダーテクスチャをインデックスで取得
                const clipContextRenderTexture = this.getMaskRenderTexture().at(clipContext._bufferIndex);
                // 現在のレンダーテクスチャがclipContextのものと異なる場合
                if (this._currentMaskRenderTexture != clipContextRenderTexture) {
                    this._currentMaskRenderTexture = clipContextRenderTexture;
                    renderer.preDraw(); // バッファをクリアする
                    // マスク用RenderTextureをactiveにセット
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this._currentMaskRenderTexture);
                }
                this._tmpBoundsOnModel.setRect(allClipedDrawRect);
                this._tmpBoundsOnModel.expand(allClipedDrawRect.width * margin, allClipedDrawRect.height * margin);
                //########## 本来は割り当てられた領域の全体を使わず必要最低限のサイズがよい
                // シェーダ用の計算式を求める。回転を考慮しない場合は以下のとおり
                // movePeriod' = movePeriod * scaleX + offX		  [[ movePeriod' = (movePeriod - tmpBoundsOnModel.movePeriod)*scale + layoutBoundsOnTex01.movePeriod ]]
                scaleX = layoutBoundsOnTex01.width / this._tmpBoundsOnModel.width;
                scaleY = layoutBoundsOnTex01.height / this._tmpBoundsOnModel.height;
                // マスク生成時に使う行列を求める
                {
                    // シェーダに渡す行列を求める <<<<<<<<<<<<<<<<<<<<<<<< 要最適化（逆順に計算すればシンプルにできる）
                    this._tmpMatrix.loadIdentity();
                    {
                        // layout0..1 を -1..1に変換
                        this._tmpMatrix.translateRelative(-1.0, -1.0);
                        this._tmpMatrix.scaleRelative(2.0, 2.0);
                    }
                    {
                        // view to layout0..1
                        this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                        this._tmpMatrix.scaleRelative(scaleX, scaleY); // new = [translate][scale]
                        this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                        // new = [translate][scale][translate]
                    }
                    // tmpMatrixForMaskが計算結果
                    this._tmpMatrixForMask.setMatrix(this._tmpMatrix.getArray());
                }
                //--------- draw時の mask 参照用行列を計算
                {
                    // シェーダに渡す行列を求める <<<<<<<<<<<<<<<<<<<<<<<< 要最適化（逆順に計算すればシンプルにできる）
                    this._tmpMatrix.loadIdentity();
                    {
                        this._tmpMatrix.translateRelative(layoutBoundsOnTex01.x, layoutBoundsOnTex01.y);
                        this._tmpMatrix.scaleRelative(scaleX, scaleY); // new = [translate][scale]
                        this._tmpMatrix.translateRelative(-this._tmpBoundsOnModel.x, -this._tmpBoundsOnModel.y);
                        // new = [translate][scale][translate]
                    }
                    this._tmpMatrixForDraw.setMatrix(this._tmpMatrix.getArray());
                }
                clipContext._matrixForMask.setMatrix(this._tmpMatrixForMask.getArray());
                clipContext._matrixForDraw.setMatrix(this._tmpMatrixForDraw.getArray());
                const clipDrawCount = clipContext._clippingIdCount;
                for (let i = 0; i < clipDrawCount; i++) {
                    const clipDrawIndex = clipContext._clippingIdList[i];
                    // 頂点情報が更新されておらず、信頼性がない場合は描画をパスする
                    if (!model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
                        continue;
                    }
                    renderer.setIsCulling(model.getDrawableCulling(clipDrawIndex) != false);
                    // マスクがクリアされていないなら処理する
                    if (!this._clearedFrameBufferFlags.at(clipContext._bufferIndex)) {
                        // マスクをクリアする
                        // (仮仕様) 1が無効（描かれない）領域、0が有効（描かれる）領域。（シェーダーCd*Csで0に近い値をかけてマスクを作る。1をかけると何も起こらない）
                        this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
                        this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                        this._clearedFrameBufferFlags.set(clipContext._bufferIndex, true);
                    }
                    // 今回専用の変換を適用して描く
                    // チャンネルも切り替える必要がある(A,R,G,B)
                    renderer.setClippingContextBufferForMask(clipContext);
                    renderer.drawMeshWebGL(model, clipDrawIndex);
                }
            }
            // --- 後処理 ---
            this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo); // 描画対象を戻す
            renderer.setClippingContextBufferForMask(null);
            this.gl.viewport(s_viewport[0], s_viewport[1], s_viewport[2], s_viewport[3]);
        }
    }
    /**
     * カラーバッファを取得する
     * @return カラーバッファ
     */
    getColorBuffer() {
        return this._maskColorBuffers;
    }
    /**
     * マスクの合計数をカウント
     * @returns
     */
    getClippingMaskCount() {
        return this._clippingContextListForMask.getSize();
    }
}
/**
 * レンダーテクスチャのリソースを定義する構造体
 * クリッピングマスクで使用する
 */
export class CubismRenderTextureResource {
    /**
     * 引数付きコンストラクタ
     * @param frameNo レンダラーのフレーム番号
     * @param texture テクスチャのアドレス
     */
    constructor(frameNo, texture) {
        this.frameNo = frameNo;
        this.textures = texture;
    }
}
/**
 * クリッピングマスクのコンテキスト
 */
export class CubismClippingContext_WebGL extends CubismClippingContext {
    /**
     * 引数付きコンストラクタ
     */
    constructor(manager, clippingDrawableIndices, clipCount) {
        super(clippingDrawableIndices, clipCount);
        this._owner = manager;
    }
    /**
     * このマスクを管理するマネージャのインスタンスを取得する
     * @return クリッピングマネージャのインスタンス
     */
    getClippingManager() {
        return this._owner;
    }
    setGl(gl) {
        this._owner.setGL(gl);
    }
}
export class CubismRendererProfile_WebGL {
    setGlEnable(index, enabled) {
        if (enabled)
            this.gl.enable(index);
        else
            this.gl.disable(index);
    }
    setGlEnableVertexAttribArray(index, enabled) {
        if (enabled)
            this.gl.enableVertexAttribArray(index);
        else
            this.gl.disableVertexAttribArray(index);
    }
    save() {
        if (this.gl == null) {
            CubismLogError("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
            return;
        }
        //-- push state --
        this._lastArrayBufferBinding = this.gl.getParameter(this.gl.ARRAY_BUFFER_BINDING);
        this._lastElementArrayBufferBinding = this.gl.getParameter(this.gl.ELEMENT_ARRAY_BUFFER_BINDING);
        this._lastProgram = this.gl.getParameter(this.gl.CURRENT_PROGRAM);
        this._lastActiveTexture = this.gl.getParameter(this.gl.ACTIVE_TEXTURE);
        this.gl.activeTexture(this.gl.TEXTURE1); //テクスチャユニット1をアクティブに（以後の設定対象とする）
        this._lastTexture1Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
        this.gl.activeTexture(this.gl.TEXTURE0); //テクスチャユニット0をアクティブに（以後の設定対象とする）
        this._lastTexture0Binding2D = this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
        this._lastVertexAttribArrayEnabled[0] = this.gl.getVertexAttrib(0, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastVertexAttribArrayEnabled[1] = this.gl.getVertexAttrib(1, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastVertexAttribArrayEnabled[2] = this.gl.getVertexAttrib(2, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastVertexAttribArrayEnabled[3] = this.gl.getVertexAttrib(3, this.gl.VERTEX_ATTRIB_ARRAY_ENABLED);
        this._lastScissorTest = this.gl.isEnabled(this.gl.SCISSOR_TEST);
        this._lastStencilTest = this.gl.isEnabled(this.gl.STENCIL_TEST);
        this._lastDepthTest = this.gl.isEnabled(this.gl.DEPTH_TEST);
        this._lastCullFace = this.gl.isEnabled(this.gl.CULL_FACE);
        this._lastBlend = this.gl.isEnabled(this.gl.BLEND);
        this._lastFrontFace = this.gl.getParameter(this.gl.FRONT_FACE);
        this._lastColorMask = this.gl.getParameter(this.gl.COLOR_WRITEMASK);
        // backup blending
        this._lastBlending[0] = this.gl.getParameter(this.gl.BLEND_SRC_RGB);
        this._lastBlending[1] = this.gl.getParameter(this.gl.BLEND_DST_RGB);
        this._lastBlending[2] = this.gl.getParameter(this.gl.BLEND_SRC_ALPHA);
        this._lastBlending[3] = this.gl.getParameter(this.gl.BLEND_DST_ALPHA);
        // モデル描画直前のFBOとビューポートを保存
        this._lastFBO = this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
        this._lastViewport = this.gl.getParameter(this.gl.VIEWPORT);
    }
    restore() {
        if (this.gl == null) {
            CubismLogError("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
            return;
        }
        this.gl.useProgram(this._lastProgram);
        this.setGlEnableVertexAttribArray(0, this._lastVertexAttribArrayEnabled[0]);
        this.setGlEnableVertexAttribArray(1, this._lastVertexAttribArrayEnabled[1]);
        this.setGlEnableVertexAttribArray(2, this._lastVertexAttribArrayEnabled[2]);
        this.setGlEnableVertexAttribArray(3, this._lastVertexAttribArrayEnabled[3]);
        this.setGlEnable(this.gl.SCISSOR_TEST, this._lastScissorTest);
        this.setGlEnable(this.gl.STENCIL_TEST, this._lastStencilTest);
        this.setGlEnable(this.gl.DEPTH_TEST, this._lastDepthTest);
        this.setGlEnable(this.gl.CULL_FACE, this._lastCullFace);
        this.setGlEnable(this.gl.BLEND, this._lastBlend);
        this.gl.frontFace(this._lastFrontFace);
        this.gl.colorMask(this._lastColorMask[0], this._lastColorMask[1], this._lastColorMask[2], this._lastColorMask[3]);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._lastArrayBufferBinding); //前にバッファがバインドされていたら破棄する必要がある
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._lastElementArrayBufferBinding);
        this.gl.activeTexture(this.gl.TEXTURE1); //テクスチャユニット1を復元
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture1Binding2D);
        this.gl.activeTexture(this.gl.TEXTURE0); //テクスチャユニット0を復元
        this.gl.bindTexture(this.gl.TEXTURE_2D, this._lastTexture0Binding2D);
        this.gl.activeTexture(this._lastActiveTexture);
        this.gl.blendFuncSeparate(this._lastBlending[0], this._lastBlending[1], this._lastBlending[2], this._lastBlending[3]);
    }
    setGl(gl) {
        this.gl = gl;
    }
    constructor() {
        this._lastVertexAttribArrayEnabled = new Array(4);
        this._lastColorMask = new Array(4);
        this._lastBlending = new Array(4);
        this._lastViewport = new Array(4);
    }
}
/**
 * WebGL用の描画命令を実装したクラス
 */
export class CubismRenderer_WebGL extends CubismRenderer {
    /**
     * レンダラの初期化処理を実行する
     * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
     *
     * @param model モデルのインスタンス
     * @param maskBufferCount バッファの生成数
     */
    initialize(model, maskBufferCount = 1) {
        if (model.isUsingMasking()) {
            this._clippingManager = new CubismClippingManager_WebGL(); // クリッピングマスク・バッファ前処理方式を初期化
            this._clippingManager.initialize(model, maskBufferCount);
        }
        this._sortedDrawableIndexList.resize(model.getDrawableCount(), 0);
        super.initialize(model); // 親クラスの処理を呼ぶ
    }
    /**
     * WebGLテクスチャのバインド処理
     * CubismRendererにテクスチャを設定し、CubismRenderer内でその画像を参照するためのIndex値を戻り値とする
     * @param modelTextureNo セットするモデルテクスチャの番号
     * @param glTextureNo WebGLテクスチャの番号
     */
    bindTexture(modelTextureNo, glTexture) {
        this._textures.setValue(modelTextureNo, glTexture);
    }
    /**
     * WebGLにバインドされたテクスチャのリストを取得する
     * @return テクスチャのリスト
     */
    getBindedTextures() {
        return this._textures;
    }
    /**
     * クリッピングマスクバッファのサイズを設定する
     * マスク用のFrameBufferを破棄、再作成する為処理コストは高い
     * @param size クリッピングマスクバッファのサイズ
     */
    setClippingMaskBufferSize(size) {
        // クリッピングマスクを利用しない場合は早期リターン
        if (!this._model.isUsingMasking()) {
            return;
        }
        // インスタンス破棄前にレンダーテクスチャの数を保存
        const renderTextureCount = this._clippingManager.getRenderTextureCount();
        // FrameBufferのサイズを変更するためにインスタンスを破棄・再作成する
        this._clippingManager.release();
        this._clippingManager = void 0;
        this._clippingManager = null;
        this._clippingManager = new CubismClippingManager_WebGL();
        this._clippingManager.setClippingMaskBufferSize(size);
        this._clippingManager.initialize(this.getModel(), renderTextureCount // インスタンス破棄前に保存したレンダーテクスチャの数
        );
    }
    /**
     * クリッピングマスクバッファのサイズを取得する
     * @return クリッピングマスクバッファのサイズ
     */
    getClippingMaskBufferSize() {
        return this._model.isUsingMasking()
            ? this._clippingManager.getClippingMaskBufferSize()
            : -1;
    }
    /**
     * レンダーテクスチャの枚数を取得する
     * @return レンダーテクスチャの枚数
     */
    getRenderTextureCount() {
        return this._model.isUsingMasking()
            ? this._clippingManager.getRenderTextureCount()
            : -1;
    }
    /**
     * コンストラクタ
     */
    constructor() {
        super();
        this._clippingContextBufferForMask = null;
        this._clippingContextBufferForDraw = null;
        this._rendererProfile = new CubismRendererProfile_WebGL();
        this.firstDraw = true;
        this._textures = new csmMap();
        this._sortedDrawableIndexList = new csmVector();
        this._bufferData = {
            vertex: (WebGLBuffer = null),
            uv: (WebGLBuffer = null),
            index: (WebGLBuffer = null)
        };
        // テクスチャ対応マップの容量を確保しておく
        this._textures.prepareCapacity(32, true);
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        if (this._clippingManager) {
            this._clippingManager.release();
            this._clippingManager = void 0;
            this._clippingManager = null;
        }
        if (this.gl == null) {
            return;
        }
        this.gl.deleteBuffer(this._bufferData.vertex);
        this._bufferData.vertex = null;
        this.gl.deleteBuffer(this._bufferData.uv);
        this._bufferData.uv = null;
        this.gl.deleteBuffer(this._bufferData.index);
        this._bufferData.index = null;
        this._bufferData = null;
        this._textures = null;
    }
    /**
     * モデルを描画する実際の処理
     */
    doDrawModel() {
        if (this.gl == null) {
            CubismLogError("'gl' is null. WebGLRenderingContext is required.\nPlease call 'CubimRenderer_WebGL.startUp' function.");
            return;
        }
        //------------ クリッピングマスク・バッファ前処理方式の場合 ------------
        if (this._clippingManager != null) {
            this.preDraw();
            if (this.isUsingHighPrecisionMask()) {
                this._clippingManager.setupMatrixForHighPrecision(this.getModel(), false);
            }
            else {
                this._clippingManager.setupClippingContext(this.getModel(), this);
            }
        }
        // 上記クリッピング処理内でも一度PreDrawを呼ぶので注意!!
        this.preDraw();
        const drawableCount = this.getModel().getDrawableCount();
        const renderOrder = this.getModel().getDrawableRenderOrders();
        // インデックスを描画順でソート
        for (let i = 0; i < drawableCount; ++i) {
            const order = renderOrder[i];
            this._sortedDrawableIndexList.set(order, i);
        }
        // 描画
        for (let i = 0; i < drawableCount; ++i) {
            const drawableIndex = this._sortedDrawableIndexList.at(i);
            // Drawableが表示状態でなければ処理をパスする
            if (!this.getModel().getDrawableDynamicFlagIsVisible(drawableIndex)) {
                continue;
            }
            const clipContext = this._clippingManager != null
                ? this._clippingManager
                    .getClippingContextListForDraw()
                    .at(drawableIndex)
                : null;
            if (clipContext != null && this.isUsingHighPrecisionMask()) {
                // 描くことになっていた
                if (clipContext._isUsing) {
                    // 生成したFrameBufferと同じサイズでビューポートを設定
                    this.gl.viewport(0, 0, this._clippingManager.getClippingMaskBufferSize(), this._clippingManager.getClippingMaskBufferSize());
                    this.preDraw(); // バッファをクリアする
                    // ---------- マスク描画処理 ----------
                    // マスク用RenderTextureをactiveにセット
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, clipContext
                        .getClippingManager()
                        .getMaskRenderTexture()
                        .at(clipContext._bufferIndex));
                    // マスクをクリアする
                    // (仮仕様) 1が無効（描かれない）領域、0が有効（描かれる）領域。（シェーダーCd*Csで0に近い値をかけてマスクを作る。1をかけると何も起こらない）
                    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
                    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
                }
                {
                    const clipDrawCount = clipContext._clippingIdCount;
                    for (let index = 0; index < clipDrawCount; index++) {
                        const clipDrawIndex = clipContext._clippingIdList[index];
                        // 頂点情報が更新されておらず、信頼性がない場合は描画をパスする
                        if (!this._model.getDrawableDynamicFlagVertexPositionsDidChange(clipDrawIndex)) {
                            continue;
                        }
                        this.setIsCulling(this._model.getDrawableCulling(clipDrawIndex) != false);
                        // 今回専用の変換を適用して描く
                        // チャンネルも切り替える必要がある(A,R,G,B)
                        this.setClippingContextBufferForMask(clipContext);
                        this.drawMeshWebGL(this._model, clipDrawIndex);
                    }
                }
                {
                    // --- 後処理 ---
                    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, s_fbo); // 描画対象を戻す
                    this.setClippingContextBufferForMask(null);
                    this.gl.viewport(s_viewport[0], s_viewport[1], s_viewport[2], s_viewport[3]);
                    this.preDraw(); // バッファをクリアする
                }
            }
            // クリッピングマスクをセットする
            this.setClippingContextBufferForDraw(clipContext);
            this.setIsCulling(this.getModel().getDrawableCulling(drawableIndex));
            this.drawMeshWebGL(this._model, drawableIndex);
        }
    }
    /**
     * 描画オブジェクト（アートメッシュ）を描画する。
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    drawMeshWebGL(model, index) {
        // 裏面描画の有効・無効
        if (this.isCulling()) {
            this.gl.enable(this.gl.CULL_FACE);
        }
        else {
            this.gl.disable(this.gl.CULL_FACE);
        }
        this.gl.frontFace(this.gl.CCW); // Cubism SDK OpenGLはマスク・アートメッシュ共にCCWが表面
        if (this.isGeneratingMask()) {
            CubismShader_WebGL.getInstance().setupShaderProgramForMask(this, model, index);
        }
        else {
            CubismShader_WebGL.getInstance().setupShaderProgramForDraw(this, model, index);
        }
        {
            const indexCount = model.getDrawableVertexIndexCount(index);
            this.gl.drawElements(this.gl.TRIANGLES, indexCount, this.gl.UNSIGNED_SHORT, 0);
        }
        // 後処理
        this.gl.useProgram(null);
        this.setClippingContextBufferForDraw(null);
        this.setClippingContextBufferForMask(null);
    }
    saveProfile() {
        this._rendererProfile.save();
    }
    restoreProfile() {
        this._rendererProfile.restore();
    }
    /**
     * レンダラが保持する静的なリソースを解放する
     * WebGLの静的なシェーダープログラムを解放する
     */
    static doStaticRelease() {
        CubismShader_WebGL.deleteInstance();
    }
    /**
     * レンダーステートを設定する
     * @param fbo アプリケーション側で指定しているフレームバッファ
     * @param viewport ビューポート
     */
    setRenderState(fbo, viewport) {
        s_fbo = fbo;
        s_viewport = viewport;
    }
    /**
     * 描画開始時の追加処理
     * モデルを描画する前にクリッピングマスクに必要な処理を実装している
     */
    preDraw() {
        if (this.firstDraw) {
            this.firstDraw = false;
        }
        this.gl.disable(this.gl.SCISSOR_TEST);
        this.gl.disable(this.gl.STENCIL_TEST);
        this.gl.disable(this.gl.DEPTH_TEST);
        // カリング（1.0beta3）
        this.gl.frontFace(this.gl.CW);
        this.gl.enable(this.gl.BLEND);
        this.gl.colorMask(true, true, true, true);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null); // 前にバッファがバインドされていたら破棄する必要がある
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        // 異方性フィルタリングを適用する
        if (this.getAnisotropy() > 0.0 && this._extension) {
            for (let i = 0; i < this._textures.getSize(); ++i) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, this._textures.getValue(i));
                this.gl.texParameterf(this.gl.TEXTURE_2D, this._extension.TEXTURE_MAX_ANISOTROPY_EXT, this.getAnisotropy());
            }
        }
    }
    /**
     * マスクテクスチャに描画するクリッピングコンテキストをセットする
     */
    setClippingContextBufferForMask(clip) {
        this._clippingContextBufferForMask = clip;
    }
    /**
     * マスクテクスチャに描画するクリッピングコンテキストを取得する
     * @return マスクテクスチャに描画するクリッピングコンテキスト
     */
    getClippingContextBufferForMask() {
        return this._clippingContextBufferForMask;
    }
    /**
     * 画面上に描画するクリッピングコンテキストをセットする
     */
    setClippingContextBufferForDraw(clip) {
        this._clippingContextBufferForDraw = clip;
    }
    /**
     * 画面上に描画するクリッピングコンテキストを取得する
     * @return 画面上に描画するクリッピングコンテキスト
     */
    getClippingContextBufferForDraw() {
        return this._clippingContextBufferForDraw;
    }
    /**
     * マスク生成時かを判定する
     * @returns 判定値
     */
    isGeneratingMask() {
        return this.getClippingContextBufferForMask() != null;
    }
    /**
     * glの設定
     */
    startUp(gl) {
        this.gl = gl;
        if (this._clippingManager) {
            this._clippingManager.setGL(gl);
        }
        CubismShader_WebGL.getInstance().setGl(gl);
        this._rendererProfile.setGl(gl);
        // 異方性フィルタリングが使用できるかチェック
        this._extension =
            this.gl.getExtension('EXT_texture_filter_anisotropic') ||
                this.gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic') ||
                this.gl.getExtension('MOZ_EXT_texture_filter_anisotropic');
    }
}
/**
 * レンダラが保持する静的なリソースを開放する
 */
CubismRenderer.staticRelease = () => {
    CubismRenderer_WebGL.doStaticRelease();
};
// Namespace definition for compatibility.
import * as $ from './cubismrenderer_webgl';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismClippingContext = $.CubismClippingContext_WebGL;
    Live2DCubismFramework.CubismClippingManager_WebGL = $.CubismClippingManager_WebGL;
    Live2DCubismFramework.CubismRenderTextureResource = $.CubismRenderTextureResource;
    Live2DCubismFramework.CubismRenderer_WebGL = $.CubismRenderer_WebGL;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismrenderer_webgl.js.map