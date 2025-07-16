import { v4 as uuid } from "uuid";
import { MotionSync } from "./instance";
type AudioData = string | AudioBuffer;

export class AudioManager {
  constructor(private readonly _motionSync: MotionSync) {}
  public async playOne(src: AudioData): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const sync = this._motionSync;
      const ctx = sync.audioContext;

      if (typeof src === "string") {
        await sync._loadAudio(src);
      } else {
        await sync._loadAudioBuffer(src);
      }

      const buffer = sync._audioBuffer;

      if (!buffer) {
        reject(new Error("Failed to load audio: buffer is null"));
        return;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      sync._audioSource = source;

      sync._audioSource.onended = () => {
        resolve();
      };
      sync._audioContextPreviousTime = ctx.currentTime;
    });
  }
  public stopOne() {}
  public createAudioQueue() {}
}

export class AudioQueue {
  private _isFinalize = false;
  private _items: AudioData[] = [];
  public id = uuid();
  constructor() {}
  public add(audioData: AudioData) {
    if (this._isFinalize) {
      console.warn(`AudioQueue[${this.id}] is done!`);
      return;
    }
    this._items.push(audioData);
  }
  public async stop() {
    this._isFinalize = true;
    this._items = [];
  }
  public async pause() {}
  public finalize() {
    this._isFinalize = true;
  }
}

let audioContext: AudioContext;

export function initAudioContext() {
  if (typeof window === undefined) return;
  const events = ["click", "keydown", "touchstart", "mousedown", "pointerdown"];
  audioContext = new AudioContext();
  const handler = () => {
    if (audioContext.state === "suspended") {
      audioContext.resume().then(() => {
        console.log("Audio context resumed");
      });
    }
  };
  events.forEach((event) => {
    window.addEventListener(event, handler, { capture: true });
  });
}

export function getAudioContext() {
  return audioContext;
}
