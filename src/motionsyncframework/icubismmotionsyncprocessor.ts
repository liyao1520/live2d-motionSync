/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmVector } from '../framework/type/csmvector';
import { CubismMotionSyncEngineAnalysisResult } from './cubismmotionsyncengineanalysisresult';
import { CubismMotionSyncEngineMappingInfo } from './cubismmotionsyncenginemappinginfo';
import { EngineType, MotionSyncContext } from './cubismmotionsyncutil';
import { ICubismMotionSyncEngine } from './icubismmotionsyncengine';

export abstract class ICubismMotionSyncProcessor {
  /**
   * createAnalysisResult
   */
  public createAnalysisResult(): CubismMotionSyncEngineAnalysisResult {
    if (this.isClosed() || this._mappingInfoArray.getSize() < 1) {
      return new CubismMotionSyncEngineAnalysisResult(0);
    }

    return new CubismMotionSyncEngineAnalysisResult(
      this._mappingInfoArray.at(0).getModelParameterValues().getSize()
    );
  }

  /**
   * isClosed
   */
  public isClosed(): boolean {
    return this._contextHandle == null;
  }

  public Close(): void {
    // 解放済みなら何もしない。
    if (this.isClosed()) {
      return;
    }
    this._contextHandle.release();
    this._contextHandle = void 0;
    this._contextHandle = null;
    this._engine.DeleteAssociation(this);
  }

  public getContextHandle(): MotionSyncContext {
    return this._contextHandle;
  }

  public getEngine(): ICubismMotionSyncEngine {
    return this._engine;
  }

  public getType(): EngineType {
    return this._engine.getType();
  }

  public getRequireSampleCount() {
    if (
      !this.getEngine()?.getEngineHandle() ||
      !this.getContextHandle()?.getContext()
    ) {
      return 0;
    }
    return this.getEngine()
      .getEngineHandle()
      .getRequireSampleCount(this.getContextHandle().getContext());
  }

  public constructor(
    engine: ICubismMotionSyncEngine,
    contextHandle: MotionSyncContext,
    mappingList: csmVector<CubismMotionSyncEngineMappingInfo>
  ) {
    this._engine = engine;
    this._contextHandle = contextHandle;
    this._mappingInfoArray = mappingList;
  }

  private _engine: ICubismMotionSyncEngine;
  private _contextHandle: MotionSyncContext;
  private _mappingInfoArray: csmVector<CubismMotionSyncEngineMappingInfo>;
}

// Namespace definition for compatibility.
import * as $ from './icubismmotionsyncprocessor';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const ICubismMotionSyncProcessor = $.ICubismMotionSyncProcessor;
  export type ICubismMotionSyncProcessor = $.ICubismMotionSyncProcessor;
}
