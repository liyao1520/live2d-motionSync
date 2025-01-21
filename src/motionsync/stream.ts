import { csmVector } from "../framework/type/csmvector";
import { CubismLogError } from "../framework/utils/cubismdebug";
import {
  CubismMotionSync,
  MotionSyncOption,
} from "../motionsyncframework/live2dcubismmotionsync";
import fallbackMotionsync3 from "../assets/fallback.motionsync3.json?raw";
import lappaudioworkletprocessorRaw from "../assets/lappaudioworkletprocessor.js?raw";
const SamplesPerSec = 48000;
export class MotionSync {
  private _motionSync: CubismMotionSync | null = null;
  private _internalModel: any;
  private _model: any;
  constructor(internalModel: any) {
    this._internalModel = internalModel;
    this._model = internalModel.coreModel;
    CubismMotionSync.startUp(new MotionSyncOption());
    CubismMotionSync.initialize();
  }
  public start() {
    LAppInputDevice.getInstance()
      .initialize()
      .then(() => {
        LAppInputDevice.getInstance()
          .connect()
          .then(() => {
            console.log("MotionSync Framework start.");
          });
      });
  }
  public updateMotionSync(): void {
    // 現在フレームの時間を秒単位で取得
    // NOTE: ブラウザやブラウザ側の設定により、performance.now() の精度が異なる可能性に注意
    const currentAudioTime = performance.now() / 1000.0; // convert to seconds.

    // サウンドバッファの設定
    const buffer = LAppInputDevice.getInstance().pop();

    if (!buffer) return;
    this._motionSync.setSoundBuffer(0, buffer, 0);
    console.log(buffer);
    this._motionSync.updateParameters(this._model, currentAudioTime);
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
export let s_instance: LAppInputDevice = null;
export let connected: boolean = false;
/**
 * AudioWorklet からデータを保持しておくためのバッファクラス
 *
 * LAppInputDevice 内部でのみ使用
 */
class AudioBuffer {
  private _buffer: Float32Array;
  private _size: number;
  private _head: number;

  public constructor(size: number) {
    this._buffer = new Float32Array(size);
    this._size = 0;
    this._head = 0;
  }

  public get size(): number {
    return this._size;
  }

  public addLast(value: number): void {
    this._buffer[this._head] = value;
    this._size = Math.min(this._size + 1, this._buffer.length);
    this._head++;
    if (this._head >= this._buffer.length) {
      this._head = 0;
    }
  }

  public toVector(): csmVector<number> {
    const result = new csmVector<number>(this._size);
    let p: number = this._head - this._size;
    if (p < 0) {
      p += this._buffer.length;
    }
    for (let i = 0; i < this._size; i++) {
      result.pushBack(this._buffer[p]);
      p++;
      if (p >= this._buffer.length) {
        p = 0;
      }
    }
    return result;
  }

  public clear(): void {
    this._size = 0;
    this._head = 0;
  }
}

export class LAppInputDevice {
  /**
   * クラスのインスタンス（シングルトン）を返す。
   * インスタンスが生成されていない場合は内部でインスタンスを生成する。
   *
   * @return クラスのインスタンス
   */
  public static getInstance(): LAppInputDevice {
    if (s_instance == null) {
      s_instance = new LAppInputDevice();
    }

    return s_instance;
  }

  private _source: MediaStreamAudioSourceNode;
  private _context: AudioContext;
  private _buffer: AudioBuffer;

  public async initialize(): Promise<boolean> {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audios = devices.filter(
      (value, _index, _array) =>
        value.kind === "audioinput" && value.deviceId === "default"
    );

    if (audios.length == 0) {
      CubismLogError("No audio input devices found.");
      return false;
    }
    const constraints: MediaStreamConstraints = {
      audio: { deviceId: audios[0].deviceId },
    };
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    const tracks = stream.getAudioTracks();
    if (tracks.length == 0) {
      return false;
    }
    const sampleRate = tracks[0].getSettings().sampleRate;
    // 多少余裕を持たせ(30fps)2フレーム分程度でバッファを作成
    // NOTE: `requestAnimationFrame()` がコールバックを呼ぶ仕様上の間隔はディスプレイリフレッシュレート依存のため
    // 本来はこのリフレッシュレートに沿ったfps値を設定すべきであるが、これを取得するAPIが存在しないため。
    // リフレッシュレートが30Hzを下回ることは基本的にはない想定で30としています。
    const frameRate: number = 30; // 最低限期待されるリフレッシュレート
    const amount: number = 2; // 2フレーム分
    this._buffer = new AudioBuffer(
      Math.trunc((sampleRate / frameRate) * amount)
    );
    this._context = new AudioContext({ sampleRate: sampleRate });
    this._source = this._context.createMediaStreamSource(
      new MediaStream([tracks[0]])
    );

    return true;
  }

  public async connect(): Promise<void> {
    if (connected) {
      return;
    }
    const url = URL.createObjectURL(
      new Blob([lappaudioworkletprocessorRaw], {
        type: "application/javascript",
      })
    );

    await this._context.audioWorklet.addModule(url);
    const audioWorkletNode = new AudioWorkletNode(
      this._context,
      "lappaudioworkletprocessor"
    );

    this._source.connect(audioWorkletNode);
    audioWorkletNode.port.onmessage = this.onMessage.bind(this);
    connected = true;
  }

  public pop(): csmVector<number> | undefined {
    if (!this._buffer) {
      return undefined;
    }
    const buffer = this._buffer.toVector();
    this._buffer.clear();
    return buffer;
  }

  private onMessage(e: MessageEvent<any>) {
    // 元がany型なので定義に入れる。
    const data: LAppResponseObject = e.data;

    // WorkletProcessorモジュールからデータを取得
    if (data.eventType === "data" && data.audioBuffer) {
      for (let i = 0; i < data.audioBuffer.length; i++) {
        this._buffer.addLast(data.audioBuffer[i]);
      }
    }
  }

  public update(): void {
    throw new Error("Method not implemented.");
  }
  public release(): void {
    throw new Error("Method not implemented.");
  }

  public constructor() {}
}

/**
 * WorkletProcessorモジュール用の型定義
 */
export interface LAppResponseObject {
  eventType: string;
  audioBuffer: Float32Array;
}
