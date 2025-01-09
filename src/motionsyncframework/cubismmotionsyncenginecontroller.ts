/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmMap, iterator } from '../framework/type/csmmap';
import { csmString } from '../framework/type/csmstring';
import { csmVector } from '../framework/type/csmvector';
import { CubismLogInfo } from '../framework/utils/cubismdebug';
import { CubismMotionSyncEngineCri } from './cubismmotionsyncenginecri';
import { CubismMotionSyncEngineLib } from './cubismmotionsyncenginelib';
import { CubismMotionSyncEngineVersion } from './cubismmotionsyncengineversion';
import { EngineType } from './cubismmotionsyncutil';
import { ICubismMotionSyncEngine } from './icubismmotionsyncengine';

export class CubismMotionSyncEngineController {
  public static initializeEngine(
    engineConfig: number
  ): ICubismMotionSyncEngine {
    let engineLib: CubismMotionSyncEngineLib = new CubismMotionSyncEngineLib();
    const engineName: csmString = engineLib.getEngineName();
    const engineType: EngineType = this.ToEngineType(engineName);
    const nativeVersion: number = engineLib.getEngineVersion();
    const version: CubismMotionSyncEngineVersion =
      new CubismMotionSyncEngineVersion(nativeVersion);

    if (!this._engineMap) {
      this._engineMap = new csmMap<EngineType, ICubismMotionSyncEngine>();
    }

    if (this._engineMap.isExist(engineType)) {
      engineLib = void 0;
      engineLib = null;
      return null;
    }

    CubismLogInfo(engineName.s + ' ' + version.toString());

    const isInitialized: boolean = engineLib.initializeEngine(engineConfig);

    if (!isInitialized) {
      engineLib = void 0;
      engineLib = null;
      return null;
    }

    let engine: ICubismMotionSyncEngine = null;
    switch (engineType) {
      case EngineType.EngineType_Cri:
        engine = new CubismMotionSyncEngineCri(
          engineLib,
          engineType,
          engineName,
          version
        );
        break;
      default:
        engineLib.disposeEngine();
        engineLib = void 0;
        engineLib = null;
        return null;
    }

    this._engineMap.appendKey(engineType);
    this._engineMap.setValue(engineType, engine);

    return engine;
  }

  public static getEngine(type: EngineType) {
    if (this._engineMap && this._engineMap.isExist(type)) {
      return this._engineMap.getValue(type);
    }
    return null;
  }

  public static getEngines(): csmVector<ICubismMotionSyncEngine> {
    const vector: csmVector<ICubismMotionSyncEngine> = new csmVector();
    for (
      let iter: iterator<EngineType, ICubismMotionSyncEngine> =
        this._engineMap.begin();
      iter != this._engineMap.end();
      iter.increment()
    ) {
      vector.pushBack(iter.ptr().second);
    }

    return vector;
  }

  public static releaseEngineNotForce(engine: ICubismMotionSyncEngine): void {
    this.releaseEngine(engine, false);
  }

  public static releaseEngine(
    engine: ICubismMotionSyncEngine,
    isForce: boolean
  ): void {
    engine.close(isForce);
  }

  public static deleteAllEngine(): void {
    const engines: csmVector<ICubismMotionSyncEngine> = this.getEngines();
    for (let index = 0; index < engines.getSize(); index++) {
      engines.at(index).close(true);
    }

    this._engineMap.clear();
  }

  public static ToEngineType(engineName: csmString): EngineType {
    let engineType: EngineType = EngineType.EngineType_Unknown;

    if (engineName.s == 'Live2DCubismMotionSyncEngine_CRI') {
      engineType = EngineType.EngineType_Cri;
    }

    return engineType;
  }

  public static deleteAssociation(engine: ICubismMotionSyncEngine) {
    for (
      let iter: iterator<EngineType, ICubismMotionSyncEngine> =
        this._engineMap.begin();
      iter != this._engineMap.end();
      iter.increment()
    ) {
      if (iter.ptr().first == engine.getType()) {
        engine = void 0;
        this._engineMap.erase(iter);
        break;
      }
    }
  }

  private static _engineMap: csmMap<EngineType, ICubismMotionSyncEngine>;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncenginecontroller';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSyncEngineController =
    $.CubismMotionSyncEngineController;
  export type CubismMotionSyncEngineController =
    $.CubismMotionSyncEngineController;
}
