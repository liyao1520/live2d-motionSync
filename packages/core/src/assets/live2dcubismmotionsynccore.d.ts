/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Proprietary Software license
 * that can be found at https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html.
 */
declare namespace Live2DCubismMotionSyncCore {
    /** Cubism version identifier. */
    type csmMotionSyncVersion = number;
    /** Booleans false. */
    const csmMotionSyncFalse: number;
    /** True. */
    const csmMotionSyncTrue: number;
    /** Log handler.
     *
     * @param message Null-terminated string message to log.
     */
    interface csmMotionSyncLogFunction {
        (message: string): void;
    }
    /** ALLOCATOR DECRALATIONS */
    /** Decralation of allocator.
     *
     * @param size Allocate size.
     */
    interface csmMotionSync_AllocFunc {
        (size: number): any;
    }
    /** Decralation of aligned allocator.
     *
     * @param size Allocate size.
     * @param align Align size.
     */
    interface csmMotionSync_AlignedAllocFunc {
        (size: number, align: number): any;
    }
    /** Decralation of deallocator.
     *
     * @param ptr Address.
     */
    interface csmMotionSync_DeallocFunc {
        (ptr: number): void;
    }
    /** Decralation of aligned deallocator.
     *
     * @param ptr Address.
     */
    interface csmMotionSync_DeallocFunc {
        (ptr: number): void;
    }
    class ToPointer {
        /**
         * Allocates memory of a specified size.
         *
         * @param size Memory size.
         * @returns Address.
         */
        static Malloc(size: number): number;
        /**
         * Free memory at specified location.
         *
         * @param memory Address.
         */
        static Free(memory: number): void;
        /**
         * Places an integer entity in memory.
         *
         * @param ptr Address.
         * @param offset Offset.
         * @param value Value.
         */
        static AddValuePtrInt32(ptr: number, offset: number, value: number): void;
        /**
         * Places floating-point entities in memory.
         *
         * @param ptr Address.
         * @param offset Offset.
         * @param value Value.
         */
        static AddValuePtrFloat(ptr: number, offset: number, value: number): void;
        /**
         * Convert number array to native float array.
         *
         * @param numbers Array to convert.
         * @returns Top address of converted array.
         */
        static ConvertNumberArrayToFloatArrayPtr(numbers: Array<number>): number;
        /**
         * Convert number array to native pointer array.
         *
         * @param buffer Array to put values in.
         * @param ptr Buffer's top address.
         * @param numbers Array to convert.
         * @returns buffer.
         */
        static NumberArrayToPtrArray(buffer: Int32Array, ptr: number, numbers: Array<number>): Int32Array;
        /**
         * Convert engine configuration to native array.
         *
         * @param buffer Array to put values in.
         * @param ptr Buffer's top address.
         * @param allocator Allocator function.
         * @param deallocator Deallocator function.
         * @returns buffer.
         */
        static ConvertEngineConfigCriToInt32Array(buffer: Int32Array, ptr: number, allocator: csmMotionSync_AllocFunc, deallocator: csmMotionSync_DeallocFunc): Int32Array;
        /**
         * Convert context configuration to native array.
         *
         * @param buffer Array to put values in.
         * @param ptr Buffer's top address.
         * @param sampleRate Audio sampling frequency.
         * @param bitDepth Audio bitDepth.
         * @returns buffer.
         */
        static ConvertContextConfigCriToInt32Array(buffer: Int32Array, ptr: number, sampleRate: number, bitDepth: number): Int32Array;
        /**
         * Convert MappingInfo to native array.
         *
         * @param buffer Array to put values in.
         * @param bufferPtr Buffer's top address.
         * @param audioParameterId AudioParameter's id.
         * @param modelParameterIds Array of cubism paramter id.
         * @param modelParameterValues Array of cubism paramter value.
         * @param modelParameterCount Number of cubism paramter.
         * @param scale Scale.
         * @param enabled Enable flag.
         * @returns buffer.
         */
        static ConvertMappingInfoCriToFloat32Array(buffer: Float32Array, bufferPtr: number, audioParameterId: string, modelParameterIds: Array<string>, modelParameterValues: Array<number>, modelParameterCount: number, scale: number, enabled: number): Float32Array;
        /**
         * Convert analysis result to native array.
         *
         * @param buffer Array to put values in.
         * @param bufferPtr Buffer's top address.
         * @param valuesCount Cubism parameter count.
         * @returns buffer.
         */
        static ConvertAnalysisResultToInt32Array(buffer: Int32Array, bufferPtr: number, valuesCount: number): Int32Array;
        /**
         * Convert analysis configuration to native array.
         *
         * @param buffer Array to put values in.
         * @param bufferPtr Buffer's top address.
         * @param blendRatio blendRatio.
         * @param smoothing smoothing.
         * @param audioLevelEffectRatio Sound level influence.
         * @returns buffer.
         */
        static ConvertAnalysisConfigToFloat32Array(buffer: Float32Array, bufferPtr: number, blendRatio: number, smoothing: number, audioLevelEffectRatio: number): Float32Array;
        /**
         * Retrieve to calculation results from memory.
         *
         * @param valuesPtr Top address of the array containing the calculation results.
         * @param valuesCount Cubism parameter count.
         * @returns The array of the calculation results.
         */
        static GetValuesFromAnalysisResult(valuesPtr: number, valuesCount: number): Array<number>;
        /**
         * Retrieve to processing sample count from memory.
         *
         * @param ptr Processed sample count pointer.
         * @returns Processed sample count.
         */
        static GetProcessedSampleCountFromAnalysisResult(ptr: number): number;
        /**
         * Writes allocator functions to memory.
         *
         * @param allocator Allocator function.
         * @returns pointer.
         */
        static AllocatorToPtr(allocator: csmMotionSync_AllocFunc): any;
        /**
         * Writes allocator functions to memory.
         *
         * @param deallocator Deallocator function.
         * @returns pointer.
         */
        static DeallocatorToPtr(deallocator: csmMotionSync_DeallocFunc): any;
    }
    /** Cubism version. */
    class CubismMotionSyncEngine {
        /**
         * Queries the version of Engine.
         *
         * @return Engine version.
         */
        static csmMotionSyncGetEngineVersion(): csmMotionSyncVersion;
        /**
         * Queries the name of Engine.
         *
         * @return Engine name.
         */
        static csmMotionSyncGetEngineName(): string;
        /**
         * Initializes the Engine.
         *
         * @return `1` if Engine is available.
         */
        static csmMotionSyncInitializeEngine(engineConfiguration: number): number;
        /**
         * Disposes the Engine.
         */
        static csmMotionSyncDisposeEngine(): void;
        private constructor();
    }
    /** Cubism logging. */
    class Logging {
        private static logFunction;
        /**
         * Sets log handler.
         *
         * @param handler  Handler to use.
         */
        static csmMotionSyncSetLogFunction(handler: csmMotionSyncLogFunction): void;
        /**
         * Queries log handler.
         *
         * @return Log handler.
         */
        static csmMotionSyncGetLogFunction(): csmMotionSyncLogFunction;
        /**
         * Wrap log function.
         *
         * @param messagePtr number
         *
         * @return string
         */
        private static wrapLogFunction;
        private constructor();
    }
    /** Cubism MotionSync Context */
    class Context {
        /** Native context. */
        private _contextHandler;
        /** Makes the context of Analysis. */
        csmMotionSyncCreate(contextConfiguration: number, mappingInformations: number, mappingInformationCount: number): void;
        /** Resets the context of Analysis for reusing. */
        csmMotionSyncClear(): void;
        /** Resets the context of Analysis for reusing. */
        csmMotionSyncDelete(): void;
        /** Gets the number of samples to analyze at a time. */
        csmMotionSyncGetRequireSampleCount(): number;
        /** Analyzes the samples for conversion to the CubismParameter. */
        csmMotionSyncAnalyze(samples: number, sampleCount: number, analysisResult: number, analysisConfiguration: number): number;
        /**
         * Initializes instance.
         */
        constructor();
    }
    /** Emscripten Cubism MotionSync Core module. */
}
