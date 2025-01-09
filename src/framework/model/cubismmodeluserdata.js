/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismFramework } from '../live2dcubismframework';
import { csmString } from '../type/csmstring';
import { csmVector } from '../type/csmvector';
import { CubismModelUserDataJson } from './cubismmodeluserdatajson';
const ArtMesh = 'ArtMesh';
/**
 * ユーザーデータインターフェース
 *
 * Jsonから読み込んだユーザーデータを記録しておくための構造体
 */
export class CubismModelUserDataNode {
}
/**
 * ユーザデータの管理クラス
 *
 * ユーザデータをロード、管理、検索インターフェイス、解放までを行う。
 */
export class CubismModelUserData {
    /**
     * インスタンスの作成
     *
     * @param buffer    userdata3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     * @return 作成されたインスタンス
     */
    static create(buffer, size) {
        const ret = new CubismModelUserData();
        ret.parseUserData(buffer, size);
        return ret;
    }
    /**
     * インスタンスを破棄する
     *
     * @param modelUserData 破棄するインスタンス
     */
    static delete(modelUserData) {
        if (modelUserData != null) {
            modelUserData.release();
            modelUserData = null;
        }
    }
    /**
     * ArtMeshのユーザーデータのリストの取得
     *
     * @return ユーザーデータリスト
     */
    getArtMeshUserDatas() {
        return this._artMeshUserDataNode;
    }
    /**
     * userdata3.jsonのパース
     *
     * @param buffer    userdata3.jsonが読み込まれているバッファ
     * @param size      バッファのサイズ
     */
    parseUserData(buffer, size) {
        let json = new CubismModelUserDataJson(buffer, size);
        if (!json) {
            json.release();
            json = void 0;
            return;
        }
        const typeOfArtMesh = CubismFramework.getIdManager().getId(ArtMesh);
        const nodeCount = json.getUserDataCount();
        for (let i = 0; i < nodeCount; i++) {
            const addNode = new CubismModelUserDataNode();
            addNode.targetId = json.getUserDataId(i);
            addNode.targetType = CubismFramework.getIdManager().getId(json.getUserDataTargetType(i));
            addNode.value = new csmString(json.getUserDataValue(i));
            this._userDataNodes.pushBack(addNode);
            if (addNode.targetType == typeOfArtMesh) {
                this._artMeshUserDataNode.pushBack(addNode);
            }
        }
        json.release();
        json = void 0;
    }
    /**
     * コンストラクタ
     */
    constructor() {
        this._userDataNodes = new csmVector();
        this._artMeshUserDataNode = new csmVector();
    }
    /**
     * デストラクタ相当の処理
     *
     * ユーザーデータ構造体配列を解放する
     */
    release() {
        for (let i = 0; i < this._userDataNodes.getSize(); ++i) {
            this._userDataNodes.set(i, null);
        }
        this._userDataNodes = null;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismmodeluserdata';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismModelUserData = $.CubismModelUserData;
    Live2DCubismFramework.CubismModelUserDataNode = $.CubismModelUserDataNode;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmodeluserdata.js.map