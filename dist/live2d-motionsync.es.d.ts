export declare function getAudioContext(): AudioContext;

export declare function initAudioContext(): void;

export declare class MotionSync {
    private audioBuffer;
    private audioSource;
    private previousSamplePosition;
    private audioElapsedTime;
    private audioContextPreviousTime;
    private _motionSync;
    private _internalModel;
    private _model;
    private soundBuffer;
    get audioContext(): AudioContext;
    constructor(internalModel: any);
    private loadAudio;
    private loadAudioBuffer;
    private resetMouthStatus;
    reset(): void;
    play(src: string | AudioBuffer): Promise<void>;
    updateMotionSync(): void;
    private modelUpdateWithMotionSync;
    private removeProcessedData;
    loadMotionSync(buffer: ArrayBuffer, samplesPerSec?: number): void;
    loadDefaultMotionSync(samplesPerSec?: number): Promise<void>;
    loadMotionSyncFromUrl(url: string, samplesPerSec?: number): Promise<void>;
}

export { }
