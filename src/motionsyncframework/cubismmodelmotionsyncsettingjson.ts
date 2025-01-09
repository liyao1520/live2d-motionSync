/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

import { CubismModelSettingJson } from '../framework/cubismmodelsettingjson';
import { csmString } from '../framework/type/csmstring';
import { csmVector } from '../framework/type/csmvector';

export const FileReferences: string = 'FileReferences';
export const MotionSync: string = 'MotionSync';

export class CubismModelMotionSyncSettingJson extends CubismModelSettingJson {
  public constructor(buffer: ArrayBuffer, size: number) {
    super(buffer, size);
    this._motionSyncFilePath = this.getJson()
      .getRoot()
      .getValueByString(FileReferences)
      .getValueByString(MotionSync)
      .getRawString();
  }

  public getMotionSyncFileName(): string {
    return this._motionSyncFilePath;
  }

  public getMotionSyncSoundFileList(): csmVector<csmString> {
    const list: csmVector<csmString> = new csmVector<csmString>();

    for (let index = 0; index < this.getMotionGroupCount(); index++) {
      const groupName: string = this.getMotionGroupName(index);

      for (
        let listIndex = 0;
        listIndex < this.getMotionCount(groupName);
        listIndex++
      ) {
        const fileName: string = this.getMotionSoundFileName(
          groupName,
          listIndex
        );

        // ファイル名が空であれば無視する。
        if (!fileName || fileName.length < 1) {
          continue;
        }

        list.pushBack(new csmString(fileName));
      }
    }

    return list;
  }

  private _motionSyncFilePath: string;
}

// Namespace definition for compatibility.
import * as $ from './cubismmodelmotionsyncsettingjson';
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace Live2DCubismMotionSyncFramework {
  export const CubismModelMotionSyncSettingJson =
    $.CubismModelMotionSyncSettingJson;
  export type CubismModelMotionSyncSettingJson =
    $.CubismModelMotionSyncSettingJson;
}
