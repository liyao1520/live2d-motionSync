/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismModel } from '../model/cubismmodel';
import { csmVector } from '../type/csmvector';
import { CubismRenderer_WebGL } from './cubismrenderer_webgl';
/**
 * WebGL用のシェーダープログラムを生成・破棄するクラス
 * シングルトンなクラスであり、CubismShader_WebGL.getInstanceからアクセスする。
 */
export declare class CubismShader_WebGL {
    /**
     * インスタンスを取得する（シングルトン）
     * @return インスタンス
     */
    static getInstance(): CubismShader_WebGL;
    /**
     * インスタンスを開放する（シングルトン）
     */
    static deleteInstance(): void;
    /**
     * privateなコンストラクタ
     */
    private constructor();
    /**
     * デストラクタ相当の処理
     */
    release(): void;
    /**
     * 描画用のシェーダプログラムの一連のセットアップを実行する
     * @param renderer レンダラー
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    setupShaderProgramForDraw(renderer: CubismRenderer_WebGL, model: Readonly<CubismModel>, index: number): void;
    /**
     * マスク用のシェーダプログラムの一連のセットアップを実行する
     * @param renderer レンダラー
     * @param model 描画対象のモデル
     * @param index 描画対象のメッシュのインデックス
     */
    setupShaderProgramForMask(renderer: CubismRenderer_WebGL, model: Readonly<CubismModel>, index: number): void;
    /**
     * シェーダープログラムを解放する
     */
    releaseShaderProgram(): void;
    /**
     * シェーダープログラムを初期化する
     * @param vertShaderSrc 頂点シェーダのソース
     * @param fragShaderSrc フラグメントシェーダのソース
     */
    generateShaders(): void;
    /**
     * シェーダプログラムをロードしてアドレスを返す
     * @param vertexShaderSource    頂点シェーダのソース
     * @param fragmentShaderSource  フラグメントシェーダのソース
     * @return シェーダプログラムのアドレス
     */
    loadShaderProgram(vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram;
    /**
     * シェーダープログラムをコンパイルする
     * @param shaderType シェーダタイプ(Vertex/Fragment)
     * @param shaderSource シェーダソースコード
     *
     * @return コンパイルされたシェーダープログラム
     */
    compileShaderSource(shaderType: GLenum, shaderSource: string): WebGLProgram;
    setGl(gl: WebGLRenderingContext): void;
    _shaderSets: csmVector<CubismShaderSet>;
    gl: WebGLRenderingContext;
}
/**
 * CubismShader_WebGLのインナークラス
 */
export declare class CubismShaderSet {
    shaderProgram: WebGLProgram;
    attributePositionLocation: GLuint;
    attributeTexCoordLocation: GLuint;
    uniformMatrixLocation: WebGLUniformLocation;
    uniformClipMatrixLocation: WebGLUniformLocation;
    samplerTexture0Location: WebGLUniformLocation;
    samplerTexture1Location: WebGLUniformLocation;
    uniformBaseColorLocation: WebGLUniformLocation;
    uniformChannelFlagLocation: WebGLUniformLocation;
    uniformMultiplyColorLocation: WebGLUniformLocation;
    uniformScreenColorLocation: WebGLUniformLocation;
}
export declare enum ShaderNames {
    ShaderNames_SetupMask = 0,
    ShaderNames_NormalPremultipliedAlpha = 1,
    ShaderNames_NormalMaskedPremultipliedAlpha = 2,
    ShaderNames_NomralMaskedInvertedPremultipliedAlpha = 3,
    ShaderNames_AddPremultipliedAlpha = 4,
    ShaderNames_AddMaskedPremultipliedAlpha = 5,
    ShaderNames_AddMaskedPremultipliedAlphaInverted = 6,
    ShaderNames_MultPremultipliedAlpha = 7,
    ShaderNames_MultMaskedPremultipliedAlpha = 8,
    ShaderNames_MultMaskedPremultipliedAlphaInverted = 9
}
export declare const vertexShaderSrcSetupMask: string;
export declare const fragmentShaderSrcsetupMask: string;
export declare const vertexShaderSrc: string;
export declare const vertexShaderSrcMasked: string;
export declare const fragmentShaderSrcPremultipliedAlpha: string;
export declare const fragmentShaderSrcMaskPremultipliedAlpha: string;
export declare const fragmentShaderSrcMaskInvertedPremultipliedAlpha: string;
import * as $ from './cubismshader_webgl';
export declare namespace Live2DCubismFramework {
    const CubismShaderSet: typeof $.CubismShaderSet;
    type CubismShaderSet = $.CubismShaderSet;
    const CubismShader_WebGL: typeof $.CubismShader_WebGL;
    type CubismShader_WebGL = $.CubismShader_WebGL;
    const ShaderNames: typeof $.ShaderNames;
    type ShaderNames = $.ShaderNames;
}
//# sourceMappingURL=cubismshader_webgl.d.ts.map