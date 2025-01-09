/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CSM_ASSERT, CubismLogError } from '../utils/cubismdebug';
import { CubismModel } from './cubismmodel';
/**
 * Mocデータの管理
 *
 * Mocデータの管理を行うクラス。
 */
export class CubismMoc {
    /**
     * Mocデータの作成
     */
    static create(mocBytes, shouldCheckMocConsistency) {
        let cubismMoc = null;
        if (shouldCheckMocConsistency) {
            // .moc3の整合性を確認
            const consistency = this.hasMocConsistency(mocBytes);
            if (!consistency) {
                // 整合性が確認できなければ処理しない
                CubismLogError(`Inconsistent MOC3.`);
                return cubismMoc;
            }
        }
        const moc = Live2DCubismCore.Moc.fromArrayBuffer(mocBytes);
        if (moc) {
            cubismMoc = new CubismMoc(moc);
            cubismMoc._mocVersion = Live2DCubismCore.Version.csmGetMocVersion(moc, mocBytes);
        }
        return cubismMoc;
    }
    /**
     * Mocデータを削除
     *
     * Mocデータを削除する
     */
    static delete(moc) {
        moc._moc._release();
        moc._moc = null;
        moc = null;
    }
    /**
     * モデルを作成する
     *
     * @return Mocデータから作成されたモデル
     */
    createModel() {
        let cubismModel = null;
        const model = Live2DCubismCore.Model.fromMoc(this._moc);
        if (model) {
            cubismModel = new CubismModel(model);
            cubismModel.initialize();
            ++this._modelCount;
        }
        return cubismModel;
    }
    /**
     * モデルを削除する
     */
    deleteModel(model) {
        if (model != null) {
            model.release();
            model = null;
            --this._modelCount;
        }
    }
    /**
     * コンストラクタ
     */
    constructor(moc) {
        this._moc = moc;
        this._modelCount = 0;
        this._mocVersion = 0;
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        CSM_ASSERT(this._modelCount == 0);
        this._moc._release();
        this._moc = null;
    }
    /**
     * 最新の.moc3 Versionを取得
     */
    getLatestMocVersion() {
        return Live2DCubismCore.Version.csmGetLatestMocVersion();
    }
    /**
     * 読み込んだモデルの.moc3 Versionを取得
     */
    getMocVersion() {
        return this._mocVersion;
    }
    /**
     * .moc3 の整合性を検証する
     */
    static hasMocConsistency(mocBytes) {
        const isConsistent = Live2DCubismCore.Moc.prototype.hasMocConsistency(mocBytes);
        return isConsistent === 1 ? true : false;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismmoc';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMoc = $.CubismMoc;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmoc.js.map