/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismFramework } from '../live2dcubismframework';
import { CubismVector2 } from '../math/cubismvector2';
import { CubismJson } from '../utils/cubismjson';
// JSON keys
const Position = 'Position';
const X = 'X';
const Y = 'Y';
const Angle = 'Angle';
const Type = 'Type';
const Id = 'Id';
// Meta
const Meta = 'Meta';
const EffectiveForces = 'EffectiveForces';
const TotalInputCount = 'TotalInputCount';
const TotalOutputCount = 'TotalOutputCount';
const PhysicsSettingCount = 'PhysicsSettingCount';
const Gravity = 'Gravity';
const Wind = 'Wind';
const VertexCount = 'VertexCount';
const Fps = 'Fps';
// PhysicsSettings
const PhysicsSettings = 'PhysicsSettings';
const Normalization = 'Normalization';
const Minimum = 'Minimum';
const Maximum = 'Maximum';
const Default = 'Default';
const Reflect = 'Reflect';
const Weight = 'Weight';
// Input
const Input = 'Input';
const Source = 'Source';
// Output
const Output = 'Output';
const Scale = 'Scale';
const VertexIndex = 'VertexIndex';
const Destination = 'Destination';
// Particle
const Vertices = 'Vertices';
const Mobility = 'Mobility';
const Delay = 'Delay';
const Radius = 'Radius';
const Acceleration = 'Acceleration';
/**
 * physics3.jsonのコンテナ。
 */
export class CubismPhysicsJson {
    /**
     * コンストラクタ
     * @param buffer physics3.jsonが読み込まれているバッファ
     * @param size バッファのサイズ
     */
    constructor(buffer, size) {
        this._json = CubismJson.create(buffer, size);
    }
    /**
     * デストラクタ相当の処理
     */
    release() {
        CubismJson.delete(this._json);
    }
    /**
     * 重力の取得
     * @return 重力
     */
    getGravity() {
        const ret = new CubismVector2(0, 0);
        ret.x = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Gravity)
            .getValueByString(X)
            .toFloat();
        ret.y = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Gravity)
            .getValueByString(Y)
            .toFloat();
        return ret;
    }
    /**
     * 風の取得
     * @return 風
     */
    getWind() {
        const ret = new CubismVector2(0, 0);
        ret.x = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Wind)
            .getValueByString(X)
            .toFloat();
        ret.y = this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(EffectiveForces)
            .getValueByString(Wind)
            .getValueByString(Y)
            .toFloat();
        return ret;
    }
    /**
     * 物理演算設定FPSの取得
     * @return 物理演算設定FPS
     */
    getFps() {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(Fps)
            .toFloat(0.0);
    }
    /**
     * 物理店の管理の個数の取得
     * @return 物理店の管理の個数
     */
    getSubRigCount() {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(PhysicsSettingCount)
            .toInt();
    }
    /**
     * 入力の総合計の取得
     * @return 入力の総合計
     */
    getTotalInputCount() {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalInputCount)
            .toInt();
    }
    /**
     * 出力の総合計の取得
     * @return 出力の総合計
     */
    getTotalOutputCount() {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(TotalOutputCount)
            .toInt();
    }
    /**
     * 物理点の個数の取得
     * @return 物理点の個数
     */
    getVertexCount() {
        return this._json
            .getRoot()
            .getValueByString(Meta)
            .getValueByString(VertexCount)
            .toInt();
    }
    /**
     * 正規化された位置の最小値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された位置の最小値
     */
    getNormalizationPositionMinimumValue(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Position)
            .getValueByString(Minimum)
            .toFloat();
    }
    /**
     * 正規化された位置の最大値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された位置の最大値
     */
    getNormalizationPositionMaximumValue(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Position)
            .getValueByString(Maximum)
            .toFloat();
    }
    /**
     * 正規化された位置のデフォルト値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された位置のデフォルト値
     */
    getNormalizationPositionDefaultValue(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Position)
            .getValueByString(Default)
            .toFloat();
    }
    /**
     * 正規化された角度の最小値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された角度の最小値
     */
    getNormalizationAngleMinimumValue(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Angle)
            .getValueByString(Minimum)
            .toFloat();
    }
    /**
     * 正規化された角度の最大値の取得
     * @param physicsSettingIndex
     * @return 正規化された角度の最大値
     */
    getNormalizationAngleMaximumValue(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Angle)
            .getValueByString(Maximum)
            .toFloat();
    }
    /**
     * 正規化された角度のデフォルト値の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 正規化された角度のデフォルト値
     */
    getNormalizationAngleDefaultValue(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Normalization)
            .getValueByString(Angle)
            .getValueByString(Default)
            .toFloat();
    }
    /**
     * 入力の個数の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 入力の個数
     */
    getInputCount(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getVector()
            .getSize();
    }
    /**
     * 入力の重みの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力の重み
     */
    getInputWeight(physicsSettingIndex, inputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Weight)
            .toFloat();
    }
    /**
     * 入力の反転の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力の反転
     */
    getInputReflect(physicsSettingIndex, inputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Reflect)
            .toBoolean();
    }
    /**
     * 入力の種類の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力の種類
     */
    getInputType(physicsSettingIndex, inputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Type)
            .getRawString();
    }
    /**
     * 入力元のIDの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param inputIndex 入力のインデックス
     * @return 入力元のID
     */
    getInputSourceId(physicsSettingIndex, inputIndex) {
        return CubismFramework.getIdManager().getId(this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Input)
            .getValueByIndex(inputIndex)
            .getValueByString(Source)
            .getValueByString(Id)
            .getRawString());
    }
    /**
     * 出力の個数の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @return 出力の個数
     */
    getOutputCount(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getVector()
            .getSize();
    }
    /**
     * 出力の物理点のインデックスの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の物理点のインデックス
     */
    getOutputVertexIndex(physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(VertexIndex)
            .toInt();
    }
    /**
     * 出力の角度のスケールを取得する
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の角度のスケール
     */
    getOutputAngleScale(physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Scale)
            .toFloat();
    }
    /**
     * 出力の重みの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の重み
     */
    getOutputWeight(physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Weight)
            .toFloat();
    }
    /**
     * 出力先のIDの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力先のID
     */
    getOutputDestinationId(physicsSettingIndex, outputIndex) {
        return CubismFramework.getIdManager().getId(this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Destination)
            .getValueByString(Id)
            .getRawString());
    }
    /**
     * 出力の種類の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の種類
     */
    getOutputType(physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Type)
            .getRawString();
    }
    /**
     * 出力の反転の取得
     * @param physicsSettingIndex 物理演算のインデックス
     * @param outputIndex 出力のインデックス
     * @return 出力の反転
     */
    getOutputReflect(physicsSettingIndex, outputIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Output)
            .getValueByIndex(outputIndex)
            .getValueByString(Reflect)
            .toBoolean();
    }
    /**
     * 物理点の個数の取得
     * @param physicsSettingIndex 物理演算男設定のインデックス
     * @return 物理点の個数
     */
    getParticleCount(physicsSettingIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getVector()
            .getSize();
    }
    /**
     * 物理点の動きやすさの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の動きやすさ
     */
    getParticleMobility(physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Mobility)
            .toFloat();
    }
    /**
     * 物理点の遅れの取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の遅れ
     */
    getParticleDelay(physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Delay)
            .toFloat();
    }
    /**
     * 物理点の加速度の取得
     * @param physicsSettingIndex 物理演算の設定
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の加速度
     */
    getParticleAcceleration(physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Acceleration)
            .toFloat();
    }
    /**
     * 物理点の距離の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexIndex 物理点のインデックス
     * @return 物理点の距離
     */
    getParticleRadius(physicsSettingIndex, vertexIndex) {
        return this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Radius)
            .toFloat();
    }
    /**
     * 物理点の位置の取得
     * @param physicsSettingIndex 物理演算の設定のインデックス
     * @param vertexInde 物理点のインデックス
     * @return 物理点の位置
     */
    getParticlePosition(physicsSettingIndex, vertexIndex) {
        const ret = new CubismVector2(0, 0);
        ret.x = this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Position)
            .getValueByString(X)
            .toFloat();
        ret.y = this._json
            .getRoot()
            .getValueByString(PhysicsSettings)
            .getValueByIndex(physicsSettingIndex)
            .getValueByString(Vertices)
            .getValueByIndex(vertexIndex)
            .getValueByString(Position)
            .getValueByString(Y)
            .toFloat();
        return ret;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismphysicsjson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPhysicsJson = $.CubismPhysicsJson;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismphysicsjson.js.map