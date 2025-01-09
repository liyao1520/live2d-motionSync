/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { CubismVector2 } from '../math/cubismvector2';
import { csmVector } from '../type/csmvector';
/**
 * 物理演算の適用先の種類
 */
export var CubismPhysicsTargetType;
(function (CubismPhysicsTargetType) {
    CubismPhysicsTargetType[CubismPhysicsTargetType["CubismPhysicsTargetType_Parameter"] = 0] = "CubismPhysicsTargetType_Parameter"; // パラメータに対して適用
})(CubismPhysicsTargetType || (CubismPhysicsTargetType = {}));
/**
 * 物理演算の入力の種類
 */
export var CubismPhysicsSource;
(function (CubismPhysicsSource) {
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_X"] = 0] = "CubismPhysicsSource_X";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Y"] = 1] = "CubismPhysicsSource_Y";
    CubismPhysicsSource[CubismPhysicsSource["CubismPhysicsSource_Angle"] = 2] = "CubismPhysicsSource_Angle"; // 角度から
})(CubismPhysicsSource || (CubismPhysicsSource = {}));
/**
 * @brief 物理演算で使用する外部の力
 *
 * 物理演算で使用する外部の力。
 */
export class PhysicsJsonEffectiveForces {
    constructor() {
        this.gravity = new CubismVector2(0, 0);
        this.wind = new CubismVector2(0, 0);
    }
}
/**
 * 物理演算のパラメータ情報
 */
export class CubismPhysicsParameter {
}
/**
 * 物理演算の正規化情報
 */
export class CubismPhysicsNormalization {
}
/**
 * 物理演算の演算委使用する物理点の情報
 */
export class CubismPhysicsParticle {
    constructor() {
        this.initialPosition = new CubismVector2(0, 0);
        this.position = new CubismVector2(0, 0);
        this.lastPosition = new CubismVector2(0, 0);
        this.lastGravity = new CubismVector2(0, 0);
        this.force = new CubismVector2(0, 0);
        this.velocity = new CubismVector2(0, 0);
    }
}
/**
 * 物理演算の物理点の管理
 */
export class CubismPhysicsSubRig {
    constructor() {
        this.normalizationPosition = new CubismPhysicsNormalization();
        this.normalizationAngle = new CubismPhysicsNormalization();
    }
}
/**
 * 物理演算の入力情報
 */
export class CubismPhysicsInput {
    constructor() {
        this.source = new CubismPhysicsParameter();
    }
}
/**
 * @brief 物理演算の出力情報
 *
 * 物理演算の出力情報。
 */
export class CubismPhysicsOutput {
    constructor() {
        this.destination = new CubismPhysicsParameter();
        this.translationScale = new CubismVector2(0, 0);
    }
}
/**
 * @brief 物理演算のデータ
 *
 * 物理演算のデータ。
 */
export class CubismPhysicsRig {
    constructor() {
        this.settings = new csmVector();
        this.inputs = new csmVector();
        this.outputs = new csmVector();
        this.particles = new csmVector();
        this.gravity = new CubismVector2(0, 0);
        this.wind = new CubismVector2(0, 0);
        this.fps = 0.0;
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismphysicsinternal';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismPhysicsInput = $.CubismPhysicsInput;
    Live2DCubismFramework.CubismPhysicsNormalization = $.CubismPhysicsNormalization;
    Live2DCubismFramework.CubismPhysicsOutput = $.CubismPhysicsOutput;
    Live2DCubismFramework.CubismPhysicsParameter = $.CubismPhysicsParameter;
    Live2DCubismFramework.CubismPhysicsParticle = $.CubismPhysicsParticle;
    Live2DCubismFramework.CubismPhysicsRig = $.CubismPhysicsRig;
    Live2DCubismFramework.CubismPhysicsSource = $.CubismPhysicsSource;
    Live2DCubismFramework.CubismPhysicsSubRig = $.CubismPhysicsSubRig;
    Live2DCubismFramework.CubismPhysicsTargetType = $.CubismPhysicsTargetType;
    Live2DCubismFramework.PhysicsJsonEffectiveForces = $.PhysicsJsonEffectiveForces;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismphysicsinternal.js.map