/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { csmVector } from '../framework/type/csmvector';
import { csmString } from '../framework/type/csmstring';
import { ICubismMotionSyncProcessor } from './icubismmotionsyncprocessor';
import { CubismMotionSyncEngineLib } from './cubismmotionsyncenginelib';
import { EngineType } from './cubismmotionsyncutil';
import { CubismMotionSyncEngineVersion } from './cubismmotionsyncengineversion';

// Engine側に渡すBitDepth
export const DefaultAudioBitDepth: number = 32;

export abstract class ICubismMotionSyncEngine {
  public constructor(
    engineHandle: CubismMotionSyncEngineLib,
    type: EngineType,
    name: csmString,
    version: CubismMotionSyncEngineVersion
  ) {
    this._engineHandle = engineHandle;
    this._type = type;
    this._name = name;
    this._version = version;
  }

  public getType(): EngineType {
    return this._type;
  }

  public getName(): csmString {
    return this._name;
  }

  public getVersion(): CubismMotionSyncEngineVersion {
    return this._version;
  }

  public getEngineHandle(): CubismMotionSyncEngineLib {
    return this._engineHandle;
  }

  public getProcessors(): csmVector<ICubismMotionSyncProcessor> {
    return this._processors;
  }

  public isClosed(): boolean {
    return this.getEngineHandle() == null;
  }

  public releaseAllProcessor(): void {
    if (this.isClosed()) {
      return;
    }

    for (let index = 0; index < this._processors.getSize(); index++) {
      this._processors.at(index).Close();
    }
  }

  public close(isForce: boolean): void {
    if (this.isClosed()) {
      return;
    }

    if (0 < this._processors.getSize()) {
      if (isForce) {
        this.releaseAllProcessor();
      } else {
        return;
      }
    }

    this.getEngineHandle().disposeEngine();
    this._engineHandle = void 0;
    this._engineHandle = null;
    CubismMotionSyncEngineController.deleteAssociation(this);
  }

  public DeleteAssociation(processor: ICubismMotionSyncProcessor): void {
    for (let index = 0; index < this._processors.getSize(); index++) {
      if (this._processors.at(index) == processor) {
        this._processors.at(index).Close();
        this._processors.remove(index);
        break;
      }
    }
  }

  protected _processors: csmVector<ICubismMotionSyncProcessor>;
  private _engineHandle: CubismMotionSyncEngineLib;
  private _type: EngineType;
  private _name: csmString;
  private _version: CubismMotionSyncEngineVersion;
}

// Namespace definition for compatibility.
import * as $ from './icubismmotionsyncengine';
import { CubismMotionSyncEngineController } from './cubismmotionsyncenginecontroller';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const ICubismMotionSyncEngine = $.ICubismMotionSyncEngine;
  export type ICubismMotionSyncEngine = $.ICubismMotionSyncEngine;
}
