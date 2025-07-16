import { csmVector } from "@cubism/type/csmvector";
import {
  CubismMotionSync,
  MotionSyncOption,
} from "./motionsync/live2dcubismmotionsync";
import fallbackMotionsync3 from "../assets/fallback.motionsync3.json?raw";
import { AudioManager, getAudioContext, initAudioContext } from "./audio";

// 初始化音频上下文
initAudioContext();

const SamplesPerSec = 48000;

export class MotionSync {
  public _audioBuffer: AudioBuffer | null = null;
  public _audioSource: AudioBufferSourceNode | null = null;
  public _audioContextPreviousTime: number = 0;
  private _previousSamplePosition: number = 0;
  private _audioElapsedTime: number = 0;
  private _motionSync: CubismMotionSync | null = null;
  private _internalModel: any;
  private _model: any;
  private _soundBuffer = new csmVector<number>();
  private _audioManager: AudioManager;
  get audioContext() {
    return getAudioContext();
  }
  constructor(internalModel: any) {
    this._internalModel = internalModel;
    this._model = internalModel.coreModel;
    this._audioManager = new AudioManager(this);
    CubismMotionSync.startUp(new MotionSyncOption());
    CubismMotionSync.initialize();
  }

  async _loadAudio(url: string) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.reset();
    this._audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }

  async _loadAudioBuffer(audioBuffer: AudioBuffer) {
    this.reset();
    this._audioBuffer = audioBuffer;
  }

  private _resetMouthStatus() {
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
    this._resetMouthStatus();

    if (this._audioSource) {
      this._audioSource.stop();
      this._audioSource.disconnect();
      this._audioSource = null;
    }

    this._audioContextPreviousTime = 0;
    this._previousSamplePosition = 0;
    this._audioElapsedTime = 0;
    this._soundBuffer.clear();
    this._soundBuffer = new csmVector<number>();
  }

  async playOne(src: string | AudioBuffer) {
    return this._audioManager.playOne(src);
  }

  public updateMotionSync() {
    if (!this._audioBuffer || !this._audioSource) {
      return;
    }

    const currentAudioTime = this.audioContext.currentTime;
    if (currentAudioTime <= this._audioContextPreviousTime) {
      this._audioContextPreviousTime = currentAudioTime;
    }

    const audioDeltaTime = currentAudioTime - this._audioContextPreviousTime;
    this._audioElapsedTime += audioDeltaTime;

    const currentSamplePosition = Math.floor(
      this._audioElapsedTime * this._audioBuffer.sampleRate
    );

    if (this._previousSamplePosition <= this._audioBuffer.length) {
      const currentAudioSamples = this._audioBuffer
        .getChannelData(0)
        .slice(this._previousSamplePosition, currentSamplePosition);

      for (let index = 0; index < currentAudioSamples.length; index++) {
        this._soundBuffer.pushBack(currentAudioSamples[index]);
      }
      if (!this._motionSync) return;
      this._motionSync.setSoundBuffer(0, this._soundBuffer, 0);
      this._motionSync.updateParameters(this._model, audioDeltaTime);

      const lastTotalProcessedCount =
        this._motionSync.getLastTotalProcessedCount(0);
      this.removeProcessedData(lastTotalProcessedCount);

      this._audioContextPreviousTime = currentAudioTime;
      this._previousSamplePosition = currentSamplePosition;
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
    const buffer = this._soundBuffer;
    if (size < buffer.getSize()) {
      if (!buffer?.begin() || buffer?._size <= size) {
        return buffer;
      }

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
    const blob = new Blob([fallbackMotionsync3], { type: "application/json" });
    const arrayBuffer = await blob.arrayBuffer();
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
