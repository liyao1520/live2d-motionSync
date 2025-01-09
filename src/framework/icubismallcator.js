/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */
/**
 * メモリアロケーションを抽象化したクラス
 *
 * メモリ確保・解放処理をプラットフォーム側で実装して
 * フレームワークから呼び出すためのインターフェース
 */
export class ICubismAllocator {
}
// Namespace definition for compatibility.
import * as $ from './icubismallcator';
// eslint-disable-next-line @typescript-eslint/no-namespace
export var Live2DCubismFramework;
(function (Live2DCubismFramework) {
    Live2DCubismFramework.ICubismAllocator = $.ICubismAllocator;
})(Live2DCubismFramework || (Live2DCubismFramework = {}));
//# sourceMappingURL=icubismallcator.js.map