/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */



export class CubismMotionSyncEngineVersion {
  public constructor(rawVersion: number) {
    this._versionNumber = rawVersion;
    this._major = (this._versionNumber & 0xff000000) >> 24;
    this._minor = (this._versionNumber & 0x00ff0000) >> 16;
    this._patch = this._versionNumber & 0x0000ffff;
  }

  public getMajor(): number {
    return this._major;
  }

  public getMinor(): number {
    return this._minor;
  }

  public getPatch(): number {
    return this._patch;
  }

  public toString(): string {
    return (
      this._major +
      '.' +
      this._minor +
      '.' +
      this._patch +
      '(' +
      this._versionNumber +
      ')'
    );
  }

  private _versionNumber: number;
  private _major: number;
  private _minor: number;
  private _patch: number;
}

// Namespace definition for compatibility.
import * as $ from './cubismmotionsyncengineversion';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismMotionSyncEngineVersion = $.CubismMotionSyncEngineVersion;
  export type CubismMotionSyncEngineVersion = $.CubismMotionSyncEngineVersion;
}
