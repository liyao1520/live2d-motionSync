import { csmVector } from "../framework/type/csmvector";
import {
  CubismMotionSync,
  MotionSyncOption,
} from "../motionsyncframework/live2dcubismmotionsync";

import { getAudioContext, initAudioContext } from "./audio";

// 初始化音频上下文
initAudioContext();

const SamplesPerSec = 48000;

export class MotionSync {
  private audioBuffer: AudioBuffer | null = null;
  private audioSource: AudioBufferSourceNode | null = null;
  private previousSamplePosition: number = 0;
  private audioElapsedTime: number = 0;
  private audioContextPreviousTime: number = 0;
  private _motionSync: CubismMotionSync | null = null;
  private _internalModel: any;
  private _model: any;
  private soundBuffer = new csmVector<number>();

  get audioContext() {
    return getAudioContext();
  }
  constructor(internalModel: any) {
    this._internalModel = internalModel;
    this._model = internalModel.coreModel;
    CubismMotionSync.startUp(new MotionSyncOption());
    CubismMotionSync.initialize();
  }

  private async loadAudio(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.reset();

    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  private async loadAudioBuffer(audioBuffer: AudioBuffer) {
    this.reset();
    this.audioBuffer = audioBuffer;
  }

  private resetMouthStatus() {
    try {
      if (!this._motionSync) return;
      const setting = this._motionSync.getData().getSetting(0);
      if (!setting) return;
      const cubismParameterList = setting.cubismParameterList;
      if (!cubismParameterList) return;
      const mouthIndex = cubismParameterList._ptr.map(
        (item) => item.parameterIndex
      );
      for (const index of mouthIndex) {
        this._model.setParameterValueByIndex(index, 0);
      }
    } catch (e) {
      console.error(e);
    }
  }
  public reset() {
    this.resetMouthStatus();

    if (this.audioSource) {
      this.audioSource.stop();
      this.audioSource.disconnect();
      this.audioSource = null;
    }

    this.audioContextPreviousTime = 0;
    this.previousSamplePosition = 0;
    this.audioElapsedTime = 0;
    this.soundBuffer.clear();
    this.soundBuffer = new csmVector<number>();
  }

  async play(src: string | AudioBuffer) {
    return new Promise<void>(async (resolve, reject) => {
      if (typeof src === "string") {
        await this.loadAudio(src);
      } else {
        await this.loadAudioBuffer(src);
      }
      if (this.audioBuffer) {
        this.audioSource = this.audioContext.createBufferSource();
        this.audioSource.buffer = this.audioBuffer;
        this.audioSource.connect(this.audioContext.destination);
        this.audioSource.start(0);
        this.audioSource.onended = () => {
          resolve();
        };
        this.audioContextPreviousTime = this.audioContext.currentTime;
      } else {
        reject(new Error("audioBuffer is null"));
      }
    });
  }

  public updateMotionSync() {
    if (!this.audioBuffer || !this.audioSource) {
      return;
    }

    const currentAudioTime = this.audioContext.currentTime;
    if (currentAudioTime <= this.audioContextPreviousTime) {
      this.audioContextPreviousTime = currentAudioTime;
    }

    const audioDeltaTime = currentAudioTime - this.audioContextPreviousTime;
    this.audioElapsedTime += audioDeltaTime;

    const currentSamplePosition = Math.floor(
      this.audioElapsedTime * this.audioBuffer.sampleRate
    );

    if (this.previousSamplePosition <= this.audioBuffer.length) {
      const currentAudioSamples = this.audioBuffer
        .getChannelData(0)
        .slice(this.previousSamplePosition, currentSamplePosition);

      // 假设 soundBuffer 和 motionSync 是已经定义好的对象
      for (let index = 0; index < currentAudioSamples.length; index++) {
        this.soundBuffer.pushBack(currentAudioSamples[index]);
      }
      if (!this._motionSync) return;
      this._motionSync.setSoundBuffer(0, this.soundBuffer, 0);
      this._motionSync.updateParameters(this._model, audioDeltaTime);

      const lastTotalProcessedCount =
        this._motionSync.getLastTotalProcessedCount(0);
      this.removeProcessedData(lastTotalProcessedCount);

      this.audioContextPreviousTime = currentAudioTime;
      this.previousSamplePosition = currentSamplePosition;
    }
  }

  private modelUpdateWithMotionSync() {
    const motionSync = this._motionSync;
    if (!motionSync) return;
    const internalModel = this._internalModel;
    const updateFn = internalModel.motionManager.update;
    internalModel.motionManager.update = (...args: any[]) => {
      updateFn.apply(this._internalModel.motionManager, args);
      this.updateMotionSync();
    };
  }

  private removeProcessedData(size: number) {
    // 假设 soundBuffer 有一个 remove 方法来移除处理过的数据

    const buffer = this.soundBuffer;
    if (size < buffer.getSize()) {
      if (!buffer?.begin() || buffer?._size <= size) {
        return buffer; // 削除範囲外
      }

      // 削除
      buffer._ptr.splice(0, size);
      buffer._size -= size;
      return buffer;
    }
  }

  public loadMotionSync(buffer: ArrayBuffer, samplesPerSec = SamplesPerSec) {
    if (buffer == null || buffer.byteLength == 0) {
      console.warn("Failed to loadMotionSync().");
      return;
    }
    this._motionSync = CubismMotionSync.create(
      this._model,
      buffer,
      buffer.byteLength,
      samplesPerSec
    );
    this.modelUpdateWithMotionSync();
  }
  public async loadDefaultMotionSync(samplesPerSec = SamplesPerSec) {
    const url = new URL("../assets/fallback.motionsync3.json", import.meta.url);
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.loadMotionSync(arrayBuffer, samplesPerSec);
  }
  public async loadMotionSyncFromUrl(
    url: string,
    samplesPerSec = SamplesPerSec
  ) {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.loadMotionSync(arrayBuffer, samplesPerSec);
    } catch (e) {
      console.warn("Failed to loadMotionSync(). Use default fallback.");
      await this.loadDefaultMotionSync(samplesPerSec);
    }
  }
}

export * from "./audio";
