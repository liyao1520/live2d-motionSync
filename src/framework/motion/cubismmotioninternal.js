/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
import { csmVector } from '../type/csmvector';
/**
 * @brief モーションカーブの種類
 *
 * モーションカーブの種類。
 */
export var CubismMotionCurveTarget;
(function (CubismMotionCurveTarget) {
    CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_Model"] = 0] = "CubismMotionCurveTarget_Model";
    CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_Parameter"] = 1] = "CubismMotionCurveTarget_Parameter";
    CubismMotionCurveTarget[CubismMotionCurveTarget["CubismMotionCurveTarget_PartOpacity"] = 2] = "CubismMotionCurveTarget_PartOpacity"; // パーツの不透明度に対して
})(CubismMotionCurveTarget || (CubismMotionCurveTarget = {}));
/**
 * @brief モーションカーブのセグメントの種類
 *
 * モーションカーブのセグメントの種類。
 */
export var CubismMotionSegmentType;
(function (CubismMotionSegmentType) {
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Linear"] = 0] = "CubismMotionSegmentType_Linear";
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Bezier"] = 1] = "CubismMotionSegmentType_Bezier";
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_Stepped"] = 2] = "CubismMotionSegmentType_Stepped";
    CubismMotionSegmentType[CubismMotionSegmentType["CubismMotionSegmentType_InverseStepped"] = 3] = "CubismMotionSegmentType_InverseStepped"; // インバースステップ
})(CubismMotionSegmentType || (CubismMotionSegmentType = {}));
/**
 * @brief モーションカーブの制御点
 *
 * モーションカーブの制御点。
 */
export class CubismMotionPoint {
    constructor() {
        this.time = 0.0; // 時間[秒]
        this.value = 0.0; // 値
    }
}
/**
 * @brief モーションカーブのセグメント
 *
 * モーションカーブのセグメント。
 */
export class CubismMotionSegment {
    /**
     * @brief コンストラクタ
     *
     * コンストラクタ。
     */
    constructor() {
        this.evaluate = null;
        this.basePointIndex = 0;
        this.segmentType = 0;
    }
}
/**
 * @brief モーションカーブ
 *
 * モーションカーブ。
 */
export class CubismMotionCurve {
    constructor() {
        this.type = CubismMotionCurveTarget.CubismMotionCurveTarget_Model;
        this.segmentCount = 0;
        this.baseSegmentIndex = 0;
        this.fadeInTime = 0.0;
        this.fadeOutTime = 0.0;
    }
}
/**
 * イベント。
 */
export class CubismMotionEvent {
    constructor() {
        this.fireTime = 0.0;
    }
}
/**
 * @brief モーションデータ
 *
 * モーションデータ。
 */
export class CubismMotionData {
    constructor() {
        this.duration = 0.0;
        this.loop = false;
        this.curveCount = 0;
        this.eventCount = 0;
        this.fps = 0.0;
        this.curves = new csmVector();
        this.segments = new csmVector();
        this.points = new csmVector();
        this.events = new csmVector();
    }
}
// Namespace definition for compatibility.
import * as $ from './cubismmotioninternal';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.CubismMotionCurve = $.CubismMotionCurve;
    Live2DCubismFramework.CubismMotionCurveTarget = $.CubismMotionCurveTarget;
    Live2DCubismFramework.CubismMotionData = $.CubismMotionData;
    Live2DCubismFramework.CubismMotionEvent = $.CubismMotionEvent;
    Live2DCubismFramework.CubismMotionPoint = $.CubismMotionPoint;
    Live2DCubismFramework.CubismMotionSegment = $.CubismMotionSegment;
    Live2DCubismFramework.CubismMotionSegmentType = $.CubismMotionSegmentType;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=cubismmotioninternal.js.map