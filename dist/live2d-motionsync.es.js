var S9 = Object.defineProperty;
var N9 = (r, v, P) => v in r ? S9(r, v, { enumerable: !0, configurable: !0, writable: !0, value: P }) : r[v] = P;
var t = (r, v, P) => N9(r, typeof v != "symbol" ? v + "" : v, P);
const M9 = `/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Proprietary Software license
 * that can be found at https://www.live2d.com/eula/live2d-proprietary-software-license-agreement_en.html.
 */
var Live2DCubismMotionSyncCore;
(function (Live2DCubismMotionSyncCore) {
    /** C calls. */
    var _csmmotionsync = /** @class */ (function () {
        function _csmmotionsync() {
        }
        _csmmotionsync.getLogFunction = function () {
            return _em.ccall("csmMotionSync_GetLogFunction", "number", [], []);
        };
        _csmmotionsync.getEngineVersion = function () {
            return _em.ccall("csmMotionSync_GetEngineVersion", "number", [], []);
        };
        _csmmotionsync.getEngineName = function () {
            return _em.ccall("csmMotionSync_GetEngineName", "string", [], []);
        };
        _csmmotionsync.initializeEngine = function (engineConfiguration) {
            return _em.ccall("csmMotionSync_InitializeEngine", "number", ["number"], [engineConfiguration]);
        };
        _csmmotionsync.createContext = function (contextConfiguration, mappingInformations, mappingInformationCount) {
            return _em.ccall("csmMotionSync_CreateContext", "number", ["number", "number", "number"], [contextConfiguration, mappingInformations, mappingInformationCount]);
        };
        _csmmotionsync.getRequireSampleCount = function (context) {
            return _em.ccall("csmMotionSync_GetRequireSampleCount", "number", ["number"], [context]);
        };
        _csmmotionsync.analyze = function (context, samples, sampleCount, analysisResult, analysisConfiguration) {
            return _em.ccall("csmMotionSync_Analyze", "number", ["number", "number", "number", "number", "number"], [context, samples, sampleCount, analysisResult, analysisConfiguration]);
        };
        _csmmotionsync.malloc = function (size) {
            return _em.ccall("csmMotionSync_Malloc", "number", ["number"], [size]);
        };
        _csmmotionsync.setLogFunction = function (handler) {
            _em.ccall("csmMotionSync_SetLogFunction", null, ["number"], [handler]);
        };
        _csmmotionsync.disposeEngine = function () {
            _em.ccall("csmMotionSync_DisposeEngine", null, [], []);
        };
        _csmmotionsync.clearContext = function (context) {
            _em.ccall("csmMotionSync_ClearContext", null, ["number"], [context]);
        };
        _csmmotionsync.deleteContext = function (context) {
            _em.ccall("csmMotionSync_DeleteContext", null, ["number"], [context]);
        };
        _csmmotionsync.free = function (memory) {
            _em.ccall("csmMotionSync_Free", null, ["number"], [memory]);
        };
        return _csmmotionsync;
    }());
    /** Booleans false. */
    Live2DCubismMotionSyncCore.csmMotionSyncFalse = 0;
    /** True. */
    Live2DCubismMotionSyncCore.csmMotionSyncTrue = 1;
    var ToPointer = /** @class */ (function () {
        function ToPointer() {
        }
        /**
         * Allocates memory of a specified size.
         *
         * @param size Memory size.
         * @returns Address.
         */
        ToPointer.Malloc = function (size) {
            return _csmmotionsync.malloc(size);
        };
        /**
         * Free memory at specified location.
         *
         * @param memory Address.
         */
        ToPointer.Free = function (memory) {
            _csmmotionsync.free(memory);
        };
        /**
         * Places an integer entity in memory.
         *
         * @param ptr Address.
         * @param offset Offset.
         * @param value Value.
         */
        ToPointer.AddValuePtrInt32 = function (ptr, offset, value) {
            _em.setValue(ptr + offset, value, 'i32');
        };
        /**
         * Places floating-point entities in memory.
         *
         * @param ptr Address.
         * @param offset Offset.
         * @param value Value.
         */
        ToPointer.AddValuePtrFloat = function (ptr, offset, value) {
            _em.setValue(ptr + offset, value, 'float');
        };
        /**
         * Convert number array to native float array.
         *
         * @param numbers Array to convert.
         * @returns Top address of converted array.
         */
        ToPointer.ConvertNumberArrayToFloatArrayPtr = function (numbers) {
            // 値の配列の先頭アドレス
            var numbersPtr = ToPointer.Malloc(numbers.length * 4);
            for (var index = 0; index < numbers.length; index++) {
                _em.setValue(numbersPtr + (index * 4), numbers[index], 'float');
            }
            return numbersPtr;
        };
        /**
         * Convert number array to native pointer array.
         *
         * @param buffer Array to put values in.
         * @param ptr Buffer's top address.
         * @param numbers Array to convert.
         * @returns buffer.
         */
        ToPointer.NumberArrayToPtrArray = function (buffer, ptr, numbers) {
            var bufferDataHeap = new Uint8Array(_em.HEAPU8.buffer, ptr, buffer.byteLength);
            bufferDataHeap.set(new Uint8Array(buffer.buffer));
            buffer = new Int32Array(bufferDataHeap.buffer, bufferDataHeap.byteOffset, bufferDataHeap.length);
            for (var index = 0; index < numbers.length; index++) {
                buffer[index] = numbers[index];
            }
            return buffer;
        };
        /**
         * Convert engine configuration to native array.
         *
         * @param buffer Array to put values in.
         * @param ptr Buffer's top address.
         * @param allocator Allocator function.
         * @param deallocator Deallocator function.
         * @returns buffer.
         */
        ToPointer.ConvertEngineConfigCriToInt32Array = function (buffer, ptr, allocator, deallocator) {
            // Wrap function to pointer.
            var allocPtr = this.AllocatorToPtr(allocator);
            var deallocPtr = this.DeallocatorToPtr(deallocator);
            var bufferDataHeap = new Uint8Array(_em.HEAPU8.buffer, ptr, buffer.byteLength);
            bufferDataHeap.set(new Uint8Array(buffer.buffer));
            buffer = new Int32Array(bufferDataHeap.buffer, bufferDataHeap.byteOffset, bufferDataHeap.length);
            buffer[0] = allocPtr;
            buffer[1] = deallocPtr;
            return buffer;
        };
        /**
         * Convert context configuration to native array.
         *
         * @param buffer Array to put values in.
         * @param ptr Buffer's top address.
         * @param sampleRate Audio sampling frequency.
         * @param bitDepth Audio bitDepth.
         * @returns buffer.
         */
        ToPointer.ConvertContextConfigCriToInt32Array = function (buffer, ptr, sampleRate, bitDepth) {
            var bufferDataHeap = new Uint8Array(_em.HEAPU8.buffer, ptr, buffer.byteLength);
            bufferDataHeap.set(new Uint8Array(buffer.buffer));
            buffer = new Int32Array(bufferDataHeap.buffer, bufferDataHeap.byteOffset, bufferDataHeap.length);
            buffer[0] = sampleRate;
            buffer[1] = bitDepth;
            return buffer;
        };
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
        ToPointer.ConvertMappingInfoCriToFloat32Array = function (buffer, bufferPtr, audioParameterId, modelParameterIds, modelParameterValues, modelParameterCount, scale, enabled) {
            // First address of the string.
            var audioParameterIdPtr = ToPointer.Malloc(audioParameterId.length * 4 + 1);
            _em.stringToUTF8(audioParameterId, audioParameterIdPtr, audioParameterId.length * 4 + 1);
            // First address of the id array.
            var totalLength = 0;
            for (var index = 0; index < modelParameterIds.length; index++) {
                totalLength += modelParameterIds[index].length;
            }
            var modelParameterIdsPtr = ToPointer.Malloc(totalLength * 4 + modelParameterIds.length);
            var firstModelParameterIdsPtr = modelParameterIdsPtr;
            for (var index = 0; index < modelParameterIds.length; index++) {
                // See also the stringToUTF8 documentation.
                // https://emscripten.org/docs/api_reference/preamble.js.html#stringToUTF8
                _em.stringToUTF8(modelParameterIds[index], modelParameterIdsPtr, modelParameterIds[index].length * 4 + 1);
                // Without this +1, the letters will be connected and recognized when brought to the C side.
                modelParameterIdsPtr += modelParameterIds[index].length + 1;
            }
            // First address of the value array.
            var modelParameterValuesPtr = ToPointer.ConvertNumberArrayToFloatArrayPtr(modelParameterValues);
            var bufferDataHeap = new Uint8Array(_em.HEAPU8.buffer, bufferPtr, buffer.byteLength);
            bufferDataHeap.set(new Uint8Array(buffer.buffer));
            buffer = new Float32Array(bufferDataHeap.buffer, bufferDataHeap.byteOffset, bufferDataHeap.length);
            // Call by reference.
            buffer[0] = audioParameterIdPtr;
            buffer[1] = firstModelParameterIdsPtr;
            buffer[2] = modelParameterValuesPtr;
            // Call by value.
            buffer[3] = modelParameterCount;
            buffer[4] = scale;
            buffer[5] = enabled;
            return buffer;
        };
        /**
         * Convert analysis result to native array.
         *
         * @param buffer Array to put values in.
         * @param bufferPtr Buffer's top address.
         * @param valuesCount Cubism parameter count.
         * @returns buffer.
         */
        ToPointer.ConvertAnalysisResultToInt32Array = function (buffer, bufferPtr, valuesCount) {
            var valuesPtr = ToPointer.Malloc(valuesCount * Float32Array.BYTES_PER_ELEMENT);
            var bufferDataHeap = new Uint8Array(_em.HEAPU8.buffer, bufferPtr, buffer.byteLength);
            bufferDataHeap.set(new Uint8Array(buffer.buffer));
            buffer = new Int32Array(bufferDataHeap.buffer, bufferDataHeap.byteOffset, bufferDataHeap.length);
            buffer[0] = valuesPtr;
            buffer[1] = valuesCount;
            buffer[2] = 0;
            return buffer;
        };
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
        ToPointer.ConvertAnalysisConfigToFloat32Array = function (buffer, bufferPtr, blendRatio, smoothing, audioLevelEffectRatio) {
            var bufferDataHeap = new Uint8Array(_em.HEAPU8.buffer, bufferPtr, buffer.byteLength);
            bufferDataHeap.set(new Uint8Array(buffer.buffer));
            buffer = new Float32Array(bufferDataHeap.buffer, bufferDataHeap.byteOffset, bufferDataHeap.length);
            buffer[0] = blendRatio;
            buffer[1] = smoothing;
            buffer[2] = audioLevelEffectRatio;
            return buffer;
        };
        /**
         * Retrieve to calculation results from memory.
         *
         * @param valuesPtr Top address of the array containing the calculation results.
         * @param valuesCount Cubism parameter count.
         * @returns The array of the calculation results.
         */
        ToPointer.GetValuesFromAnalysisResult = function (valuesPtr, valuesCount) {
            var values = new Array(valuesCount);
            for (var index = 0; index < valuesCount; index++) {
                values[index] = _em.getValue(valuesPtr + (index * 4), 'float');
            }
            return values;
        };
        /**
         * Retrieve to processing sample count from memory.
         *
         * @param ptr Processed sample count pointer.
         * @returns Processed sample count.
         */
        ToPointer.GetProcessedSampleCountFromAnalysisResult = function (ptr) {
            var processedSampleCount = _em.getValue(ptr, 'i32');
            return processedSampleCount;
        };
        /**
         * Writes allocator functions to memory.
         *
         * @param allocator Allocator function.
         * @returns pointer.
         */
        ToPointer.AllocatorToPtr = function (allocator) {
            // Wrap function to pointer.
            var pointer = _em.addFunction(allocator, 'ii');
            return pointer;
        };
        /**
         * Writes allocator functions to memory.
         *
         * @param deallocator Deallocator function.
         * @returns pointer.
         */
        ToPointer.DeallocatorToPtr = function (deallocator) {
            // Wrap function to pointer.
            var pointer = _em.addFunction(deallocator, 'vi');
            return pointer;
        };
        return ToPointer;
    }());
    Live2DCubismMotionSyncCore.ToPointer = ToPointer;
    /** Cubism version. */
    var CubismMotionSyncEngine = /** @class */ (function () {
        function CubismMotionSyncEngine() {
        }
        /**
         * Queries the version of Engine.
         *
         * @return Engine version.
         */
        CubismMotionSyncEngine.csmMotionSyncGetEngineVersion = function () {
            return _csmmotionsync.getEngineVersion();
        };
        /**
         * Queries the name of Engine.
         *
         * @return Engine name.
         */
        CubismMotionSyncEngine.csmMotionSyncGetEngineName = function () {
            return _csmmotionsync.getEngineName();
        };
        /**
         * Initializes the Engine.
         *
         * @return \`1\` if Engine is available.
         */
        CubismMotionSyncEngine.csmMotionSyncInitializeEngine = function (engineConfiguration) {
            return _csmmotionsync.initializeEngine(engineConfiguration);
        };
        /**
         * Disposes the Engine.
         */
        CubismMotionSyncEngine.csmMotionSyncDisposeEngine = function () {
            _csmmotionsync.disposeEngine();
        };
        return CubismMotionSyncEngine;
    }());
    Live2DCubismMotionSyncCore.CubismMotionSyncEngine = CubismMotionSyncEngine;
    /** Cubism logging. */
    var Logging = /** @class */ (function () {
        function Logging() {
        }
        /**
         * Sets log handler.
         *
         * @param handler  Handler to use.
         */
        Logging.csmMotionSyncSetLogFunction = function (handler) {
            // Cache log handler.
            Logging.logFunction = handler;
            // Wrap function to pointer.
            var pointer = _em.addFunction(Logging.wrapLogFunction, 'vi');
            // Sets log handler.
            _csmmotionsync.setLogFunction(pointer);
        };
        /**
         * Queries log handler.
         *
         * @return Log handler.
         */
        Logging.csmMotionSyncGetLogFunction = function () {
            return Logging.logFunction;
        };
        /**
         * Wrap log function.
         *
         * @param messagePtr number
         *
         * @return string
         */
        Logging.wrapLogFunction = function (messagePtr) {
            // Pointer to string.
            var messageStr = _em.UTF8ToString(messagePtr);
            // Run log function.
            Logging.logFunction(messageStr);
        };
        return Logging;
    }());
    Live2DCubismMotionSyncCore.Logging = Logging;
    /** Cubism MotionSync Context */
    var Context = /** @class */ (function () {
        /**
         * Initializes instance.
         */
        function Context() {
        }
        /** Makes the context of Analysis. */
        Context.prototype.csmMotionSyncCreate = function (contextConfiguration, mappingInformations, mappingInformationCount) {
            this._contextHandler = _csmmotionsync.createContext(contextConfiguration, mappingInformations, mappingInformationCount);
        };
        /** Resets the context of Analysis for reusing. */
        Context.prototype.csmMotionSyncClear = function () {
            _csmmotionsync.clearContext(this._contextHandler);
        };
        /** Resets the context of Analysis for reusing. */
        Context.prototype.csmMotionSyncDelete = function () {
            _csmmotionsync.deleteContext(this._contextHandler);
            this._contextHandler = 0;
        };
        /** Gets the number of samples to analyze at a time. */
        Context.prototype.csmMotionSyncGetRequireSampleCount = function () {
            return _csmmotionsync.getRequireSampleCount(this._contextHandler);
        };
        /** Analyzes the samples for conversion to the CubismParameter. */
        Context.prototype.csmMotionSyncAnalyze = function (samples, sampleCount, analysisResult, analysisConfiguration) {
            return _csmmotionsync.analyze(this._contextHandler, samples, sampleCount, analysisResult, analysisConfiguration);
        };
        return Context;
    }());
    Live2DCubismMotionSyncCore.Context = Context;
    /** Emscripten Cubism MotionSync Core module. */
    
var _em_module = (() => {
  var _scriptDir = typeof document !== 'undefined' && document.currentScript ? document.currentScript.src : undefined;
  
  return (
function(_em_module) {
  _em_module = _em_module || {};


var d;d||(d=typeof _em_module !== 'undefined' ? _em_module : {});var n,t;d.ready=new Promise(function(a,c){n=a;t=c});var u=Object.assign({},d),v="";"undefined"!=typeof document&&document.currentScript&&(v=document.currentScript.src);_scriptDir&&(v=_scriptDir);0!==v.indexOf("blob:")?v=v.substr(0,v.replace(/[?#].*/,"").lastIndexOf("/")+1):v="";var aa=d.print||console.log.bind(console),w=d.printErr||console.warn.bind(console);Object.assign(d,u);u=null;var x=[],y,z;d.wasmBinary&&(z=d.wasmBinary);
var noExitRuntime=d.noExitRuntime||!0;function ba(){this.buffer=new ArrayBuffer(A/65536*65536)}function ca(){}function da(){this.exports=(
// EMSCRIPTEN_START_ASM
function instantiate(la){function e(f){f.grow=function(b){var a=this.length;this.length=this.length+b;return a};f.set=function(c,d){this[c]=d};f.get=function(c){return this[c]};return f}var g;var h=new Uint8Array(123);for(var c=25;c>=0;--c){h[48+c]=52+c;h[65+c]=c;h[97+c]=26+c}h[43]=62;h[47]=63;function n(o,p,q){var i,j,c=0,k=p,l=q.length,m=p+(l*3>>2)-(q[l-2]=="=")-(q[l-1]=="=");for(;c<l;c+=4){i=h[q.charCodeAt(c+1)];j=h[q.charCodeAt(c+2)];o[k++]=h[q.charCodeAt(c)]<<2|i>>4;if(k<m)o[k++]=i<<4|j>>2;if(k<m)o[k++]=j<<6|h[q.charCodeAt(c+3)]}}function r(s){n(g,1024,"TGl2ZTJEQ3ViaXNtTW90aW9uU3luY0VuZ2luZV9DUkkAMS40LjEAJXMKADxDYW4gbm90IGZpbmQgZXJyb3IgbWVzc2FnZT4AICAAW0NTTSBNT1RJT05TWU5DXSBbV11jc21Nb3Rpb25TeW5jX0luaXRpYWxpemVFbmdpbmU6IEVuZ2luZSBpcyBhbHJlYWR5IGluaXRpYWxpemVkLgoARTA1MDYyMTAxRQAlMDJYIABbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfRGlzcG9zZUVuZ2luZTogRW5naW5lIGlzIG5vdCBpbml0aWFsaXplZC4KAEUwNTA2MjEwMkUAW0NTTSBNT1RJT05TWU5DXSBbRV1jc21Nb3Rpb25TeW5jX0NyZWF0ZUNvbnRleHQ6IEVuZ2luZSBpcyBub3QgaW5pdGlhbGl6ZWQuCgBUaGlzIGlzIGEgZXJyb3IgbWVzc2FnZS4KVGhlIGRldGFpbCBvZiBlcnJvciBtZXNzZ2Ugc2hvdWxkIGJlIHdpdHRlbiBoZWFyZS4KRXJyb3IgUGFyYW1ldGVyIDAgaXMgLi4uClRyb3VibGUgc2hvb3RpbmcgbXVzdCBiZSBoZXJlCgBbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQ3JlYXRlQ29udGV4dDogSW52YWxpZCBgbWFwcGluZ0luZm9ybWF0aW9uc2AgYWRkcmVzcyBvciBgbWFwcGluZ0luZm9ybWF0aW9uQ291bnRgIGluZGljYXRlcyAwLgoARTA1MDYyMTIwRQBbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQ3JlYXRlQ29udGV4dDogYG1hcHBpbmdJbmZvcm1hdGlvbnNbJWRdLkF1ZGlvUGFyYW1ldGVySWRgIG9yIGAuTW9kZWxQYXJhbWV0ZXJWYWx1ZXNgIGlzIGludmFsaWQuCgBbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQ3JlYXRlQ29udGV4dDogSW52YWxpZCBgY29udGV4dENvbmZpZ3VyYXRpb25gIGFkZHJlc3MuCgBDYW4ndCBvcGVuICclcycKAEUwNTA2MjEyMUUAW0NTTSBNT1RJT05TWU5DXSBbRV1jc21Nb3Rpb25TeW5jX0NyZWF0ZUNvbnRleHQ6IE1lbW9yeSBhbGxvY2F0aW9uIHdhcyBmYWlsZWQ6IENvbnRleHQK");n(g,1984,"Mg4AAIUOAAD1DgAAYg8AAM8PAAA8EAAAW0NTTSBNT1RJT05TWU5DXSBbRV1jc21Nb3Rpb25TeW5jX0NyZWF0ZUNvbnRleHQ6IE1pc3NpbmcgdmlzZW1lIHNldHRpbmc6ICVzLgoAJWQgaXMgZXhlZWRlZCAuCgBFMDUwNjMwMDFCAFtDU00gTU9USU9OU1lOQ10gW0VdY3NtTW90aW9uU3luY19DcmVhdGVDb250ZXh0OiBJbnZhbGlkIGF1ZGlvIHNvdXJjZSBmb3JtYXQuCgBbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQ3JlYXRlQ29udGV4dDogTWVtb3J5IGFsbG9jYXRpb24gd2FzIGZhaWxlZDogUHJldmlvdXMgRnJhbWUgRGF0YQoAQ2FuJ3QgY3JlYXRlIFN0cmVhbSBKb2ludC4KQmVjYXVzZSBvZiB0aGUgc2l6ZSBvZiBoZWFwIGFyZWEgaXMgc2hvcnQuClBsZWFzZSBpbmNyZWFzZSBoZWFwIGFyZWEgc2l6ZSAoaGVhcD0lMDh4KQoARTA1MDYzMDAyQgBbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQ2xlYXJDb250ZXh0OiBFbmdpbmUgaXMgbm90IGluaXRpYWxpemVkIG9yIEludmFsaWQgY29udGV4dC4KAEUwNTA2MzAwMUgAW0NTTSBNT1RJT05TWU5DXSBbRV1jc21Nb3Rpb25TeW5jX0RlbGV0ZUNvbnRleHQ6IEVuZ2luZSBpcyBub3QgaW5pdGlhbGl6ZWQgb3IgSW52YWxpZCBjb250ZXh0LgoAW0NTTSBNT1RJT05TWU5DXSBbRV1jc21Nb3Rpb25TeW5jX0FuYWx5emU6IEVuZ2luZSBpcyBub3QgaW5pdGlhbGl6ZWQuCgBTaXplIG9mIENyaUhlYXBPYmogc3RydWN0dXJlIGlzIG5vdCBhIG11bHRpcGxlIG9mIDE2LiAoJWRieXRlKQoARTA1MDYzMDAySABbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQW5hbHl6ZTogSW52YWxpZCBhcmd1bWVudC4gTWFrZSBzdXJlIGBjb250ZXh0YCwgYGFuYWx5c2lzQ29uZmlndXJhdGlvbmAsIGBhbmFseXNpc1Jlc3VsdGAsIGBzYW1wbGVzYCwgYHNhbXBsZUNvdW50YC4KAFtDU00gTU9USU9OU1lOQ10gW0VdY3NtTW90aW9uU3luY19BbmFseXplOiBgc2FtcGxlQ291bnRgIGxlc3MgdGhhbiBgY3NtTW90aW9uU3luY19HZXRSZXF1aXJlU2FtcGxlQ291bnQoKWAuCgBGdW5jdGlvbiBwb2ludGVyIG9mIEFsbG9jRml4IGlzIE5VTEwuCgBFMDUwNjMwMDNIAFtDU00gTU9USU9OU1lOQ10gW0VdY3NtTW90aW9uU3luY19BbmFseXplOiBJbnZhbGlkIGBTbW9vdGhpbmdgLgoAW0NTTSBNT1RJT05TWU5DXSBbRV1jc21Nb3Rpb25TeW5jX0FuYWx5emU6IEludmFsaWQgYEJsZW5kUmF0aW9gLgoARnVuY3Rpb24gcG9pbnRlciBvZiBBbGxvY1RlbXBvcmFyeSBpcyBOVUxMLgoARTA1MDYzMDA0SABbQ1NNIE1PVElPTlNZTkNdIFtFXWNzbU1vdGlvblN5bmNfQW5hbHl6ZTogSW52YWxpZCBgQXVkaW9MZXZlbEVmZmVjdFJhdGlvYC4KAFtDU00gTU9USU9OU1lOQ10gW0VdY3NtTW90aW9uU3luY19BbmFseXplOiBJbnZhbGlkIGludGVybmFsIG9wZXJhdGlvbi4KAEZ1bmN0aW9uIHBvaW50ZXIgb2YgQWxsb2NEeW5hbWljIGlzIE5VTEwuCgBFMDUwNjMwMDVIAFtDU00gTU9USU9OU1lOQ10gW0VdY3NtTW90aW9uU3luY19BbmFseXplOiBDYW5ub3Qgc3RvcmUgcGFyYW1ldGVyIHZhbHVlcy4KAExpdmUyRCBDdWJpc20gU0RLIE1vdGlvblN5bmMgQ29yZSBbQ1JJXSBWZXJzaW9uICVkLiVkLiVkAEZ1bmN0aW9uIHBvaW50ZXIgb2YgRnJlZSBpcyBOVUxMLgoAU2lsZW5jZQBUaGUgbnVtYmVyIG9mIGF1ZGlvIGNoYW5uZWwoJWQpIGlzIGRpZmZlcmVudCB0byBBRFggZGVjb2RlciBjaGFubmVscyglZCkuCgBBAFcyMDE2MDUwOTk4OkVycm9yIGNhbGxiYWNrIGZ1bmN0aW9uIHdhcyBvdmVyd3JpdHRlbi4gVGhpcyBmdW5jdGlvbiBkb2Vzbid0IHJlY2VpdmUgZXJyb3IgaW5mb3JtYXRpb24gYW55bW9yZS4ASQBFMjAyMzA1MTAyODpDcmlMaXBzTW91dGhNb3JwaFRhcmdldEJsZW5kQW1vdW50SmFwYW5lc2UudSBpcyBhIG5lZ2F0aXZlIHZhbHVlLiBTZXQgYSB2YWx1ZSBvZiAwLjBmIG9yIG1vcmUuAFUARTIwMjMwNTEwMjk6Q3JpTGlwc01vdXRoTW9ycGhUYXJnZXRCbGVuZEFtb3VudEphcGFuZXNlLmUgaXMgYSBuZWdhdGl2ZSB2YWx1ZS4gU2V0IGEgdmFsdWUgb2YgMC4wZiBvciBtb3JlLgBFAEUyMDIzMDUxMDMwOkNyaUxpcHNNb3V0aE1vcnBoVGFyZ2V0QmxlbmRBbW91bnRKYXBhbmVzZS5vIGlzIGEgbmVnYXRpdmUgdmFsdWUuIFNldCBhIHZhbHVlIG9mIDAuMGYgb3IgbW9yZS4ATwBFMjAxOTA4MzAwMAAAAAAAAAAKQ1JJIEJhc2UvRW1zY3JpcHRlbiBWZXIuMi41My41IEJ1aWxkOlNlcCAgNiAyMDIzIDA4OjQ3OjUyCgBBcHBlbmQ6IENsYW5nMTUuMC4wIGVtc2RrLTMuMDEuMDgKAFcyMDE2MDUwOTk5Ok92ZXJ3cml0ZXMgZXhpc3RpbmcgZXJyb3IgY2FsbGJhY2sgZnVuY3Rpb24uADo=");n(g,4340,"PxEAAP////9KEQAA/v///14RAAD9////cREAAPz///+MEQAA+////8IRAAD6////3BE=");n(g,4400,"VW5rbm93biBFcnJvci4APE5vIEVycm9yPgBTb21lIGtpbmQgb2YgZXJyb3IuAEludmFsaWQgcGFyYW1ldGVyLgBGYWlsZWQgdG8gYWxsb2NhdGUgbWVtb3J5LgBUaHJlYWQtdW5zYWZlIGZ1bmN0aW9uIGhhcyBiZWVuIGV4ZWN1dGVkIGluIHBhcmFsbGVsLgBGdW5jdGlvbiBub3QgaW1wbGVtZW50ZWQuAEluaXRpYWxpemUgdGhlIGxpYnJhcnkgYmVmb3JlIGNhbGxpbmcgdGhpcyBmdW5jdGlvbi4ARTIwMDkwNzI0MDI6Q2FuIG5vdCBjaGFuZ2UgYWxsb2NhdG9yLiBBbGxvY2F0ZWQgbWVtb3J5IGlzIHN0aWxsIGFjdGl2ZS4ARTIwMDkwNzI0MDQ6Q2FuIG5vdCBjaGFuZ2UgYWxsb2NhdG9yLiBBbGxvY2F0ZWQgbWVtb3J5IGlzIHN0aWxsIGFjdGl2ZS4ARTIwMTAwNTI2NjA6SW52YWxpZCBhbGxvY2F0aW9uIHNpemUuAEUyMDA5MDgxOTAxOk1lbW9yeSBhbGxvY2F0b3IgaXMgbm90IHJlZ2lzdGVyZWQuAEUyMDA5MDgxOTAyOk1lbW9yeSBhbGxvY2F0b3IgaXMgbm90IHJlZ2lzdGVyZWQuAEUyMDE4MDcxMjAwAEUyMDE4MDQxMDAxAEUyMDE4MDcxMjAxAEUyMDIwMDcyNzIzAEUyMDE4MDQxMTAxAEUyMDE4MDQxMDAyAEUyMDE5MDgyNjU1AEUyMDE5MTAzMDMxAEUyMDE5MDgyNjU2AEUyMDE5MDgyNjU3AEUyMDE5MDgyNjU4AEUyMDE5MDgyNzI2AEUyMDE5MDgyNjU5AEUyMDE5MDgyNjAwAEUyMDE5MTAzMDM3AEUyMDE5MTAzMDE2AEUyMDE5MTExMTIyOlNlY29uZGFyeSBibGVuZCB0YXJnZXQgc3VwcHJlc3Npb24gcmF0ZSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMS4ARTIwMTkxMTExMjM6U21vb3RoaW5nIHdpbmRvdyBsZW5ndGggbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIG1heGltdW0gc21vb3RoaW5nIHdpbmRvdyBsZW5ndGguAEUyMDE5MTExMTI0OlJlbGVhc2UgdGltZSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgbWF4aW11bSBzbW9vdGhpbmcgd2luZG93IGxlbmd0aC4ARTIwMTkxMTExMjY6SG9sZCB0aW1lIG11c3QgYmUgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIDAu");n(g,5408,"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");n(g,17088,"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");n(g,21008,"nnbDvVtdTz/fBBA/18SCPq6AI78OTNE+Kbu9u26Fej85UZs/BKNyP+K9nz9f0wU/QjgTP9kSPz+0doM/58GPPodwjT9bnjO++V0qPoNRATzKNts/X1zyPwlLCEDen+g/fGUfQG8mBkABkAFAz7oLQKPqCEC3stY/63HcP4rRvT92J90/tPEcQHm83j9ITwBAyUESQJEwFkBukf8/CYTsPz9tCsBjKDtA8OoyP2mDEb97rO89SrDBv+u3LMA7UVs+MEDOPgJUCL/YfoA+Ei/MvrQRPECNhlTAyUhBv65rhj8PNI8/0dYGwGbuMj+UjYO/gfjbP12GzD+sCqtAjMcTQLs0a0DD2ChANnhkQDZyAEA0MgJA5F6+P4iK0j/xQOI/QPsCQFoVmkAV1QdA+eQrQAs7okDyb3lAD+dCQHVVA0CsRwE+FVJ+P1FSuL0IHJe+ILqtvw+nIb8+b/u9gHYJPlYkj79fM4E/4lHHP/m5cb/yOJS/nTwPPl+hoj5b3ee+8ZmYP65R0r/3muO9T3RCvr3bfb9XgeE/r1e4Pn7lAb9E0Ly/RqWfPW4omr/ZmAk/+HWov2AJJD90dJw+bqfsvgSiEL+8FIS/LmuwP0/HT70/Y9u/RR+GP0VCTL5+GWk/JSYcvxlZvr9B3Qc/kiy7Pl/ByT4xMXs/fEKbv8L4a789Um4/l532vnSlPD99pry/4QJOP1+hqL21PTq/QMiWv0UgHb6f7p4/b8ZaPKsipz4HRYY+KyMkP9i6bz4iECu/7CnTv9Gj3D9rMl2/a9uPvxu+A77HG8++fQ+WPsopmL1788S/t3u1P5Q0Pr+xOse/f5MyP4VN375Wf9I+XxeRviRvAcD3y8Q/Yjybve/Voj7yiZK/KAbjvxRnpz6Rp1w/NdEDvxJXZz+QKOc9nB9LvsA+2j7+Bb+/c+5sP3zvvD//tc++XRkxv1exvL6YEby9");n(g,21760,"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ZW50cyBvZiBsaXAgcGFyYW1ldGVyIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAxLgBFMjAxOTExMTEwMzpMb3cgcGFzcyBmaWx0ZXIgY29lZmZpY2llbnRzIG9mIGxpcCBwYXJhbWV0ZXIgaW4gcmFwaWQtbW9kZSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMS4ARTIwMTkxMTExMDU6TG93IHBhc3MgZmlsdGVyIGNvZWZmaWNpZW50cyBmb3IgdG9uZ3VlIHBvc2l0aW9uIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAxLgBFMjAxOTExMTEwNjpIb2xkIHRpbWUgb2YgbGlwIHBhcmFtZXRlciBtdXN0IGJlIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiAwLgBFMjAxOTExMTEwNzpSZWxlYXNlIHRpbWUgb2YgbGlwIHBhcmFtZXRlciBtdXN0IGJlIGVxdWFsIHRvIG9yIGdyZWF0ZXIgdGhhbiAwLgBFMjAxOTExMTEwODpIb2xkIHRpbWUgb2YgdG9uZ3VlIHBvc2l0aW9uIG11c3QgYmUgZXF1YWwgdG8gb3IgZ3JlYXRlciB0aGFuIDAuAEUyMDE5MTExMTA5OlJlbGVhc2UgdGltZSBvZiB0b25ndWUgcG9zaXRpb24gbXVzdCBiZSBlcXVhbCB0byBvciBncmVhdGVyIHRoYW4gMC4ARTIwMTkxMTExMTA6TWF4aW11bSBsaXAgaGVpZ2h0IGF0IGxhYmlhbCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMS4ARTIwMTkxMTExMTE6TWF4aW11bSBsaXAgaGVpZ2h0IGF0IGNvcm9uYWwgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEuAEUyMDE5MTExMTEyOkxpcCB3aWR0aCBhdCBzaWxlbmNlIG11c3QgYmUgYmV0d2VlbiAwIGFuZCAxLgBFMjAxOTExMTExMzpMaXAgaGVpZ2h0IGF0IHNpbGVuY2UgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEuAEUyMDE5MTExMTE0OkxpcCBoZWlnaHQgd2l0aCBzb3VuZCBieSBtb3V0aCBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMS4ARTIwMTkxMTExMTU6VG9uZ3VlIHBvc2l0aW9uIGF0IHNpbGVuY2UgbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEuAEUyMDE5MTExMTE2OkxvdyBwYXNzIGZpbHRlciBjb2VmZmljaWVudHMgb2YgbGlwIHBhcmFtZXRlciBtdXN0IGJlIGxlc3MgdGhhbiB0aGF0IGluIHJhcGlkLW1vZGUuAEUyMDE5MTExMTE3OkxpcCBoZWlnaHQgYXQgc2lsZW5jZSBtdXN0IGJlIGxlc3MgdGhhbiB0aGF0IG9mIGxpcCBoZWlnaHQgd2l0aCBzb3VuZCBieSBtb3V0aC4AQ3JpU2pSYmYARTA5MDIxNjIwQjpGYWlsZWQgaW4gY3JpQ3NfQ3JlYXRlKCkuAEUyMDE4MDcwOTA0AEUyMDE4MDcxMDAwAEUyMDE4MDcxMDAxAEUyMDE4MDcxMDAyAEUyMDE5MDUzMDAwAEUyMDE4MDcwOTA3AEUyMDIxMDcwNTMzAEUyMDE5MDYyNzAwAEUyMDE4MDcxMzAwAEUyMDE4MDcwOTA5AEUyMDE4MDcwOTEwAEUyMDE4MDcwOTE0AEUyMDE4MDcwOTExAEUyMDE4MDcxMjA0AEUyMDE4MDcxMjA1AEUyMDE4MDcxMzAzAEUyMDE5MTExNTAxAENyaUFmeE1lbEZpbHRlckJhbmtBbmFseXplcgBFMjAxODA3MjAwMgBFMjAxODA3MTcyOABFMjAxODA3MTcyOQBFMjAxODA3MjAwMABFMjAxODA3MjAyNABFMjAxODA3MjAyNQBFMjAxODA3MTcyNABFMjAxODA3MjAyOABFMjAxODA3MjAyOQBFMjAxODA3MTcyMgBFMjAxODA3MjAzNQBFMjAxODA3MjAzNgBFMjAxODA3MjA0MgBFMjAxOTAzMDcxMgBFMjAxOTAzMDcxMwBFMjAxOTAzMDcxNABFMjAxOTAzMDcxNQBFMjAxOTEyMTAwMQBFMjAxOTAzMDcxNgBFMjAxOTAzMDcxNwAAAAAACkNSSSBMaXBzIENvcmUvRW1zY3JpcHRlbiBWZXIuMS4wMC4xNiBCdWlsZDpTZXAgIDYgMjAyMyAwODo0Nzo1MwoAQXBwZW5kOiBDbGFuZzE1LjAuMCBlbXNkay0zLjAxLjA4CgBFMjAxODA3MjAwNTpjcmlBZnhNZWxGaWx0ZXJCYW5rQW5hbHl6ZXJfRGVzdHJveSgpIEZhaWxlZC4ARTIwMTgwNzIwMDY6Y3JpQWZ4TWVsRmlsdGVyQmFua0FuYWx5emVyX0Rlc3Ryb3koKSBGYWlsZWQuAEUyMDE5MTAyNDA1OkZhaWxlZCB0byBwdXQgc2FtcGxlcy4gQnVmZmVyIG1hbmFnZW1lbnQgcHJvY2VzcyBtaWdodCBiZSBicm9rZW4uAEUyMDE5MTAyNDA2Ok1GQiBhbmFseXplciBpcyBub3QgcmVhZHkuIEJ1ZmZlciBtYW5hZ2VtZW50IHByb2Nlc3MgbWlnaHQgYmUgYnJva2VuLgBFMjAxOTA3MDEwNDpJbnRlcm5hbCBjbGFzcyBwb3N0ZXJpb3IgcHJvYmFiaWxpdHkgaXMgaW52YWxpZC4ARTIwMTkwNjI1MTI6RmFpbGVkIHRvIHB1dCBzYW1wbGVzLiBCdWZmZXIgbWFuYWdlbWVudCBwcm9jZXNzIG1pZ2h0IGJlIGJyb2tlbi4ARTIwMTkwNjI1MDU6TUZCIGFuYWx5emVyIGlzIG5vdCByZWFkeS4gQnVmZmVyIG1hbmFnZW1lbnQgcHJvY2VzcyBtaWdodCBiZSBicm9rZW4uAEUyMDIwMDIyMTIyOkRpc2NyZXRpemF0aW9uIHR5cGUgaXMgaW52YWxpZC4ARTIwMTkxMTA4NTY6U2lsZW5jZSB0aHJlc2hvbGQgKGRCKSBtdXN0IGJlIGxlc3MgdGhhbiBvciBlcXVhbCB0byAwLgBFMjAxOTA5MjUwODpMYWJpYWwgaG9sZCB0aW1lIG11c3QgYmUgcG9zaXRpdmUu");n(g,294196,"AQAAAAIAAAADAAAAAQAAAAIAAAADAAAAAQAAAAIAAAADAAAAAAAAAAIAAAAAAAAAAg==");n(g,294292,"AgAAAAMAAAADAAAAAgAAAAMAAAADAAAAAQAAAAMAAAAD");n(g,294340,"AwAAAAQAAAAAAAAACkNSSSBMaXBzL0Vtc2NyaXB0ZW4gVmVyLjEuMDMuMDAgQnVpbGQ6U2VwICA2IDIwMjMgMDg6NDc6NTQKAEFwcGVuZDogQ2xhbmcxNS4wLjAgZW1zZGstMy4wMS4wOAoARTIwMTkwNjIyMjU6TWlzbWF0Y2ggYmV0d2VlbiBDUkkgTGlwcyBoZWFkZXIgdmVyc2lvbiBhbmQgbGlua2VkIGxpYnJhcnkgdmVyc2lvbi4gKExpYnJhcnkgdmVyc2lvbiBpcyAweCUwOFgsIGJ1dCB0aGUgc3BlY2lmaWVkIHZlcnNpb24gaXMgMHglMDhYLikARTIwMTkwNjIyMjYARTIwMTYxMTA3MTAAAAIAAAD0fgQAQ1JJV0FSRS9CaXF1YWQAAAQAAAAFAAAABgAAAAcAAAAIAAAACQAAAAoAAAALAAAADAAAAA0AAAACAAAAPH8EAENSSVdBUkUvUGl0Y2hTaGlmdGVyAAAAAA4AAAAPAAAAEAAAABEAAAASAAAAEwAAABQAAAAVAAAAFgAAABcAAABFMjAyMzA0MTEyMzpDcmlMaXBzTW91dGhPcGVuQ29uZmlnLmV4cGVjdGVkX3VwZGF0ZV9yYXRlX3Blcl9zZWMgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMC4ARTIwMjMwNDExMjQ6Q3JpTGlwc01vdXRoT3BlbkNvbmZpZy5udW1fYW50aV9zaGFrZV9zbW9vdGhpbmdfc2FtcGxlIG11c3QgYmUgZ3JlYXRlciB0aGFuIG9yIGVxdWFsIHRvIDAuAEUyMDIzMDQwNDAwOkZhaWxlZCB0byBjcmVhdGUgQ3JpTGlwc01vdXRoT3BlbkhuLiBUaGUgd29yayBhZGRyZXNzIGlzIE5VTEwuAEUyMDIzMDQxMTI1OkZhaWxlZCB0byBjcmVhdGUgQ3JpTGlwc01vdXRoT3BlbkhuLiBDcmlMaXBzTW91dGhPcGVuQ29uZmlnLmV4cGVjdGVkX3VwZGF0ZV9yYXRlX3Blcl9zZWMgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMC4ARTIwMjMwNDExMjY6RmFpbGVkIHRvIGNyZWF0ZSBDcmlMaXBzTW91dGhPcGVuSG4uIENyaUxpcHNNb3V0aE9wZW5Db25maWcubWF4X2FudGlfc2hha2Vfc21vb3RoaW5nX2xlbmd0aF9zZWMgbXVzdCBiZSBncmVhdGVyIHRoYW4gb3IgZXF1YWwgdG8gMC4ARTIwMjMwNDExMjg6RmFpbGVkIHRvIGNyZWF0ZSBDcmlMaXBzTW91dGhPcGVuSG4uIHdvcmtfc2l6ZSBpcyBzbWFsbGVyIHRoYW4gcmVxdWlyZWQgd29yayBzaXplIDogJWQAVzIwMjMwNTA4MDA6RGlzYWJsZSBhIENyaUxpcHNNb3V0aE9wZW5CZWhhdmlvdXJQYXJhbXMuYW50aV9zaGFrZS4gQ3JpTGlwc01vdXRoT3BlbkNvbmZpZy5tYXhfYW50aV9zaGFrZV9zbW9vdGhpbmdfbGVuZ3RoX3NlYyBpcyAwLjBmLgBXMjAyMzA1MDgwMTpEaXNhYmxlIGEgQ3JpTGlwc01vdXRoT3BlbkJlaGF2aW91clBhcmFtcy5hbnRpX3NoYWtlLiBDcmlMaXBzTW91dGhPcGVuQ29uZmlnLmV4cGVjdGVkX3VwZGF0ZV9yYXRlX3Blcl9zZWMgaXMgMC4ARTIwMjIxMTE3MDA6Q3JpTGlwc01vdXRoT3BlbkhuIGlzIE5VTEwuAEUyMDIzMDQwNzA0OkNyaUxpcHNNb3V0aE9wZW5IbiBpcyBOVUxMLgBFMjAyMzA0MDQwMzpDcmlMaXBzTW91dGhNb3JwaFRhcmdldEJsZW5kQW1vdW50SmFwYW5lc2UgaXMgTlVMTC4ARTIwMjMwNDA3MjA6Q3JpTGlwc01vdXRoT3BlbkhuIGlzIE5VTEwuAEUyMDIzMDQyMTA3OkNyaUxpcHNNb3V0aE9wZW5IbiBpcyBOVUxMLgBFMjAyMzA0MjEwODpDcmlMaXBzTW91dGhPcGVuQmVoYXZpb3VyQ29uZmlnIGlzIE5VTEwuAEUyMDIzMDUwODAwOkNyaUxpcHNNb3V0aE9wZW5CZWhhdmlvdXJQYXJhbXMgaXMgTlVMTC4ARTIwMjMwNTEwMjI6SW5jb3JyZWN0IENyaUxpcHNNb3V0aE1vcnBoVGFyZ2V0QmxlbmRBbW91bnRKYXBhbmVzZSBkYXRhIHdhcyBlbnRlcmVkLgBFMjAyMzA1MTAyNjpDcmlMaXBzTW91dGhNb3JwaFRhcmdldEJsZW5kQW1vdW50SmFwYW5lc2UuYSBpcyBhIG5lZ2F0aXZlIHZhbHVlLiBTZXQgYSB2YWx1ZSBvZiAwLjBmIG9yIG1vcmUuAEUyMDIzMDUxMDI3OkNyaUxpcHNNb3V0aE1vcnBoVGFyZ2V0QmxlbmRBbW91bnRKYXBhbmVzZS5pIGlzIGEgbmVnYXRpdmUgdmFsdWUuIFNldCBhIHZhbHVlIG9mIDAuMGYgb3IgbW9yZS4ARTIwMTkwODA2MDE6SW5wdXQgc2FtcGxpbmcgcmF0ZSBpcyB0b28gbG93LiBTaG91bGQgYmUgZXF1YWwgdG8gb3IgaGlnaGVyIHRoYW4gJWQuAEUyMDE5MDgwNjAyOklucHV0IHNhbXBsaW5nIHJhdGUgaXMgdG9vIGhpZ2guIFNob3VsZCBiZSBlcXVhbCB0byBvciBsb3dlciB0aGFuICVkLgBFMjAxOTA2MjIwNABFMjAxOTA2MjIwNTpGYWlsZWQgdG8gY3JlYXRlIENyaUNzSG4uAEUyMDIwMDUxMjAwOkludmFsaWQgYmVoYXZpb3VyIHBhcmFtZXRlciBwcmVzZXQuAEUyMDE5MDYyMjE1OkZhaWxlZCB0byBjcmVhdGUgY29yZSBtb2R1bGUuAEUyMDE5MDgwNjAzOkZhaWxlZCB0byBjcmVhdGUgcmVzYW1wbGVyLgBFMjAxOTA2MjIwNwBFMjAxOTA2MjIwOQBFMjAxOTA2MjIxNDpGb3JtYXQgb2YgaW5wdXQgZGF0YSBpcyBpbnZhbGlkLiBQbGVhc2Ugc2V0IGlucHV0X2Zvcm1hdCBvZiBDcmlMaXBzTW91dGhDb25maWcgdG8gQ1JJTElQU19TQU1QTEVfRk9STUFUX0ZMT0FUMzIuAEUyMDE5MDYyMjEwAEUyMDE5MDgxNDAxAEUyMDE5MDgxNDAyOk1vcnBoIHRhcmdldCB0eXBlIG11c3QgYmUgSkFQQU5FU0VfQUlVRU8uAEUyMDE5MDYyMjExAEUyMDE5MDgxNDAwOkludmFsaWQgbW9ycGggdGFyZ2V0IHR5cGUuAAAAAAAAAAD+gitlRxVnQAAAAAAAADhDAAD6/kIudr86O568mvcMvb39/////98/PFRVVVVVxT+RKxfPVVWlPxfQpGcREYE/AAAAAAAAyELvOfr+Qi7mPyTEgv+9v84/tfQM1whrrD/MUEbSq7KDP4Q6Tpvg11U/");n(g,297054,"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");n(g,302563,"QPsh+T8AAAAALUR0PgAAAICYRvg8AAAAYFHMeDsAAACAgxvwOQAAAEAgJXo4AAAAgCKC4zYAAAAAHfNpNb7z+HnsYfY/GTCWW8b+3r89iK9K7XH1P6T81DJoC9u/sBDw8DmV9D97tx8Ki0HXv4UDuLCVyfM/e89tGumd07+lZIgMGQ3zPzG28vObHdC/oI4LeyJe8j/wejsbHXzJvz80GkpKu/E/nzyvk+P5wr+65YrwWCPxP1yNeL/LYLm/pwCZQT+V8D/OX0e2nW+qvwAAAAAAAPA/AAAAAAAAAACsR5r9jGDuPz31JJ/KOLM/oGoCH7Ok7D+6kThUqXbEP+b8alc2IOs/0uTESguEzj8tqqFj0cLpPxxlxvBFBtQ/7UF4A+aG6D/4nxssnI7YP2JIU/XcZ+c/zHuxTqTg3D8LbknJFnbSP3rGdaBpGde/3bqnbArH3j/I9r5IRxXnvyu4KmVHFfc/kKEEAC0rICAgMFgweAAtMFgrMFggMFgtMHgrMHggMHgAbmFuAGluZgBOQU4ASU5GAC4AKG51bGwp");n(g,302992,"GQAKABkZGQAAAAAFAAAAAAAACQAAAAALAAAAAAAAAAAZABEKGRkZAwoHAAEACQsYAAAJBgsAAAsABhkAAAAZGRk=");n(g,303073,"DgAAAAAAAAAAGQAKDRkZGQANAAACAAkOAAAACQAOAAAO");n(g,303131,"DA==");n(g,303143,"EwAAAAATAAAAAAkMAAAAAAAMAAAM");n(g,303189,"EA==");n(g,303201,"DwAAAAQPAAAAAAkQAAAAAAAQAAAQ");n(g,303247,"Eg==");n(g,303259,"EQAAAAARAAAAAAkSAAAAAAASAAASAAAaAAAAGhoa");n(g,303314,"GgAAABoaGgAAAAAAAAk=");n(g,303363,"FA==");n(g,303375,"FwAAAAAXAAAAAAkUAAAAAAAUAAAU");n(g,303421,"Fg==");n(g,303433,"FQAAAAAVAAAAAAkWAAAAAAAWAAAWAAAwMTIzNDU2Nzg5QUJDREVG");n(g,303472,"GAAAABkAAAAaAAAAGwAAABwAAAAdAAAAAACAQAAAAAAF");n(g,303516,"IQ==");n(g,303540,"IgAAACMAAAD4wQQAAAQ=");n(g,303564,"AQ==");n(g,303580,"/////wo=");n(g,303648,"8MdU")}var t=new ArrayBuffer(16);var u=new Int32Array(t);var v=new Float32Array(t);var w=new Float64Array(t);function x(y){return u[y]}function z(y,A){u[y]=A}function B(){return w[0]}function C(A){w[0]=A}function D(A){v[2]=A}function E(){return v[2]}function ja(ka){var F=ka.a;var G=F.buffer;var H=new Int8Array(G);var I=new Int16Array(G);var J=new Int32Array(G);var K=new Uint8Array(G);var L=new Uint16Array(G);var M=new Uint32Array(G);var N=new Float32Array(G);var O=new Float64Array(G);var P=Math.imul;var Q=Math.fround;var R=Math.abs;var S=Math.clz32;var T=Math.min;var U=Math.max;var V=Math.floor;var W=Math.ceil;var X=Math.trunc;var Y=Math.sqrt;var Z=ka.abort;var _=NaN;var $=Infinity;var aa=ka.b;var ba=ka.c;var ca=ka.d;var da=5556208;var ea=0;var fa=0;var ga=0;
// EMSCRIPTEN_START_FUNCS
function Oe(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=Q(0),h=0,i=0,j=0,k=Q(0),l=0,m=0,n=Q(0),o=0,p=Q(0),q=0,r=0,s=Q(0),t=0,u=0,v=0,w=0,x=0,y=Q(0);v=da-32|0;da=v;a:{if(!J[76213]){sa(4,1288,0);break a}b:{if(!(!b|(c|0)<=0)){while(1){j=P(d,24)+b|0;if(!J[j>>2]|!J[j+8>>2]){break b}d=d+1|0;if((d|0)!=(c|0)){continue}break}if(!a){d=0;sa(4,1770,0);break a}d=J[76214];c:{if(d){j=ha[d|0](128)|0;break c}j=Za(128)}if(!j){d=0;sa(4,1888,0);break a}J[j+124>>2]=0;J[j+116>>2]=0;J[j+120>>2]=0;J[j>>2]=0;d:{e:{if((c|0)<=0){break e}d=0;f:{while(1){f=P(d,24)+b|0;if(!Ra(3634,J[f>>2])){break f}d=d+1|0;if((d|0)!=(c|0)){continue}break}break e}d=0;J[j+4>>2]=0;J[j>>2]=f;while(1){e=P(d,24)+b|0;if(Ra(3717,J[e>>2])){e=1;d=d+1|0;if((d|0)!=(c|0)){continue}break e}break}d=0;J[j+8>>2]=0;J[j+4>>2]=e;g:{while(1){e=P(d,24)+b|0;if(!Ra(3829,J[e>>2])){break g}d=d+1|0;if((d|0)!=(c|0)){continue}break}e=2;break e}d=0;J[j+12>>2]=0;J[j+8>>2]=e;h:{while(1){e=P(d,24)+b|0;if(!Ra(3938,J[e>>2])){break h}d=d+1|0;if((d|0)!=(c|0)){continue}break}e=3;break e}d=0;J[j+16>>2]=0;J[j+12>>2]=e;while(1){e=P(d,24)+b|0;if(Ra(4047,J[e>>2])){e=4;d=d+1|0;if((d|0)!=(c|0)){continue}break e}break}d=0;J[j+20>>2]=0;J[j+16>>2]=e;while(1){e=P(d,24)+b|0;if(!Ra(4156,J[e>>2])){break d}e=5;d=d+1|0;if((d|0)!=(c|0)){continue}break}}J[v+16>>2]=J[(e<<2)+1984>>2];sa(4,2008,v+16|0);a=J[76215];if(a){ha[a|0](j);d=0;break a}Ia(j);d=0;break a}J[j+24>>2]=c;J[j+20>>2]=e;b=J[a+4>>2];a=J[a>>2];J[j+104>>2]=a;J[j+108>>2]=b;i:{if(a-128001>>>0>=4294855295){b=b-16|0;if(!b|(b|0)==16){break i}}d=0;sa(4,2114,0);a=J[76215];if(a){ha[a|0](j);break a}Ia(j);break a}J[j+96>>2]=100;J[j+100>>2]=1;J[j+88>>2]=0;J[j+92>>2]=-1038090240;J[j+80>>2]=1;J[j+84>>2]=0;J[j+76>>2]=a;a=0;h=da-528|0;da=h;J[h+120>>2]=0;J[h+124>>2]=0;J[h+112>>2]=0;J[h+116>>2]=0;J[h+104>>2]=0;J[h+108>>2]=0;J[h+96>>2]=0;J[h+100>>2]=0;d=da-112|0;da=d;c=j+76|0;if(!c){J[h+504>>2]=1;J[h+496>>2]=-1038090240;J[h+500>>2]=100;J[h+488>>2]=0;J[h+492>>2]=0;J[h+480>>2]=48e3;J[h+484>>2]=1;c=h+480|0}j:{k:{b=c;if(!b){J[d+88>>2]=1;J[d+80>>2]=-1038090240;J[d+84>>2]=100;J[d+72>>2]=0;J[d+76>>2]=0;J[d+64>>2]=48e3;J[d+68>>2]=1;b=d- -64|0;break k}e=J[b>>2];l:{if((e|0)<=15999){Lb(296299,16e3);break l}if(e>>>0<128001){break k}Lb(296381,128e3)}b=-1;break j}e=d+96|0;ta(e);ma(e,464,1,8);f=(P($b(),16e3)>>>0)/1e3|0;f=J[b>>2]==16e3?f:f+14|0;ma(e,4,f,16);ma(e,8,1,8);J[d+56>>2]=1;J[d+48>>2]=1182400512;J[d+52>>2]=1;J[d+60>>2]=nb(J[b+8>>2]);ma(e,_b(d+48|0),1,4);m=J[b>>2];if((m|0)!=16e3){e=d+96|0;ma(e,52,1,8);m=((P(f,m)|0)/16e3<<2)+60&-32;ma(e,m,1,16);J[d+40>>2]=0;J[d+44>>2]=0;J[d+28>>2]=1;J[d+16>>2]=1;J[d+20>>2]=1;J[d+32>>2]=0;J[d+36>>2]=0;J[d+24>>2]=J[b>>2];ma(e,pb(d+16|0),1,1);ma(e,m,1,16)}if(J[77941]==1){J[d+40>>2]=0;J[d+44>>2]=0;J[d+32>>2]=0;J[d+36>>2]=0;J[d+16>>2]=1;J[d+20>>2]=1;J[d+24>>2]=16e3;J[d+28>>2]=1;J[d+12>>2]=1082130432;J[d+4>>2]=1077936128;J[d+8>>2]=1149239296;J[d+36>>2]=d+4;e=d+96|0;ma(e,cb(d+16|0),1,1);ma(e,cb(d+16|0),1,1);f=f<<2;ma(e,f,1,16);ma(e,f,1,16)}e=d+16|0;jd(J[b+20>>2],e);f=d+96|0;ma(f,bb(e),1,4);id(J[b+20>>2],J[b+8>>2],e);ma(f,bb(e),1,4);J[d+16>>2]=100;J[d+20>>2]=0;J[d+20>>2]=1056964608;ma(f,Xb(e),1,4);b=J[f+12>>2]}da=d+112|0;m:{if((b|0)<0){break m}n:{r=Md(b);if(!r&(b|0)!=0){oa(296463,-3);if(!r){break m}break n}Wb(r,b);a=h+512|0;ya(r,b,a);a=pa(a,464,8);d=(P($b(),16e3)>>>0)/1e3|0;J[a+396>>2]=d;J[a+400>>2]=d;if(J[c>>2]!=16e3){d=d+14|0;J[a+396>>2]=d}b=h+512|0;J[a+392>>2]=pa(b,d<<2,16);b=pa(b,8,8);J[a+24>>2]=b;if(!b){a=0;na(0,296475);if(r){break n}break m}b=h+128|0;J[b+16>>2]=-1038090240;J[b+8>>2]=1;J[b+12>>2]=0;J[b>>2]=1182400512;J[b+4>>2]=1;d=ra(b+20|0,0,256);J[d+8>>2]=0;J[d+12>>2]=0;J[d>>2]=1045220557;J[d+4>>2]=1045220557;J[d+16>>2]=0;J[d+20>>2]=0;Wd(0,b+276|0);b=J[c+12>>2];b=b?(b|0)==1?1:2:0;if((b|0)==2){a=0;na(0,296513);if(r){break n}break m}Wd(b,h+404|0);J[h+136>>2]=1;J[h+128>>2]=1182400512;J[h+132>>2]=1;J[h+140>>2]=nb(J[c+8>>2]);N[h+144>>2]=N[c+16>>2];b=da-16|0;da=b;ta(b);m=h+128|0;ma(b,_b(m),1,4);d=J[b+12>>2];da=b+16|0;b=pa(h+512|0,_b(m),4);f=da-304|0;da=f;e=b;b=f+288|0;ya(e,d,b);b=pa(b,556,4);g=jb(N[m>>2],N[77917]);o:{if(g<Q(4294967296)&g>=Q(0)){d=~~g>>>0;break o}d=0}J[b>>2]=d;J[b+512>>2]=J[m+12>>2];J[b+544>>2]=J[m+4>>2];J[b+548>>2]=J[m+8>>2];J[b+528>>2]=0;J[b+532>>2]=0;ra(b+8|0,0,192);Vd(f,N[m>>2]);J[f+28>>2]=J[77924];J[f+32>>2]=J[77928];J[b+4>>2]=J[f+4>>2];d=f+288|0;J[b+524>>2]=oc(f,pa(d,Ua(f),4),xb(f));Ud(f,N[m>>2]);J[f+28>>2]=J[77919];J[f+32>>2]=J[77923];e=J[b+4>>2];l=J[f+4>>2];J[b+4>>2]=e>>>0>l>>>0?e:l;J[b+520>>2]=oc(f,pa(d,Ua(f),4),xb(f));qb(f);J[b+492>>2]=fc(f,pa(d,Ma(f),4),gc(f));Td(f);J[f+4>>2]=1;l=pa(d,ac(f),4);e=da-16|0;da=e;p:{if(!f){oa(293316,-2);d=-1;break p}ta(e);ma(e,ac(f),1,4);d=J[e+12>>2]}da=e+16|0;e=da-16|0;da=e;q:{if(!(l?f:0)){d=0;oa(293328,-2);break q}ya(l,d,e);d=pa(e,16,4);l=J[f>>2];J[d>>2]=pa(e,l<<2,4);o=J[f+4>>2];J[d+4>>2]=l;J[d+12>>2]=o;Yd(d)}da=e+16|0;J[b+500>>2]=d;if(J[m+4>>2]){g=N[m>>2];N[f>>2]=g/jb(g,N[77917]);qa(f+4|0,m+280|0,52);u=f+288|0;e=pa(u,Db(),4);d=da-16|0;da=d;ta(d);ma(d,Db(),1,4);da=d+16|0;l=da-16|0;da=l;ya(e,J[d+12>>2],l);e=pa(l,72,4);J[e>>2]=Bb(l,N[f+4>>2]);J[e+4>>2]=Bb(l,N[f+4>>2]);J[e+8>>2]=Bb(l,N[f+12>>2]);g=N[f>>2];N[e+48>>2]=g;N[e+20>>2]=Fa(g,Q(.00800000037997961));g=N[f+4>>2];r:{if(wa(g)){d=1;if(xa(g,Q(1))){break r}}na(0,291724);d=0}g=N[f+8>>2];s:{if(wa(g)){if(xa(g,Q(1))){break s}}d=0;na(0,291807)}g=N[f+12>>2];t:{if(wa(g)){if(xa(g,Q(1))){break t}}d=0;na(0,291904)}if(!wa(N[f+16>>2])){na(0,291990);d=0}if(!wa(N[f+20>>2])){na(0,292065);d=0}if(!wa(N[f+24>>2])){na(0,292143);d=0}if(!wa(N[f+28>>2])){na(0,292220);d=0}g=N[f+32>>2];u:{if(wa(g)){if(xa(g,Q(1))){break u}}d=0;na(0,292300)}g=N[f+36>>2];v:{if(wa(g)){if(xa(g,Q(1))){break v}}d=0;na(0,292366)}g=N[f+40>>2];w:{if(wa(g)){if(xa(g,Q(1))){break w}}d=0;na(0,292433)}g=N[f+44>>2];x:{if(wa(g)){if(xa(g,Q(1))){break x}}d=0;na(0,292491)}g=N[f+48>>2];y:{if(wa(g)){if(xa(g,Q(1))){break y}}d=0;na(0,292550)}g=N[f+52>>2];z:{if(wa(g)){if(xa(g,Q(1))){break z}}d=0;na(0,292618)}if(!xa(N[f+4>>2],N[f+8>>2])){na(0,292682);d=0}if(!xa(N[f+44>>2],N[f+48>>2])){na(0,292778);d=0}if(d){N[e+12>>2]=N[f+4>>2];N[e+16>>2]=N[f+8>>2];d=J[e+8>>2];N[d+16>>2]=N[f+12>>2];k=N[f+16>>2];N[e+52>>2]=k;g=N[e+48>>2];k=Fa(g,k);A:{if(k<Q(4294967296)&k>=Q(0)){o=~~k>>>0;break A}o=0}t=J[e>>2];J[t+8>>2]=o;q=J[e+4>>2];J[q+8>>2]=o;k=N[f+20>>2];N[e+56>>2]=k;k=Fa(g,k);N[t+12>>2]=k;N[q+12>>2]=k;k=N[f+24>>2];N[e+60>>2]=k;k=Fa(g,k);B:{if(k<Q(4294967296)&k>=Q(0)){o=~~k>>>0;break B}o=0}J[d+8>>2]=o;k=N[f+28>>2];N[e+64>>2]=k;N[d+12>>2]=Fa(g,k);N[e+24>>2]=N[f+32>>2];N[e+28>>2]=N[f+36>>2];N[e+40>>2]=N[f+40>>2];N[e+32>>2]=N[f+44>>2];N[e+36>>2]=N[f+48>>2];N[e+44>>2]=N[f+52>>2]}Ec(e);da=l+16|0;J[b+504>>2]=e;qb(f);J[b+488>>2]=fc(f,pa(u,Ma(f),4),gc(f))}if(J[m+8>>2]){Sd(f,J[m+12>>2]);d=J[m+344>>2];J[f+20>>2]=J[m+340>>2];J[f+24>>2]=d;d=J[m+336>>2];J[f+12>>2]=J[m+332>>2];J[f+16>>2]=d;qa(f+28|0,m+20|0,256);w=f+288|0;e=pa(w,Gb(f),4);d=da-16|0;da=d;ta(d);ma(d,Gb(f),1,4);o=J[d+12>>2];da=d+16|0;l=da-32|0;da=l;u=Pa(J[f>>2]);d=e;e=l+16|0;ya(d,o,e);d=pa(e,72,4);t=u<<2;J[d+8>>2]=pa(e,t,4);p=N[f+4>>2];n=N[f+8>>2];Kc(l+8|0,p,n);if((u|0)>0){while(1){o=l+8|0;x=pa(l+16|0,P(Ib(o),u),4);q=da-16|0;da=q;C:{if(!o){oa(4998,-2);e=-1;break C}ta(q);ma(q,Ib(o),1,4);e=J[q+12>>2]}da=q+16|0;q=da-16|0;da=q;D:{if(!(x?o:0)){e=0;oa(5010,-2);break D}ya(x,e,q);g=N[o>>2];k=N[o+4>>2];o=Nc(g,k);e=pa(q,20,4);J[e>>2]=pa(q,o<<2,4);J[e+16>>2]=0;J[e+12>>2]=o;N[e+8>>2]=k;N[e+4>>2]=g;Mc(e,Q(0))}da=q+16|0;J[J[d+8>>2]+(i<<2)>>2]=e;i=i+1|0;if((u|0)!=(i|0)){continue}break}n=N[f+8>>2];p=N[f+4>>2]}J[d+44>>2]=pa(l+16|0,t,4);J[d+48>>2]=pa(l+16|0,t,4);J[d+52>>2]=pa(l+16|0,t,4);J[d+56>>2]=pa(l+16|0,t,4);N[d+12>>2]=n;N[d>>2]=p;i=J[f>>2];J[d+4>>2]=i;J[d+68>>2]=4;J[d+60>>2]=Pa(i);g=N[f+12>>2];E:{if(wa(g)){i=1;if(xa(g,Q(1))){break E}}na(0,5094);i=0}g=N[f+16>>2];F:{if(wa(g)){if(xa(g,N[d+12>>2])){break F}}i=0;na(0,5171)}g=N[f+24>>2];G:{if(wa(g)){if(xa(g,N[d+12>>2])){break G}}i=0;na(0,5262)}if(!wa(N[f+20>>2])){na(0,5342);i=0}if(i){N[d+64>>2]=N[f+12>>2];g=N[f+20>>2];N[d+28>>2]=g;g=Fa(N[d>>2],g);H:{if(g<Q(4294967296)&g>=Q(0)){e=~~g>>>0;break H}e=0}J[d+40>>2]=e;N[d+16>>2]=N[f+16>>2];N[d+20>>2]=N[f+24>>2]}qa(J[d+44>>2],f+28|0,J[d+60>>2]<<2);Jc(d);da=l+32|0;J[b+508>>2]=d;J[b+516>>2]=Pa(J[f>>2]);qb(f);J[b+496>>2]=fc(f,pa(w,Ma(f),4),gc(f))}Qd(b);g=N[m+276>>2];I:{if(g<Q(0)){na(0,294102);break I}N[b+540>>2]=g;g=Q(Q(g*Q(1e3))/N[77917]);J:{if(g<Q(4294967296)&g>=Q(0)){d=~~g>>>0;break J}d=0}J[b+536>>2]=d}g=N[m+16>>2];K:{if(g>Q(0)){na(0,294034);break K}N[b+484>>2]=g}da=f+304|0;J[a>>2]=b;if(!b){a=0;na(0,296561);if(r){break n}break m}L:{if(J[c>>2]==16e3){break L}b=pa(h+512|0,52,8);J[b+12>>2]=1;J[b>>2]=0;J[b+4>>2]=4096;Yb(b);J[a+28>>2]=b;if(!b){a=0;na(0,296603);if(r){break n}break m}d=J[c>>2];M:{if(!b){oa(294607,-2);break M}d=(d|0)>1?d:1;d=((d>>>0<128e3?d:128e3)<<12)/16e3|0;d=(d|0)>1?d:1;J[b+4>>2]=d;if(d>>>0<=4095){J[b>>2]=4096/((d&65535)>>>0);break M}J[b>>2]=0;if((d|0)==4096){Yb(b)}}b=Ld(J[a+28>>2],J[a+400>>2])+7&-8;J[a+408>>2]=b;J[a+404>>2]=pa(h+512|0,b<<2,16);b=J[c>>2];if((b|0)==16e3){break L}J[a+32>>2]=294620;J[h+108>>2]=1;J[h+96>>2]=1;J[h+100>>2]=1;J[h+104>>2]=b;d=h+96|0;b=pb(d);J[a+44>>2]=b;i=h+512|0;e=pa(i,b,1);J[a+40>>2]=e;b=Kd(d,e,b);J[a+36>>2]=b;ha[J[J[J[a+32>>2]+4>>2]+24>>2]](b,0,Q(0));ha[J[J[J[a+32>>2]+4>>2]+24>>2]](J[a+36>>2],1,Q(16e3));ha[J[J[J[a+32>>2]+4>>2]+32>>2]](J[a+36>>2]);ha[J[J[J[a+32>>2]+4>>2]+16>>2]](J[a+36>>2]);b=J[a+408>>2];J[a+416>>2]=b;J[a+412>>2]=pa(i,b<<2,16)}if(J[77941]==1){J[a+440>>2]=294684;J[h+88>>2]=0;J[h+92>>2]=0;J[h+80>>2]=0;J[h+84>>2]=0;J[h+64>>2]=1;J[h+68>>2]=1;J[h+72>>2]=16e3;J[h+76>>2]=256;J[h+60>>2]=1082130432;J[h+52>>2]=1065353216;J[h+56>>2]=1149239296;J[h+84>>2]=h+52;i=h- -64|0;b=cb(i);d=h+512|0;J[a+424>>2]=Gd(i,pa(d,b,1),b);e=J[J[J[a+440>>2]+4>>2]+8>>2];J[a+428>>2]=ha[e|0](i,pa(d,b,1),b);b=J[a+396>>2];J[a+444>>2]=b;b=b<<2;J[a+432>>2]=pa(d,b,1);J[a+436>>2]=pa(d,b,1);ha[J[J[J[a+440>>2]+4>>2]+16>>2]](J[a+424>>2]);ha[J[J[J[a+440>>2]+4>>2]+16>>2]](J[a+428>>2])}b=h- -64|0;jd(J[c+20>>2],b);d=yd(b);i=h+512|0;J[a+112>>2]=xd(b,pa(i,bb(b),4),d);id(J[c+20>>2],J[c+8>>2],b);d=yd(b);J[a+384>>2]=xd(b,pa(i,bb(b),4),d);d=nb(J[c+8>>2]);J[a+20>>2]=J[c+8>>2];J[a+388>>2]=Pa(d);J[h+64>>2]=100;J[h+68>>2]=0;J[h+68>>2]=1056964608;d=sd(b);i=pa(i,Xb(b),4);f=da-80|0;da=f;N:{if(!i){d=0;na(0,294959);break N}O:{P:{if(!b){J[f+56>>2]=100;J[f+60>>2]=1056964608;p=Q(.5);b=f+56|0;g=Q(100);break P}e=J[b>>2];if((e|0)<0){d=0;na(0,295034);break N}p=N[b+4>>2];if(p<Q(0)){break O}g=Q(e|0)}e=sd(b);if((e|0)>(d|0)){d=0;Lb(295315,e);break N}Wb(i,d);ya(i,d,f- -64|0);e=f- -64|0;d=pa(e,80,4);g=Q(p*g);Q:{if(Q(R(g))<Q(2147483648)){i=~~g;break Q}i=-2147483648}J[d+36>>2]=pa(e,i<<2,4);J[d+8>>2]=pa(e,8,8);J[d+32>>2]=J[b>>2];g=N[b+4>>2];J[d+40>>2]=i;N[d+48>>2]=g;i=f+8|0;ra(i,0,48);R:{if(!i){na(0,295949);break R}J[i+16>>2]=1065353216;J[i+20>>2]=1;J[i+8>>2]=1065353216;J[i+12>>2]=1065353216;J[i>>2]=1065353216;J[i+4>>2]=1065353216;J[i+40>>2]=1045220557;J[i+44>>2]=1045220557;J[i+24>>2]=1022739087;J[i+28>>2]=1;J[i+32>>2]=1058642330;J[i+36>>2]=1053609165}i=J[f+28>>2];S:{T:{if(N[b+4>>2]==Q(0)){e=295414;if(i){break T}}if(J[b>>2]){break S}e=295548;if(!i){break S}}na(1,e);J[f+28>>2]=0}b=f+8|0;U:{if(!d){na(0,295856);break U}if(!b){na(0,295896);break U}g=N[b+16>>2];k=N[b+12>>2];p=N[b+8>>2];s=N[b+4>>2];n=N[b>>2];if(n<Q(0)){na(1,296085);n=Q(0);y=N[b+4>>2]}else{y=s}if(y<Q(0)){na(1,296192);s=Q(0)}if(N[b+8>>2]<Q(0)){na(1,3831);p=Q(0)}if(N[b+12>>2]<Q(0)){na(1,3940);k=Q(0)}if(N[b+16>>2]<Q(0)){na(1,4049);g=Q(0)}N[d+12>>2]=n;N[d+28>>2]=g;N[d+24>>2]=k;N[d+20>>2]=p;N[d+16>>2]=s;J[d+52>>2]=J[b+20>>2];rd(d);N[d+44>>2]=N[b+24>>2];J[d+76>>2]=J[b+28>>2];qd(d);n=N[b+32>>2];p=N[b+36>>2];i=n<p;s=i?n:p;g=Q(1);k=Q(1);n=i?p:n;V:{if(n>Q(1)){break V}k=n;if(!(k<Q(0))){break V}k=Q(0)}W:{if(s>Q(1)){break W}g=s;if(!(g<Q(0))){break W}g=Q(0)}N[d+64>>2]=g;N[d+60>>2]=k;n=N[b+44>>2];p=N[b+40>>2];b=n<p;s=b?n:p;g=Q(1);k=Q(1);n=b?p:n;X:{if(n>Q(1)){break X}k=n;if(!(k<Q(0))){break X}k=Q(0)}Y:{if(s>Q(1)){break Y}g=s;if(!(g<Q(0))){break Y}g=Q(0)}N[d+72>>2]=g;N[d+68>>2]=k}Vb(d);break N}d=0;na(0,295171)}da=f+80|0;J[a+456>>2]=d;J[a+460>>2]=r;J[a+12>>2]=J[c+4>>2];b=J[c>>2];J[a+4>>2]=b;J[a+8>>2]=b;b=J[c+24>>2];J[a+48>>2]=b;Z:{if(b){b=h- -64|0;c=J[c+20>>2];pd(b,16e3,0,c,c>>31);c=J[h+76>>2];J[a+64>>2]=J[h+72>>2];J[a+68>>2]=c;c=J[h+68>>2];J[a+56>>2]=J[h+64>>2];J[a+60>>2]=c;nd(h+32|0,J[a+400>>2]);c=J[a+68>>2];J[h+24>>2]=J[a+64>>2];J[h+28>>2]=c;c=J[a+56>>2];d=J[a+60>>2];i=J[h+44>>2];J[h+8>>2]=J[h+40>>2];J[h+12>>2]=i;J[h+16>>2]=c;J[h+20>>2]=d;c=J[h+36>>2];J[h>>2]=J[h+32>>2];J[h+4>>2]=c;Tb(b,h+16|0,h);break Z}b=h- -64|0;ab(b,0,0,1,0);c=J[h+76>>2];J[a+64>>2]=J[h+72>>2];J[a+68>>2]=c;c=J[h+68>>2];J[a+56>>2]=J[h+64>>2];J[a+60>>2]=c;ab(b,0,0,1,0)}b=J[h+76>>2];J[a+80>>2]=J[h+72>>2];J[a+84>>2]=b;b=J[h+68>>2];J[a+72>>2]=J[h+64>>2];J[a+76>>2]=b;gd(a,a+88|0);b=J[a+104>>2];J[a+116>>2]=J[a+100>>2];J[a+120>>2]=b;J[a+124>>2]=J[a+108>>2];b=a+128|0;c=J[J[a>>2]+508>>2];d=J[c+60>>2];if((d|0)>0){c=J[c+4>>2];e=0;while(1){N[b+(e<<2)>>2]=ib(c,e);e=e+1|0;if((d|0)!=(e|0)){continue}break}}J[a+16>>2]=1;break m}Zb(r)}da=h+528|0;J[j+112>>2]=0;J[j+28>>2]=a;a=J[76214];_:{if(a){a=ha[a|0](24)|0;break _}a=Za(24)}J[j+116>>2]=a;if(a){J[a+4>>2]=0;J[a+8>>2]=0;J[a>>2]=1065353216;J[a+20>>2]=0;J[a+12>>2]=0;J[a+16>>2]=0;d=j;break a}d=0;sa(4,2193,0);Zd(j);break a}sa(4,1497,0);break a}J[v>>2]=d;sa(4,1638,v);d=0}da=v+32|0;return d|0}function Ee(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=Q(0),k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=Q(0),t=Q(0),u=0,v=0,w=Q(0),x=0,y=Q(0),z=Q(0),A=Q(0),B=0,C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),H=Q(0),I=Q(0),K=Q(0),L=Q(0),O=Q(0),S=Q(0),T=Q(0),V=Q(0),W=Q(0),X=Q(0),Z=Q(0),_=Q(0),$=Q(0),aa=Q(0),ba=0,ca=0,ea=Q(0),fa=Q(0),ga=0,ha=0,ia=Q(0),ja=Q(0),ka=Q(0),la=0,ma=0,na=0,oa=Q(0),pa=Q(0);h=J[a+48>>2];k=J[a+44>>2];a:{if(e){if(h>>>0<k>>>0){J[f>>2]=1;return}e=d+k|0;break a}e=0;if(h>>>0>=k>>>0){break a}Ed(a)}J[a+44>>2]=e;e=0;J[f>>2]=0;b:{if(M[a+16>>2]<2|M[a+12>>2]>1){break b}yc(b,b,d);if(M[a+16>>2]<6){break b}f=b+16|0;yc(f,f,d)}if(J[a+16>>2]){while(1){q=J[a>>2]+P(e,28688)|0;r=J[a+8>>2];f=e<<2;ma=J[f+b>>2];na=J[c+f>>2];ga=0;if(d){while(1){k=ga<<2;h=d-ga|0;f=J[q+28676>>2]-J[q+28672>>2]|0;h=(f|0)>(h|0)?h:f;qa((J[q+28672>>2]<<2)+q|0,k+ma|0,h<<2);qa(k+na|0,((J[q+28672>>2]<<2)+q|0)+20480|0,h<<2);f=h+J[q+28672>>2]|0;J[q+28672>>2]=f;ga=h+ga|0;if(f>>>0>=M[q+28676>>2]){h=J[a+28>>2];f=(f>>>0)%(h>>>0)|0;J[q+28672>>2]=f;J[q+28676>>2]=f+((h>>>0)/M[a+24>>2]|0)&65535;p=0;ia=Q(0);oa=N[q+28680>>2];pa=N[75874];k=J[a+20>>2];v=J[a+28>>2];la=J[a+24>>2];f=(v>>>0)/(la>>>0)|0;Ka((((J[q+28672>>2]+(v-f|0)>>>0)%(v>>>0)<<2)+q|0)+20480|0,f);f=J[q+28672>>2];ba=r+(v<<3)|0;Dd(v-f|0,ba,(f<<2)+q|0,J[a+4>>2]);f=J[q+28672>>2];h=v-f|0;Dd(f,(h<<3&-32)+ba|0,q,J[a+4>>2]+(h<<2)|0);Na(r,ba,v,-1);h=J[a+20>>2];j=Q(Q(k>>>0)/Q(v>>>0));u=r+(v<<2&-8)|0;o=v>>>1|0;x=r+P(o,12)|0;ha=q- -8192|0;g=da-272|0;da=g;f=(v>>>0)/M[a+24>>2]|0;if(o){X=Q(j*Q(6.2831854820251465));ja=Q(1);K=Q(Q(f>>>0)/Q(h>>>0));Z=Q(Q(1)/K);H=Q(2);ea=Q(3);while(1){k=r+(p<<3)|0;fa=N[k>>2];N[g+256>>2]=fa;L=N[k+4>>2];N[g+260>>2]=L;O=N[k+8>>2];N[g+264>>2]=O;S=N[k+12>>2];N[g+268>>2]=S;f=p|4;h=r+(f<<3)|0;T=N[h>>2];N[g+192>>2]=T;V=N[h+4>>2];N[g+196>>2]=V;W=N[h+8>>2];N[g+200>>2]=W;_=N[h+12>>2];N[g+204>>2]=_;$=N[k+16>>2];N[g+240>>2]=$;aa=N[k+20>>2];N[g+244>>2]=aa;G=N[k+24>>2];N[g+248>>2]=G;I=N[k+28>>2];N[g+252>>2]=I;y=N[h+16>>2];N[g+176>>2]=y;z=N[h+20>>2];N[g+180>>2]=z;w=N[h+24>>2];N[g+184>>2]=w;j=N[h+28>>2];N[g+188>>2]=j;k=f<<2;B=k+ha|0;ka=N[B>>2];C=N[B+4>>2];D=N[B+12>>2];E=N[B+8>>2];h=p<<2;l=h+ha|0;F=N[l>>2];A=N[l+4>>2];t=N[l+12>>2];s=N[l+8>>2];N[g+216>>2]=Q(O*O)+Q(G*G);N[g+152>>2]=Q(W*W)+Q(w*w);N[g+212>>2]=Q(L*L)+Q(aa*aa);N[g+208>>2]=Q(fa*fa)+Q($*$);N[g+220>>2]=Q(S*S)+Q(I*I);f=J[g+220>>2];J[g+120>>2]=J[g+216>>2];J[g+124>>2]=f;N[g+148>>2]=Q(V*V)+Q(z*z);N[g+144>>2]=Q(T*T)+Q(y*y);N[g+156>>2]=Q(_*_)+Q(j*j);f=J[g+212>>2];J[g+112>>2]=J[g+208>>2];J[g+116>>2]=f;n=g+128|0;vc(n,g+112|0);f=J[g+140>>2];J[g+216>>2]=J[g+136>>2];J[g+220>>2]=f;f=J[g+156>>2];J[g+104>>2]=J[g+152>>2];J[g+108>>2]=f;f=J[g+132>>2];J[g+208>>2]=J[g+128>>2];J[g+212>>2]=f;f=J[g+148>>2];J[g+96>>2]=J[g+144>>2];J[g+100>>2]=f;vc(n,g+96|0);f=J[g+140>>2];J[g+152>>2]=J[g+136>>2];J[g+156>>2]=f;j=N[g+216>>2];N[g+216>>2]=j+j;j=N[g+152>>2];N[g+152>>2]=j+j;f=J[g+132>>2];J[g+144>>2]=J[g+128>>2];J[g+148>>2]=f;j=N[g+208>>2];N[g+208>>2]=j+j;j=N[g+212>>2];N[g+212>>2]=j+j;j=N[g+220>>2];N[g+220>>2]=j+j;j=N[g+144>>2];N[g+144>>2]=j+j;j=N[g+148>>2];N[g+148>>2]=j+j;j=N[g+156>>2];N[g+156>>2]=j+j;f=J[g+252>>2];J[g+88>>2]=J[g+248>>2];J[g+92>>2]=f;f=J[g+244>>2];J[g+80>>2]=J[g+240>>2];J[g+84>>2]=f;f=J[g+268>>2];J[g+72>>2]=J[g+264>>2];J[g+76>>2]=f;f=J[g+260>>2];J[g+64>>2]=J[g+256>>2];J[g+68>>2]=f;uc(n,g+80|0,g- -64|0);f=J[g+188>>2];J[g+56>>2]=J[g+184>>2];J[g+60>>2]=f;f=J[g+204>>2];J[g+40>>2]=J[g+200>>2];J[g+44>>2]=f;f=J[g+180>>2];J[g+48>>2]=J[g+176>>2];J[g+52>>2]=f;f=J[g+196>>2];J[g+32>>2]=J[g+192>>2];J[g+36>>2]=f;L=N[g+136>>2];O=N[g+128>>2];S=N[g+132>>2];T=N[g+140>>2];uc(n,g+48|0,g+32|0);j=Q(X*H);N[g+232>>2]=Q(L-s)-Q(j*K);aa=Q(X*ea);N[g+236>>2]=Q(T-t)-Q(aa*K);f=J[g+236>>2];J[g+24>>2]=J[g+232>>2];J[g+28>>2]=f;w=Q(X*ja);N[g+228>>2]=Q(S-A)-Q(w*K);A=Q(X*ia);N[g+224>>2]=Q(O-F)-Q(A*K);f=J[g+228>>2];J[g+16>>2]=J[g+224>>2];J[g+20>>2]=f;V=N[g+128>>2];W=N[g+132>>2];_=N[g+140>>2];$=N[g+136>>2];ob(n,g+16|0);f=J[g+140>>2];J[g+232>>2]=J[g+136>>2];J[g+236>>2]=f;G=Q(H+Q(4));t=Q(X*G);N[g+168>>2]=Q($-E)-Q(t*K);I=Q(Q(N[g+232>>2]*Z)+j);N[g+232>>2]=I;y=Q(ea+Q(4));z=Q(X*y);N[g+172>>2]=Q(_-D)-Q(z*K);f=J[g+172>>2];J[g+8>>2]=J[g+168>>2];J[g+12>>2]=f;f=J[g+132>>2];J[g+224>>2]=J[g+128>>2];J[g+228>>2]=f;j=Q(W-C);C=Q(ja+Q(4));s=Q(X*C);N[g+164>>2]=j-Q(s*K);D=Q(ia+Q(4));j=Q(X*D);N[g+160>>2]=Q(V-ka)-Q(j*K);E=Q(Q(N[g+224>>2]*Z)+A);N[g+224>>2]=E;F=Q(Q(N[g+228>>2]*Z)+w);N[g+228>>2]=F;w=Q(Q(N[g+236>>2]*Z)+aa);N[g+236>>2]=w;f=J[g+164>>2];J[g>>2]=J[g+160>>2];J[g+4>>2]=f;ob(n,g);f=J[g+140>>2];J[g+168>>2]=J[g+136>>2];J[g+172>>2]=f;A=Q(Q(N[g+168>>2]*Z)+t);N[g+168>>2]=A;f=J[g+132>>2];J[g+160>>2]=J[g+128>>2];J[g+164>>2]=f;t=Q(Q(N[g+160>>2]*Z)+j);N[g+160>>2]=t;s=Q(Q(N[g+164>>2]*Z)+s);N[g+164>>2]=s;j=Q(Q(N[g+172>>2]*Z)+z);N[g+172>>2]=j;f=h+u|0;N[f>>2]=N[g+208>>2];N[f+4>>2]=N[g+212>>2];N[f+8>>2]=N[g+216>>2];N[f+12>>2]=N[g+220>>2];f=k+u|0;N[f>>2]=N[g+144>>2];N[f+4>>2]=N[g+148>>2];N[f+8>>2]=N[g+152>>2];N[f+12>>2]=N[g+156>>2];f=h+x|0;N[f+12>>2]=w;N[f+8>>2]=I;N[f+4>>2]=F;N[f>>2]=E;f=k+x|0;N[f+12>>2]=j;N[f+8>>2]=A;N[f+4>>2]=s;N[f>>2]=t;N[l+12>>2]=T;N[l+8>>2]=L;N[l+4>>2]=S;N[l>>2]=O;N[B+12>>2]=_;N[B+8>>2]=$;N[B+4>>2]=W;N[B>>2]=V;ea=Q(y+Q(4));H=Q(G+Q(4));ja=Q(C+Q(4));ia=Q(D+Q(4));p=p+8|0;if(o>>>0>p>>>0){continue}break}}da=g+272|0;J[x>>2]=0;f=o<<2;ca=f+r|0;c:{if(!(N[a+36>>2]==Q(1)&N[a+40>>2]==Q(1))){Ka(r,o);Ka(ca,o);d:{e:{switch(J[a+12>>2]){default:I=N[a+36>>2];G=N[a+40>>2];if(I!=G){break d}break;case 0:case 2:break e}}Cd(o,N[a+36>>2],u,x,r,ca);break c}n=J[a+32>>2];j=N[u>>2];f=r+(o<<4)|0;J[f+16>>2]=0;N[f>>2]=Pb(Q(j+Q(1.1754943508222875e-37)))*Q(20);m=1;p=o<<1;if(o>>>0>=2){while(1){k=(f+(p-m<<3&-32)|0)+((0-m&3)<<2)|0;j=Q(Pb(Q(N[u+(m<<2)>>2]+Q(1.1754943508222875e-37)))*Q(20));N[k>>2]=j;h=(f+(m<<3&-32)|0)+((m&3)<<2)|0;N[h>>2]=j;J[k+16>>2]=0;J[h+16>>2]=0;m=m+1|0;if((o|0)!=(m|0)){continue}break}}h=f+(o<<3&-32)|0;J[h+16>>2]=0;J[h>>2]=0;l=r+(o<<5)|0;Na(l,f,p,1);m=0;if(o){while(1){if(m>>>0>=n>>>0){h=l+(m<<3)|0;J[h>>2]=0;J[h+4>>2]=0;J[h+24>>2]=0;J[h+28>>2]=0;J[h+16>>2]=0;J[h+20>>2]=0;J[h+8>>2]=0;J[h+12>>2]=0}m=m+4|0;if(o>>>0>m>>>0){continue}break}}if(o>>>0>n>>>0){h=l+(o<<3&-32)|0;J[h+16>>2]=0;J[h>>2]=0}if(o>>>0>=2){n=o<<1;m=1;while(1){n=n-1|0;k=(l+(n<<3&-32)|0)+((n&3)<<2)|0;h=(l+(m<<3&-32)|0)+((m&3)<<2)|0;N[k>>2]=N[h>>2];N[k+16>>2]=-N[h+16>>2];m=m+1|0;if((o|0)!=(m|0)){continue}break}}Na(f,l,p,-1);if(o){j=Q(p>>>0);m=0;while(1){k=m<<2;h=f+(m<<3)|0;N[k+f>>2]=za(Q(10),Q(Q(N[h>>2]/j)/Q(20)))+Q(1.1754943508222875e-38);N[f+(k|4)>>2]=za(Q(10),Q(Q(N[h+4>>2]/j)/Q(20)))+Q(1.1754943508222875e-38);N[f+(k|8)>>2]=za(Q(10),Q(Q(N[h+8>>2]/j)/Q(20)))+Q(1.1754943508222875e-38);N[f+(k|12)>>2]=za(Q(10),Q(Q(N[h+12>>2]/j)/Q(20)))+Q(1.1754943508222875e-38);m=m+4|0;if(o>>>0>m>>>0){continue}break}}if(o){m=0;while(1){k=m<<2;h=k|16;n=h+f|0;y=N[n>>2];p=h+u|0;z=N[p>>2];C=N[n+12>>2];D=N[p+12>>2];E=N[n+8>>2];F=N[p+8>>2];w=N[n+4>>2];A=N[p+4>>2];h=f+k|0;t=N[h>>2];s=N[h+4>>2];j=N[h+8>>2];k=k+u|0;N[k+12>>2]=N[k+12>>2]/N[h+12>>2];N[k+8>>2]=N[k+8>>2]/j;N[k+4>>2]=N[k+4>>2]/s;N[k>>2]=N[k>>2]/t;N[p+4>>2]=A/w;N[p+8>>2]=F/E;N[p+12>>2]=D/C;N[p>>2]=z/y;m=m+8|0;if(o>>>0>m>>>0){continue}break}}f:{if(I!=Q(1)){Cd(o,I,u,x,r,ca);break f}h=o<<2;qa(r,u,h);qa(ca,x,h)}g:{if(G==Q(1)){if(o){m=0;while(1){k=m<<2;h=k|16;n=h+f|0;y=N[n>>2];p=h+r|0;z=N[p>>2];C=N[n+12>>2];D=N[p+12>>2];E=N[n+8>>2];F=N[p+8>>2];w=N[n+4>>2];A=N[p+4>>2];h=f+k|0;t=N[h>>2];s=N[h+4>>2];j=N[h+8>>2];k=k+r|0;N[k+12>>2]=N[k+12>>2]*N[h+12>>2];N[k+8>>2]=j*N[k+8>>2];N[k+4>>2]=s*N[k+4>>2];N[k>>2]=t*N[k>>2];N[p+4>>2]=A*w;N[p+8>>2]=F*E;N[p+12>>2]=D*C;N[p>>2]=z*y;m=m+8|0;if(o>>>0>m>>>0){continue}break}}break g}g=0;j=Q(Q(o>>>0)*G);h:{if(j<Q(4294967296)&j>=Q(0)){h=~~j>>>0;break h}h=0}u=h>>>0<o>>>0?h:o;h=o>>>1|0;l=(h>>>0>u>>>0?u:h)&2147483644;if(l){y=Q(Q(1)/G);t=Q(0);while(1){x=g<<2;p=x+r|0;s=N[p>>2];if(Q(R(t))<Q(2147483648)){k=~~t}else{k=-2147483648}h=(k<<2)+f|0;j=N[h>>2];j=Q(Q(Q(N[h+4>>2]-j)*Q(t-Q(k|0)))+j);z=Q(y+t);C=Q(y+z);D=Q(y+C);i:{if(Q(R(D))<Q(2147483648)){k=~~D;break i}k=-2147483648}h=(k<<2)+f|0;E=N[h>>2];A=N[h+4>>2];t=Q(j*s);if(Q(R(C))<Q(2147483648)){h=~~C}else{h=-2147483648}n=(h<<2)+f|0;F=N[n>>2];s=N[n+4>>2];if(Q(R(z))<Q(2147483648)){B=~~z}else{B=-2147483648}n=(B<<2)+f|0;w=N[n>>2];j=N[n+4>>2];N[p>>2]=t;n=r+(x|4)|0;N[n>>2]=Q(w+Q(Q(j-w)*Q(z-Q(B|0))))*N[n>>2];n=r+(x|8)|0;N[n>>2]=Q(Q(Q(s-F)*Q(C-Q(h|0)))+F)*N[n>>2];h=r+(x|12)|0;N[h>>2]=Q(Q(Q(A-E)*Q(D-Q(k|0)))+E)*N[h>>2];t=Q(y+D);g=g+4|0;if(l>>>0>g>>>0){continue}break}}if(g>>>0<u>>>0){while(1){k=g<<2;h=k+r|0;N[h>>2]=N[f+k>>2]*N[h>>2];g=g+1|0;if((u|0)!=(g|0)){continue}break}}ra(r+(u<<2)|0,0,o-u<<2)}break c}qa(r,u,f);qa(ca,x,f);qa(q+12288|0,ha,f)}h=J[a+20>>2];B=q+12288|0;p=q+16384|0;f=da;n=f;i=f-256&-128;da=i;f=(v>>>0)/M[a+24>>2]|0;if(o){H=Q(Q(f>>>0)/Q(h>>>0));_=Q(Q(Q(Q(2048)/Q(v>>>0))*Q(.20000000298023224))+Q(1));g=0;while(1){h=g<<2;f=h+r|0;ea=N[f+12>>2];fa=N[f+8>>2];L=N[f+4>>2];O=N[f>>2];k=g|4;f=k<<2;l=f+r|0;S=N[l+12>>2];T=N[l+8>>2];V=N[l+4>>2];W=N[l>>2];l=f+ca|0;E=N[l>>2];F=N[l+4>>2];w=N[l+8>>2];A=N[l+12>>2];l=h+ca|0;t=N[l>>2];s=N[l+4>>2];j=N[l+8>>2];N[i+140>>2]=H*N[l+12>>2];N[i+136>>2]=H*j;N[i+132>>2]=H*s;N[i+128>>2]=H*t;N[i+156>>2]=H*A;N[i+152>>2]=H*w;N[i+148>>2]=H*F;N[i+144>>2]=H*E;u=h+B|0;x=f+B|0;m=0;while(1){h=(i+128|0)+(m<<2)|0;l=g+m<<2;s=N[l+r>>2];f=l+p|0;j=N[l+ha>>2];j:{if(s>=Q(_*N[f>>2])){break j}j=Q(N[h>>2]+N[l+B>>2])}N[h>>2]=j;N[f>>2]=s;m=m+1|0;if((m|0)!=8){continue}break}l=J[i+140>>2];h=J[i+136>>2];J[i+248>>2]=h;J[i+252>>2]=l;f=J[i+156>>2];J[i+232>>2]=J[i+152>>2];J[i+236>>2]=f;J[i+104>>2]=h;J[i+108>>2]=l;l=J[i+132>>2];h=J[i+128>>2];J[i+240>>2]=h;J[i+244>>2]=l;f=J[i+148>>2];J[i+224>>2]=J[i+144>>2];J[i+228>>2]=f;J[i+96>>2]=h;J[i+100>>2]=l;h=i+112|0;ob(h,i+96|0);f=J[i+124>>2];J[i+248>>2]=J[i+120>>2];J[i+252>>2]=f;f=J[i+236>>2];J[i+88>>2]=J[i+232>>2];J[i+92>>2]=f;f=J[i+116>>2];J[i+240>>2]=J[i+112>>2];J[i+244>>2]=f;f=J[i+228>>2];J[i+80>>2]=J[i+224>>2];J[i+84>>2]=f;ob(h,i+80|0);f=J[i+124>>2];J[i+232>>2]=J[i+120>>2];J[i+236>>2]=f;f=J[i+252>>2];J[i+72>>2]=J[i+248>>2];J[i+76>>2]=f;f=J[i+116>>2];J[i+224>>2]=J[i+112>>2];J[i+228>>2]=f;f=J[i+244>>2];J[i+64>>2]=J[i+240>>2];J[i+68>>2]=f;eb(h,i- -64|0);f=J[i+236>>2];J[i+56>>2]=J[i+232>>2];J[i+60>>2]=f;f=J[i+228>>2];J[i+48>>2]=J[i+224>>2];J[i+52>>2]=f;$=N[i+112>>2];ka=N[i+116>>2];aa=N[i+120>>2];G=N[i+124>>2];eb(h,i+48|0);f=J[i+252>>2];J[i+40>>2]=J[i+248>>2];J[i+44>>2]=f;f=J[i+244>>2];J[i+32>>2]=J[i+240>>2];J[i+36>>2]=f;I=N[i+112>>2];y=N[i+116>>2];z=N[i+120>>2];C=N[i+124>>2];fb(h,i+32|0);f=J[i+236>>2];J[i+24>>2]=J[i+232>>2];J[i+28>>2]=f;f=J[i+228>>2];J[i+16>>2]=J[i+224>>2];J[i+20>>2]=f;D=N[i+112>>2];E=N[i+116>>2];F=N[i+120>>2];w=N[i+124>>2];fb(h,i+16|0);A=N[i+112>>2];t=N[i+116>>2];s=N[i+120>>2];j=N[i+124>>2];N[u>>2]=N[i+240>>2];N[u+4>>2]=N[i+244>>2];N[u+8>>2]=N[i+248>>2];N[u+12>>2]=N[i+252>>2];N[x>>2]=N[i+224>>2];N[x+4>>2]=N[i+228>>2];N[x+8>>2]=N[i+232>>2];N[x+12>>2]=N[i+236>>2];h=(g<<3)+ba|0;N[h+12>>2]=ea*G;N[h+8>>2]=fa*aa;N[h+4>>2]=L*ka;N[h>>2]=O*$;f=(k<<3)+ba|0;N[f+12>>2]=S*C;N[f+8>>2]=T*z;N[f+4>>2]=V*y;N[f>>2]=W*I;N[h+28>>2]=ea*w;N[h+24>>2]=fa*F;N[h+20>>2]=L*E;N[h+16>>2]=O*D;N[f+28>>2]=S*j;N[f+24>>2]=T*s;N[f+20>>2]=V*t;N[f+16>>2]=W*A;g=g+8|0;if(o>>>0>g>>>0){continue}break}}da=n;f=v>>>3|0;ra((f<<5)+ba|0,0,f<<5);Na(r,ba,v,1);f=J[q+28672>>2];j=Q(oa*Q(pa/Q(P(v,la)>>>0)));k=q+20480|0;Bd(v-f|0,j,k+(f<<2)|0,r,J[a+4>>2]);f=J[q+28672>>2];h=v-f|0;Bd(f,j,k,r+(h<<3&-32)|0,J[a+4>>2]+(h<<2)|0);s=zd(v,q);j=zd(v,k);if(j>Q(.009999999776482582)){j=Q(Q(Y(s))/Q(Y(j)));s=j>=Q(1.399999976158142)?Q(1.399999976158142):Q(U(j,Q(.699999988079071)));j=N[q+28680>>2];N[q+28680>>2]=Q(Q(s-j)*Q(.10000000149011612))+j}}if(d>>>0>ga>>>0){continue}break}}e=e+1|0;if(e>>>0<M[a+16>>2]){continue}break}}k:{if(M[a+16>>2]<2|M[a+12>>2]>1){break k}xc(c,c,d);if(M[a+16>>2]<6){break k}a=c+16|0;xc(a,a,d)}}function Za(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0;l=da-16|0;da=l;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{k:{if(a>>>0<=244){e=J[78207];g=a>>>0<11?16:a+11&-8;a=g>>>3|0;b=e>>>a|0;if(b&3){c=a+((b^-1)&1)|0;f=c<<3;b=J[f+312876>>2];a=b+8|0;d=J[b+8>>2];f=f+312868|0;l:{if((d|0)==(f|0)){J[78207]=We(c)&e;break l}J[d+12>>2]=f;J[f+8>>2]=d}c=c<<3;J[b+4>>2]=c|3;b=b+c|0;J[b+4>>2]=J[b+4>>2]|1;break a}i=J[78209];if(i>>>0>=g>>>0){break k}if(b){c=2<<a;a=(0-c|c)&b<<a;a=(0-a&a)-1|0;b=a>>>12&16;c=b;a=a>>>b|0;b=a>>>5&8;c=c|b;a=a>>>b|0;b=a>>>2&4;c=c|b;a=a>>>b|0;b=a>>>1&2;c=c|b;a=a>>>b|0;b=a>>>1&1;c=(c|b)+(a>>>b|0)|0;d=c<<3;b=J[d+312876>>2];a=J[b+8>>2];d=d+312868|0;m:{if((a|0)==(d|0)){e=We(c)&e;J[78207]=e;break m}J[a+12>>2]=d;J[d+8>>2]=a}a=b+8|0;J[b+4>>2]=g|3;h=b+g|0;c=c<<3;f=c-g|0;J[h+4>>2]=f|1;J[b+c>>2]=f;if(i){c=i>>>3|0;b=(c<<3)+312868|0;d=J[78212];c=1<<c;n:{if(!(c&e)){J[78207]=c|e;c=b;break n}c=J[b+8>>2]}J[b+8>>2]=d;J[c+12>>2]=d;J[d+12>>2]=b;J[d+8>>2]=c}J[78212]=h;J[78209]=f;break a}k=J[78208];if(!k){break k}a=(k&0-k)-1|0;b=a>>>12&16;c=b;a=a>>>b|0;b=a>>>5&8;c=c|b;a=a>>>b|0;b=a>>>2&4;c=c|b;a=a>>>b|0;b=a>>>1&2;c=c|b;a=a>>>b|0;b=a>>>1&1;b=J[((c|b)+(a>>>b|0)<<2)+313132>>2];f=(J[b+4>>2]&-8)-g|0;c=b;while(1){o:{a=J[c+16>>2];if(!a){a=J[c+20>>2];if(!a){break o}}d=(J[a+4>>2]&-8)-g|0;c=d>>>0<f>>>0;f=c?d:f;b=c?a:b;c=a;continue}break}j=J[b+24>>2];d=J[b+12>>2];if((d|0)!=(b|0)){a=J[b+8>>2];J[a+12>>2]=d;J[d+8>>2]=a;break b}c=b+20|0;a=J[c>>2];if(!a){a=J[b+16>>2];if(!a){break j}c=b+16|0}while(1){h=c;d=a;c=a+20|0;a=J[c>>2];if(a){continue}c=d+16|0;a=J[d+16>>2];if(a){continue}break}J[h>>2]=0;break b}g=-1;if(a>>>0>4294967231){break k}b=a+11|0;g=b&-8;i=J[78208];if(!i){break k}f=0-g|0;e=0;p:{if(g>>>0<256){break p}e=31;if(g>>>0>16777215){break p}b=b>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;e=c<<b;c=e+245760>>>16&2;a=(e<<c>>>15|0)-(c|(a|b))|0;e=(a<<1|g>>>a+21&1)+28|0}c=J[(e<<2)+313132>>2];q:{r:{s:{if(!c){a=0;break s}a=0;b=g<<((e|0)==31?0:25-(e>>>1|0)|0);while(1){t:{j=J[c+4>>2]&-8;h=j-g|0;if(h>>>0>=f>>>0){break t}f=h;d=c;if((g|0)!=(j|0)){break t}f=0;a=c;break r}h=J[c+20>>2];c=J[((b>>>29&4)+c|0)+16>>2];a=h?(h|0)==(c|0)?a:h:a;b=b<<1;if(c){continue}break}}if(!(a|d)){d=0;a=2<<e;a=(0-a|a)&i;if(!a){break k}a=(a&0-a)-1|0;b=a>>>12&16;c=b;a=a>>>b|0;b=a>>>5&8;c=c|b;a=a>>>b|0;b=a>>>2&4;c=c|b;a=a>>>b|0;b=a>>>1&2;c=c|b;a=a>>>b|0;b=a>>>1&1;a=J[((c|b)+(a>>>b|0)<<2)+313132>>2]}if(!a){break q}}while(1){c=(J[a+4>>2]&-8)-g|0;b=c>>>0<f>>>0;f=b?c:f;d=b?a:d;b=J[a+16>>2];if(b){a=b}else{a=J[a+20>>2]}if(a){continue}break}}if(!d|J[78209]-g>>>0<=f>>>0){break k}h=J[d+24>>2];b=J[d+12>>2];if((d|0)!=(b|0)){a=J[d+8>>2];J[a+12>>2]=b;J[b+8>>2]=a;break c}c=d+20|0;a=J[c>>2];if(!a){a=J[d+16>>2];if(!a){break i}c=d+16|0}while(1){e=c;b=a;c=a+20|0;a=J[c>>2];if(a){continue}c=b+16|0;a=J[b+16>>2];if(a){continue}break}J[e>>2]=0;break c}b=J[78209];if(b>>>0>=g>>>0){a=J[78212];c=b-g|0;u:{if(c>>>0>=16){J[78209]=c;d=a+g|0;J[78212]=d;J[d+4>>2]=c|1;J[a+b>>2]=c;J[a+4>>2]=g|3;break u}J[78212]=0;J[78209]=0;J[a+4>>2]=b|3;b=a+b|0;J[b+4>>2]=J[b+4>>2]|1}a=a+8|0;break a}d=J[78210];if(d>>>0>g>>>0){b=d-g|0;J[78210]=b;a=J[78213];c=a+g|0;J[78213]=c;J[c+4>>2]=b|1;J[a+4>>2]=g|3;a=a+8|0;break a}a=0;f=g+47|0;if(J[78325]){b=J[78327]}else{J[78328]=-1;J[78329]=-1;J[78326]=4096;J[78327]=4096;J[78325]=l+12&-16^1431655768;J[78330]=0;J[78318]=0;b=4096}e=f+b|0;h=0-b|0;c=e&h;if(c>>>0<=g>>>0){break a}i=J[78317];if(i){j=J[78315];b=j+c|0;if(b>>>0<=j>>>0|b>>>0>i>>>0){break a}}if(K[313272]&4){break f}v:{w:{b=J[78213];if(b){a=313276;while(1){i=J[a>>2];if(i>>>0<=b>>>0&b>>>0<i+J[a+4>>2]>>>0){break w}a=J[a+8>>2];if(a){continue}break}}b=Ya(0);if((b|0)==-1){break g}e=c;a=J[78326];d=a-1|0;if(d&b){e=(c-b|0)+(b+d&0-a)|0}if(e>>>0<=g>>>0|e>>>0>2147483646){break g}d=J[78317];if(d){h=J[78315];a=h+e|0;if(a>>>0<=h>>>0|a>>>0>d>>>0){break g}}a=Ya(e);if((b|0)!=(a|0)){break v}break e}e=h&e-d;if(e>>>0>2147483646){break g}b=Ya(e);if((b|0)==(J[a>>2]+J[a+4>>2]|0)){break h}a=b}if(!((a|0)==-1|g+48>>>0<=e>>>0)){b=J[78327];b=b+(f-e|0)&0-b;if(b>>>0>2147483646){b=a;break e}if((Ya(b)|0)!=-1){e=b+e|0;b=a;break e}Ya(0-e|0);break g}b=a;if((a|0)!=-1){break e}break g}d=0;break b}b=0;break c}if((b|0)!=-1){break e}}J[78318]=J[78318]|4}if(c>>>0>2147483646){break d}b=J[75912];c=c+3&-4;a=b+c|0;x:{y:{if(!c|a>>>0>b>>>0){if(Jb()>>>0>=a>>>0){break y}if(aa(a|0)|0){break y}a=J[75912]}else{a=b}J[78206]=48;b=-1;break x}J[75912]=a}if(Jb()>>>0<a>>>0){if(!(aa(a|0)|0)){break d}}J[75912]=a;if((b|0)==-1|(a|0)==-1|a>>>0<=b>>>0){break d}e=a-b|0;if(e>>>0<=g+40>>>0){break d}}a=J[78315]+e|0;J[78315]=a;if(a>>>0>M[78316]){J[78316]=a}z:{A:{B:{f=J[78213];if(f){a=313276;while(1){c=J[a>>2];d=J[a+4>>2];if((c+d|0)==(b|0)){break B}a=J[a+8>>2];if(a){continue}break}break A}a=J[78211];if(!(a>>>0<=b>>>0?a:0)){J[78211]=b}a=0;J[78320]=e;J[78319]=b;J[78215]=-1;J[78216]=J[78325];J[78322]=0;while(1){c=a<<3;d=c+312868|0;J[c+312876>>2]=d;J[c+312880>>2]=d;a=a+1|0;if((a|0)!=32){continue}break}a=e-40|0;c=b+8&7?-8-b&7:0;d=a-c|0;J[78210]=d;c=b+c|0;J[78213]=c;J[c+4>>2]=d|1;J[(a+b|0)+4>>2]=40;J[78214]=J[78329];break z}if(K[a+12|0]&8|c>>>0>f>>>0|b>>>0<=f>>>0){break A}J[a+4>>2]=d+e;a=f+8&7?-8-f&7:0;b=a+f|0;J[78213]=b;c=J[78210]+e|0;a=c-a|0;J[78210]=a;J[b+4>>2]=a|1;J[(c+f|0)+4>>2]=40;J[78214]=J[78329];break z}if(M[78211]>b>>>0){J[78211]=b}d=b+e|0;c=313276;C:{while(1){if((d|0)!=J[c>>2]){a=313276;c=J[c+8>>2];if(c){continue}break C}break}a=313276;if(K[c+12|0]&8){break C}J[c>>2]=b;J[c+4>>2]=J[c+4>>2]+e;i=(b+8&7?-8-b&7:0)+b|0;J[i+4>>2]=g|3;d=d+(d+8&7?-8-d&7:0)|0;e=g+i|0;g=d-e|0;D:{if((d|0)==(f|0)){J[78213]=e;a=J[78210]+g|0;J[78210]=a;J[e+4>>2]=a|1;break D}if(J[78212]==(d|0)){J[78212]=e;a=J[78209]+g|0;J[78209]=a;J[e+4>>2]=a|1;J[a+e>>2]=a;break D}a=J[d+4>>2];if((a&3)==1){j=a&-8;E:{if(a>>>0<=255){c=a>>>3|0;a=J[d+8>>2];b=J[d+12>>2];if((b|0)==(a|0)){J[78207]=J[78207]&We(c);break E}J[a+12>>2]=b;J[b+8>>2]=a;break E}h=J[d+24>>2];b=J[d+12>>2];F:{if((d|0)!=(b|0)){a=J[d+8>>2];J[a+12>>2]=b;J[b+8>>2]=a;break F}G:{a=d+20|0;f=J[a>>2];if(f){break G}a=d+16|0;f=J[a>>2];if(f){break G}b=0;break F}while(1){c=a;b=f;a=b+20|0;f=J[a>>2];if(f){continue}a=b+16|0;f=J[b+16>>2];if(f){continue}break}J[c>>2]=0}if(!h){break E}a=J[d+28>>2];c=(a<<2)+313132|0;H:{if(J[c>>2]==(d|0)){J[c>>2]=b;if(b){break H}J[78208]=J[78208]&We(a);break E}J[h+(J[h+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break E}}J[b+24>>2]=h;a=J[d+16>>2];if(a){J[b+16>>2]=a;J[a+24>>2]=b}a=J[d+20>>2];if(!a){break E}J[b+20>>2]=a;J[a+24>>2]=b}g=g+j|0;d=d+j|0}J[d+4>>2]=J[d+4>>2]&-2;J[e+4>>2]=g|1;J[e+g>>2]=g;if(g>>>0<=255){b=g>>>3|0;a=(b<<3)+312868|0;c=J[78207];b=1<<b;I:{if(!(c&b)){J[78207]=b|c;b=a;break I}b=J[a+8>>2]}J[a+8>>2]=e;J[b+12>>2]=e;J[e+12>>2]=a;J[e+8>>2]=b;break D}a=31;if(g>>>0<=16777215){b=g>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;d=c<<b;c=d+245760>>>16&2;a=(d<<c>>>15|0)-(c|(a|b))|0;a=(a<<1|g>>>a+21&1)+28|0}J[e+28>>2]=a;J[e+16>>2]=0;J[e+20>>2]=0;b=(a<<2)+313132|0;J:{c=J[78208];d=1<<a;K:{if(!(c&d)){J[78208]=c|d;J[b>>2]=e;J[e+24>>2]=b;break K}a=g<<((a|0)==31?0:25-(a>>>1|0)|0);b=J[b>>2];while(1){c=b;if((J[b+4>>2]&-8)==(g|0)){break J}b=a>>>29|0;a=a<<1;d=c+(b&4)|0;b=J[d+16>>2];if(b){continue}break}J[d+16>>2]=e;J[e+24>>2]=c}J[e+12>>2]=e;J[e+8>>2]=e;break D}a=J[c+8>>2];J[a+12>>2]=e;J[c+8>>2]=e;J[e+24>>2]=0;J[e+12>>2]=c;J[e+8>>2]=a}a=i+8|0;break a}while(1){L:{c=J[a>>2];if(c>>>0<=f>>>0){d=c+J[a+4>>2]|0;if(d>>>0>f>>>0){break L}}a=J[a+8>>2];continue}break}a=e-40|0;c=b+8&7?-8-b&7:0;h=a-c|0;J[78210]=h;c=b+c|0;J[78213]=c;J[c+4>>2]=h|1;J[(a+b|0)+4>>2]=40;J[78214]=J[78329];a=(d+(d-39&7?39-d&7:0)|0)-47|0;c=a>>>0<f+16>>>0?f:a;J[c+4>>2]=27;a=J[78322];J[c+16>>2]=J[78321];J[c+20>>2]=a;a=J[78320];J[c+8>>2]=J[78319];J[c+12>>2]=a;J[78321]=c+8;J[78320]=e;J[78319]=b;J[78322]=0;a=c+24|0;while(1){J[a+4>>2]=7;b=a+8|0;a=a+4|0;if(b>>>0<d>>>0){continue}break}if((c|0)==(f|0)){break z}J[c+4>>2]=J[c+4>>2]&-2;d=c-f|0;J[f+4>>2]=d|1;J[c>>2]=d;if(d>>>0<=255){b=d>>>3|0;a=(b<<3)+312868|0;c=J[78207];b=1<<b;M:{if(!(c&b)){J[78207]=b|c;b=a;break M}b=J[a+8>>2]}J[a+8>>2]=f;J[b+12>>2]=f;J[f+12>>2]=a;J[f+8>>2]=b;break z}a=31;J[f+16>>2]=0;J[f+20>>2]=0;if(d>>>0<=16777215){b=d>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;e=c<<b;c=e+245760>>>16&2;a=(e<<c>>>15|0)-(c|(a|b))|0;a=(a<<1|d>>>a+21&1)+28|0}J[f+28>>2]=a;b=(a<<2)+313132|0;N:{c=J[78208];e=1<<a;O:{if(!(c&e)){J[78208]=c|e;J[b>>2]=f;J[f+24>>2]=b;break O}a=d<<((a|0)==31?0:25-(a>>>1|0)|0);b=J[b>>2];while(1){c=b;if((d|0)==(J[b+4>>2]&-8)){break N}b=a>>>29|0;a=a<<1;e=c+(b&4)|0;b=J[e+16>>2];if(b){continue}break}J[e+16>>2]=f;J[f+24>>2]=c}J[f+12>>2]=f;J[f+8>>2]=f;break z}a=J[c+8>>2];J[a+12>>2]=f;J[c+8>>2]=f;J[f+24>>2]=0;J[f+12>>2]=c;J[f+8>>2]=a}a=J[78210];if(a>>>0<=g>>>0){break d}b=a-g|0;J[78210]=b;a=J[78213];c=a+g|0;J[78213]=c;J[c+4>>2]=b|1;J[a+4>>2]=g|3;a=a+8|0;break a}a=0;J[78206]=48;break a}P:{if(!h){break P}a=J[d+28>>2];c=(a<<2)+313132|0;Q:{if(J[c>>2]==(d|0)){J[c>>2]=b;if(b){break Q}i=We(a)&i;J[78208]=i;break P}J[h+(J[h+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break P}}J[b+24>>2]=h;a=J[d+16>>2];if(a){J[b+16>>2]=a;J[a+24>>2]=b}a=J[d+20>>2];if(!a){break P}J[b+20>>2]=a;J[a+24>>2]=b}R:{if(f>>>0<=15){a=f+g|0;J[d+4>>2]=a|3;a=a+d|0;J[a+4>>2]=J[a+4>>2]|1;break R}J[d+4>>2]=g|3;e=d+g|0;J[e+4>>2]=f|1;J[e+f>>2]=f;if(f>>>0<=255){b=f>>>3|0;a=(b<<3)+312868|0;c=J[78207];b=1<<b;S:{if(!(c&b)){J[78207]=b|c;b=a;break S}b=J[a+8>>2]}J[a+8>>2]=e;J[b+12>>2]=e;J[e+12>>2]=a;J[e+8>>2]=b;break R}a=31;if(f>>>0<=16777215){b=f>>>8|0;a=b+1048320>>>16&8;c=b<<a;b=c+520192>>>16&4;h=c<<b;c=h+245760>>>16&2;a=(h<<c>>>15|0)-(c|(a|b))|0;a=(a<<1|f>>>a+21&1)+28|0}J[e+28>>2]=a;J[e+16>>2]=0;J[e+20>>2]=0;b=(a<<2)+313132|0;T:{c=1<<a;U:{if(!(c&i)){J[78208]=c|i;J[b>>2]=e;break U}a=f<<((a|0)==31?0:25-(a>>>1|0)|0);c=J[b>>2];while(1){b=c;if((J[b+4>>2]&-8)==(f|0)){break T}c=a>>>29|0;a=a<<1;h=b+(c&4)|0;c=J[h+16>>2];if(c){continue}break}J[h+16>>2]=e}J[e+24>>2]=b;J[e+12>>2]=e;J[e+8>>2]=e;break R}a=J[b+8>>2];J[a+12>>2]=e;J[b+8>>2]=e;J[e+24>>2]=0;J[e+12>>2]=b;J[e+8>>2]=a}a=d+8|0;break a}V:{if(!j){break V}a=J[b+28>>2];c=(a<<2)+313132|0;W:{if(J[c>>2]==(b|0)){J[c>>2]=d;if(d){break W}J[78208]=We(a)&k;break V}J[j+(J[j+16>>2]==(b|0)?16:20)>>2]=d;if(!d){break V}}J[d+24>>2]=j;a=J[b+16>>2];if(a){J[d+16>>2]=a;J[a+24>>2]=d}a=J[b+20>>2];if(!a){break V}J[d+20>>2]=a;J[a+24>>2]=d}X:{if(f>>>0<=15){a=f+g|0;J[b+4>>2]=a|3;a=a+b|0;J[a+4>>2]=J[a+4>>2]|1;break X}J[b+4>>2]=g|3;h=b+g|0;J[h+4>>2]=f|1;J[f+h>>2]=f;if(i){c=i>>>3|0;a=(c<<3)+312868|0;d=J[78212];c=1<<c;Y:{if(!(c&e)){J[78207]=c|e;c=a;break Y}c=J[a+8>>2]}J[a+8>>2]=d;J[c+12>>2]=d;J[d+12>>2]=a;J[d+8>>2]=c}J[78212]=h;J[78209]=f}a=b+8|0}da=l+16|0;return a}function Ke(a,b,c,d,e){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;var f=Q(0),g=0,h=0,i=Q(0),j=0,k=Q(0),l=Q(0),m=Q(0),n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=Q(0),v=0,w=0,y=0,z=0,A=Q(0),B=0,C=0,E=0,F=Q(0),G=0,H=0,I=0,K=Q(0),L=0,M=0;j=da-96|0;da=j;a:{if(!J[76213]){sa(4,2620,0);break a}if(J[d>>2]?!e|(!c|!b|(!d|!a)):1){sa(4,2766,0);break a}if(Sb(J[a+28>>2])-1>>>0>=c>>>0){sa(4,2918,0);break a}if(J[e+4>>2]-101>>>0<=4294967195){sa(4,3077,0);break a}l=N[e>>2];if(l<Q(0)|l>Q(1)){sa(4,3142,0);break a}l=N[e+8>>2];if(l<Q(0)|l>Q(1)){sa(4,3264,0);break a}p=J[a+28>>2];b:{if(c?!p|!b:1){oa(296655,-2);g=0;break b}if(J[p+12>>2]!=1){na(0,296667);g=0;break b}o=Sb(p);if(o>>>0<=c>>>0){g=J[p+28>>2];c:{if(!(!g|J[g+4>>2]==4096)){if(b&15){Qb(J[p+404>>2],b,o<<2);g=J[p+404>>2]}else{g=b}s=da-32|0;da=s;J[s+28>>2]=g;ha[J[J[J[p+32>>2]+4>>2]+20>>2]](J[p+36>>2],s+28|0,p+412|0,o,0,s+16|0);g=J[p+420>>2];J[s+20>>2]=J[p+396>>2]-g;J[s+12>>2]=J[p+412>>2];J[s+8>>2]=J[p+392>>2]+(g<<2);C=J[p+28>>2];G=s+12|0;J[s+24>>2]=1;d:{e:{q=J[s+20>>2];H=o<<12;g=J[C+8>>2];w=J[C+4>>2];y=((H-g|0)/(w|0)|0)-J[C>>2]|0;y=(q|0)<(y|0)?q:y;if((y|0)>0){q=C+16|0;break e}J[s+20>>2]=0;J[s+24>>2]=0;break d}v=J[G>>2];N[q+32>>2]=N[v>>2];f:{if((g|0)>=0){break f}r=J[s+8>>2];while(1){t=q+(g+32768>>12<<2)|0;l=N[t>>2];N[r+(n<<2)>>2]=l+Q(Q(Q(N[t+4>>2]-l)*Q(g&4095))*Q(.000244140625));g=g+w|0;n=n+1|0;if(y>>>0<=n>>>0){break f}if((g|0)<0){continue}break}}z=(y-n&-4)+n|0;if(z>>>0>n>>>0){M=J[s+8>>2];while(1){t=g+w|0;E=t+w|0;B=E+w|0;r=v+(B>>>10&4194300)|0;l=N[r>>2];u=N[r+4>>2];r=v+(E>>>10&4194300)|0;i=N[r>>2];A=N[r+4>>2];r=v+(t>>>10&4194300)|0;k=N[r>>2];F=N[r+4>>2];I=v+(g>>>10&4194300)|0;m=N[I>>2];r=M+(n<<2)|0;N[r>>2]=Q(Q(N[I+4>>2]-m)*Q(Q(g&4095)*Q(.000244140625)))+m;N[r+4>>2]=k+Q(Q(F-k)*Q(Q(t&4095)*Q(.000244140625)));N[r+8>>2]=i+Q(Q(A-i)*Q(Q(E&4095)*Q(.000244140625)));N[r+12>>2]=l+Q(Q(u-l)*Q(Q(B&4095)*Q(.000244140625)));g=w+B|0;n=n+4|0;if(z>>>0>n>>>0){continue}break}}if(n>>>0<y>>>0){r=J[s+8>>2];while(1){t=v+(g>>>10&4194300)|0;l=N[t>>2];N[r+(n<<2)>>2]=l+Q(Q(Q(N[t+4>>2]-l)*Q(g&4095))*Q(.000244140625));g=g+w|0;n=n+1|0;if((y|0)!=(n|0)){continue}break}}w=g;r=o-8|0;g:{if(o>>>0>=8){n=0;while(1){v=J[(n<<2)+G>>2]+(r<<2)|0;g=0;while(1){t=g<<2;N[t+(q+P(n,36)|0)>>2]=N[v+t>>2];g=g+1|0;if((g|0)!=8){continue}break}n=n+1|0;if((n|0)!=1){continue}break}break g}n=8-o|0;v=0;E=o<<2;while(1){t=q+P(v,36)|0;B=t+E|0;g=0;while(1){z=g<<2;N[z+t>>2]=N[B+z>>2];g=g+1|0;if((n|0)!=(g|0)){continue}break}if(o){B=J[(v<<2)+G>>2]+(r<<2)|0;g=n;while(1){z=g<<2;N[z+t>>2]=N[B+z>>2];g=g+1|0;if((g|0)!=8){continue}break}}v=v+1|0;if((v|0)!=1){continue}break}}J[C+8>>2]=w-H;J[s+20>>2]=y}J[p+420>>2]=J[p+420>>2]+J[s+20>>2];ed(p,J[p+392>>2]);q=J[p+420>>2];g=J[p+400>>2];n=q-g|0;J[p+420>>2]=n;if((g|0)!=(q|0)){q=J[p+392>>2];Qb(q,q+(g<<2)|0,n<<2)}da=s+32|0;break c}ed(p,b)}g=o}else{g=0}}J[d+8>>2]=g;g=J[a+28>>2];h:{if(!(a+32|0?g:0)){oa(296792,-2);break h}o=J[g+92>>2];J[a+32>>2]=J[g+88>>2];J[a+36>>2]=o;o=J[g+108>>2];J[a+48>>2]=J[g+104>>2];J[a+52>>2]=o;o=J[g+100>>2];J[a+40>>2]=J[g+96>>2];J[a+44>>2]=o}if(!Rb(J[a+28>>2],a+56|0)){sa(4,3341,0);break a}l=Q(0);o=0;i:{if(!b|!c){break i}q=J[d+8>>2];if(q>>>0<2){break i}g=q-1|0;c=c-1|0;c=c>>>0>g>>>0?g:c;g=c+1|0;n=g&3;j:{if(c>>>0<3){c=0;break j}w=g&-4;c=0;while(1){g=c<<2;i=N[(g|12)+b>>2];k=Q(i*i);i=N[(g|8)+b>>2];m=Q(i*i);i=N[(g|4)+b>>2];u=Q(i*i);i=N[b+g>>2];f=Q(k+Q(m+Q(u+Q(Q(i*i)+f))));c=c+4|0;o=o+4|0;if((w|0)!=(o|0)){continue}break}}if(n){while(1){i=N[(c<<2)+b>>2];f=Q(Q(i*i)+f);c=c+1|0;h=h+1|0;if((n|0)!=(h|0)){continue}break}}f=Q(f/Q(q>>>0));if(((D(f),x(2))&2147483647)>>>0>2139095040){break i}f=Q(Q(Y(f))*Q(6));if(f<Q(.009999999776482582)){break i}l=f;if(!(f>Q(1))){break i}l=Q(1)}b=J[a+28>>2];k:{if(!b){oa(4158,-2);f=Q(1);break k}f=N[J[b>>2]+200>>2]}i=N[a+72>>2];k=N[a+68>>2];m=N[a- -64>>2];u=N[a+60>>2];A=N[a+56>>2];u=u>A?u:A;m=m>u?m:u;k=k>m?k:m;i=i>k?i:k;k=Q(Q(.20000000298023224)-i);k=k>Q(0)?k:Q(0);N[j+64>>2]=f<Q(-50)?i==Q(0)?Q(1):k:k;N[j+68>>2]=N[a+56>>2];N[j+72>>2]=N[a+60>>2];N[j+76>>2]=N[a+64>>2];N[j+80>>2]=N[a+68>>2];N[j+84>>2]=N[a+72>>2];b=j- -64|0;m=N[b>>2];f=Q(Q(Q(Q(Q(Q(m+Q(0))+N[b+4>>2])+N[b+8>>2])+N[b+12>>2])+N[b+16>>2])+N[b+20>>2]);i=Q(Q(J[e+4>>2]-1|0)/Q(200));k=Q(Q(1)-i);c=J[a+116>>2];m=Q(Q(k*Q(m/f))+Q(N[c>>2]*i));N[b>>2]=m;N[c>>2]=m;m=Q(Q(k*Q(N[b+4>>2]/f))+Q(N[c+4>>2]*i));N[b+4>>2]=m;N[c+4>>2]=m;m=Q(Q(k*Q(N[b+8>>2]/f))+Q(N[c+8>>2]*i));N[b+8>>2]=m;N[c+8>>2]=m;m=Q(Q(k*Q(N[b+12>>2]/f))+Q(N[c+12>>2]*i));N[b+12>>2]=m;N[c+12>>2]=m;m=Q(Q(k*Q(N[b+16>>2]/f))+Q(N[c+16>>2]*i));N[b+16>>2]=m;N[c+16>>2]=m;f=Q(Q(k*Q(N[b+20>>2]/f))+Q(N[c+20>>2]*i));N[b+20>>2]=f;N[c+20>>2]=f;f=Q(0);i=Q(0);k=Q(0);c=j+32|0;J[c>>2]=0;J[c+4>>2]=0;J[c+16>>2]=0;J[c+20>>2]=0;J[c+8>>2]=0;J[c+12>>2]=0;h=J[a>>2];if(J[h+20>>2]){f=N[e+8>>2];k=Q(Q(N[h+16>>2]*N[b>>2])*za(za(Q(Q(1)-l),Q(3)),Q(f*Q(10))));f=Q(k+Q(0))}m=Q(l+Q(.5));m=Q(m+m);N[c>>2]=k;h=J[a+4>>2];if(J[h+20>>2]){i=Q(Q(N[h+16>>2]*N[b+4>>2])*za(m,Q(N[e+8>>2]*Q(10))));f=Q(f+i)}N[c+4>>2]=i;k=Q(0);h=J[a+8>>2];l:{if(!J[h+20>>2]){i=Q(0);break l}i=Q(Q(N[h+16>>2]*N[b+8>>2])*za(m,Q(N[e+8>>2]*Q(10))));f=Q(f+i)}N[c+8>>2]=i;h=J[a+12>>2];if(J[h+20>>2]){k=Q(Q(N[h+16>>2]*N[b+12>>2])*za(m,Q(N[e+8>>2]*Q(10))));f=Q(f+k)}N[c+12>>2]=k;k=Q(0);h=J[a+16>>2];m:{if(!J[h+20>>2]){i=Q(0);break m}i=Q(Q(N[h+16>>2]*N[b+16>>2])*za(m,Q(N[e+8>>2]*Q(10))));f=Q(f+i)}N[c+16>>2]=i;h=J[a+20>>2];if(J[h+20>>2]){k=Q(Q(N[h+16>>2]*N[b+20>>2])*za(m,Q(N[e+8>>2]*Q(10))));f=Q(f+k)}N[c+20>>2]=k;i=f;k=N[j+32>>2];b=J[a+112>>2];g=c+(b<<2)|0;f=N[g>>2];c=k>f;h=c?0:b;f=c?k:f;m=N[j+36>>2];c=f<m;h=c?1:h;f=c?m:f;u=N[j+40>>2];c=f<u;h=c?2:h;f=c?u:f;A=N[j+44>>2];c=f<A;h=c?3:h;f=c?A:f;F=N[j+48>>2];c=f<F;K=N[j+52>>2];h=K>(c?F:f)?5:c?4:h;f=Q(0);i=Q(La(Q(i*Q(100)))/Q(100));n:{if(i!=Q(0)){c=(j+32|0)+(h<<2)|0;o:{p:{q:{r:{s:{if(h){f=Q(La(Q(Q(k/i)*Q(100)))/Q(100));N[j+32>>2]=f;f=Q(f+Q(0));if((h|0)==1){break s}}k=Q(La(Q(Q(m/i)*Q(100)))/Q(100));N[j+36>>2]=k;f=Q(f+k);if((h|0)==2){break r}}k=Q(La(Q(Q(u/i)*Q(100)))/Q(100));N[j+40>>2]=k;f=Q(f+k);if((h|0)==3){break q}}k=Q(La(Q(Q(A/i)*Q(100)))/Q(100));N[j+44>>2]=k;f=Q(f+k);if((h|0)==4){break p}}k=Q(La(Q(Q(F/i)*Q(100)))/Q(100));N[j+48>>2]=k;f=Q(f+k);if((h|0)==5){break o}}i=Q(La(Q(Q(K/i)*Q(100)))/Q(100));N[j+52>>2]=i;f=Q(f+i)}N[c>>2]=Q(1)-f;break n}t:{u:{v:{w:{x:{y:{z:{A:{B:{if(!h){J[j+32>>2]=1065353216;break B}J[j+32>>2]=0;f=Q(1);if((h|0)!=1){break A}}N[j+36>>2]=f;f=Q(0);break z}J[j+36>>2]=0;if((h|0)!=2){break y}}N[j+40>>2]=f;f=Q(0);break x}J[j+40>>2]=0;if((h|0)!=3){break w}}N[j+44>>2]=f;f=Q(0);break v}J[j+44>>2]=0;if((h|0)!=4){break u}}N[j+48>>2]=f;f=Q(0);break t}J[j+48>>2]=0;f=(h|0)==5?Q(1):Q(0)}N[j+52>>2]=f;f=Q(0)}C:{D:{if(!(!(l>Q(0))|h)){if(N[j+32>>2]!=Q(1)){l=N[e>>2];break D}J[j+32>>2]=0;J[g>>2]=1065353216;h=b}l=N[e>>2];if(!h){break D}i=N[j+32>>2];break C}h=0;i=Q(0)}J[j+16>>2]=0;J[j+20>>2]=0;J[j+8>>2]=0;J[j+12>>2]=0;J[j>>2]=0;J[j+4>>2]=0;f=Q(f-i);N[j>>2]=N[j+32>>2];i=Q(Q(1)-l);k=N[j+36>>2];E:{F:{G:{H:{I:{J:{K:{L:{if((h|0)==1){N[j+4>>2]=Q(f*i)+k;f=Q(N[j+40>>2]*l);break L}N[j+4>>2]=k*l;k=N[j+40>>2];if((h|0)!=2){break K}f=Q(Q(f*i)+k)}N[j+8>>2]=f;f=Q(N[j+44>>2]*l);break J}N[j+8>>2]=k*l;k=N[j+44>>2];if((h|0)!=3){break I}f=Q(Q(f*i)+k)}N[j+12>>2]=f;f=Q(N[j+48>>2]*l);break H}N[j+12>>2]=k*l;k=N[j+48>>2];if((h|0)!=4){break G}f=Q(Q(f*i)+k)}N[j+16>>2]=f;break F}N[j+16>>2]=k*l;if((h|0)!=5){break F}N[j+20>>2]=Q(f*i)+N[j+52>>2];break E}N[j+20>>2]=N[j+52>>2]*l}f=N[j+16>>2];l=N[j+20>>2];i=N[j+12>>2];k=N[j+8>>2];m=N[j+4>>2];u=N[j>>2];J[a+112>>2]=h;h=J[a+120>>2];c=J[a+124>>2];g=J[d+4>>2];if((c|0)<(g|0)){if(h){b=J[76215];M:{if(b){ha[b|0](h);break M}Ia(h)}J[a+120>>2]=0}b=g<<2;c=J[76214];N:{if(c){h=ha[c|0](b)|0;break N}h=Za(b)}J[a+124>>2]=g;J[a+120>>2]=h;c=g}if(!(!h|(c|0)<=0)){b=0;e=0;if(c-1>>>0>=7){q=c&-8;while(1){o=e<<2;J[o+h>>2]=2143289344;J[(o|4)+h>>2]=2143289344;J[(o|8)+h>>2]=2143289344;J[(o|12)+h>>2]=2143289344;J[(o|16)+h>>2]=2143289344;J[(o|20)+h>>2]=2143289344;J[(o|24)+h>>2]=2143289344;J[(o|28)+h>>2]=2143289344;e=e+8|0;L=L+8|0;if((q|0)!=(L|0)){continue}break}}c=c&7;if(c){while(1){J[(e<<2)+h>>2]=2143289344;e=e+1|0;b=b+1|0;if((c|0)!=(b|0)){continue}break}}f=Q(Q(Q(Q(Q(Q(u+Q(0))+m)+k)+i)+f)+l);b=0;e=J[a>>2];c=J[e+8>>2];O:{if((g|0)<=0){P:{if(!c|(g|0)!=J[e+12>>2]){break P}b=J[a+4>>2];if(!J[b+8>>2]|(g|0)!=J[b+12>>2]){break P}b=J[a+8>>2];if(!J[b+8>>2]|(g|0)!=J[b+12>>2]){break P}b=J[a+12>>2];if(!J[b+8>>2]|(g|0)!=J[b+12>>2]){break P}b=J[a+16>>2];if(!J[b+8>>2]|(g|0)!=J[b+12>>2]){break P}a=J[a+20>>2];if(!J[a+8>>2]){break P}b=1;if((g|0)==J[a+12>>2]){break O}}b=0;break O}if(!c|(g|0)!=J[e+12>>2]){break O}l=Q(N[j>>2]/f);while(1){e=b<<2;h=e+c|0;i=N[h>>2];if((J[h>>2]&2147483647)>>>0<=2139095040){e=e+J[a+120>>2]|0;k=N[e>>2];N[e>>2]=Q(l*i)+((J[e>>2]&2147483647)>>>0>2139095040?Q(-0):k)}b=b+1|0;if((g|0)!=(b|0)){continue}break}b=0;c=J[a+4>>2];e=J[c+8>>2];if(!e|(g|0)!=J[c+12>>2]){break O}l=Q(N[j+4>>2]/f);while(1){c=b<<2;h=c+e|0;i=N[h>>2];if((J[h>>2]&2147483647)>>>0<=2139095040){c=c+J[a+120>>2]|0;k=N[c>>2];N[c>>2]=Q(l*i)+((J[c>>2]&2147483647)>>>0>2139095040?Q(-0):k)}b=b+1|0;if((g|0)!=(b|0)){continue}break}b=0;c=J[a+8>>2];e=J[c+8>>2];if(!e|(g|0)!=J[c+12>>2]){break O}l=Q(N[j+8>>2]/f);while(1){c=b<<2;h=c+e|0;i=N[h>>2];if((J[h>>2]&2147483647)>>>0<=2139095040){c=c+J[a+120>>2]|0;k=N[c>>2];N[c>>2]=Q(l*i)+((J[c>>2]&2147483647)>>>0>2139095040?Q(-0):k)}b=b+1|0;if((g|0)!=(b|0)){continue}break}b=0;c=J[a+12>>2];e=J[c+8>>2];if(!e|(g|0)!=J[c+12>>2]){break O}l=Q(N[j+12>>2]/f);while(1){c=b<<2;h=c+e|0;i=N[h>>2];if((J[h>>2]&2147483647)>>>0<=2139095040){c=c+J[a+120>>2]|0;k=N[c>>2];N[c>>2]=Q(l*i)+((J[c>>2]&2147483647)>>>0>2139095040?Q(-0):k)}b=b+1|0;if((g|0)!=(b|0)){continue}break}b=0;c=J[a+16>>2];e=J[c+8>>2];if(!e|(g|0)!=J[c+12>>2]){break O}l=Q(N[j+16>>2]/f);while(1){c=b<<2;h=c+e|0;i=N[h>>2];if((J[h>>2]&2147483647)>>>0<=2139095040){c=c+J[a+120>>2]|0;k=N[c>>2];N[c>>2]=Q(l*i)+((J[c>>2]&2147483647)>>>0>2139095040?Q(-0):k)}b=b+1|0;if((g|0)!=(b|0)){continue}break}b=0;c=J[a+20>>2];e=J[c+8>>2];if(!e|(g|0)!=J[c+12>>2]){break O}f=Q(N[j+20>>2]/f);while(1){c=b<<2;h=c+e|0;l=N[h>>2];if((J[h>>2]&2147483647)>>>0<=2139095040){c=c+J[a+120>>2]|0;i=N[c>>2];N[c>>2]=Q(f*l)+((J[c>>2]&2147483647)>>>0>2139095040?Q(-0):i)}b=b+1|0;if((g|0)!=(b|0)){continue}break}b=1;if((g|0)<=0){break O}c=J[d>>2];d=J[a+120>>2];e=0;a=0;if(g-1>>>0>=3){q=g&-4;o=0;while(1){h=a<<2;N[h+c>>2]=N[d+h>>2];n=h|4;N[n+c>>2]=N[d+n>>2];n=h|8;N[n+c>>2]=N[d+n>>2];h=h|12;N[h+c>>2]=N[d+h>>2];a=a+4|0;o=o+4|0;if((q|0)!=(o|0)){continue}break}}h=g&3;if(!h){break O}while(1){g=a<<2;N[g+c>>2]=N[d+g>>2];a=a+1|0;e=e+1|0;if((h|0)!=(e|0)){continue}break}}h=b;break a}h=0;sa(4,3467,0)}da=j+96|0;return h|0}function Pd(a,b,c,d){var e=Q(0),f=0,g=0,h=0,i=Q(0),j=0,k=0,l=0,m=Q(0),n=0,o=0,p=0,q=Q(0),r=Q(0),s=Q(0),t=0,u=0;h=da-368|0;da=h;a:{if(M[a>>2]>d>>>0){break a}if((ae(J[a+524>>2],b,d)|0)!=J[a>>2]){na(0,293609);break a}if(!ub(J[a+524>>2])){na(0,293687);break a}f=24;b=a+104|0;Ta(J[a+524>>2],b,J[77932],J[77933],J[77934]);Ga(J[a+492>>2],b);n=cc(J[a+492>>2]);dc(J[a+492>>2]);b=da-16|0;da=b;j=J[a+524>>2];b:{if(!(h?j:0)){oa(293072,-2);break b}if(!ub(j)){oa(293084,-2);break b}Wa(J[j+4>>2],1,J[j+24>>2]<<2,b+8|0);k=J[j+24>>2];if(k){l=J[b+8>>2];while(1){e=Q(e+N[l+(g<<2)>>2]);g=g+1|0;if((k|0)!=(g|0)){continue}break}i=Q(e/Q(k>>>0));g=0;e=Q(0);while(1){m=e;e=Q(N[l+(g<<2)>>2]-i);e=Q(m+Q(e*e));g=g+1|0;if((k|0)!=(g|0)){continue}break}}Bc(J[j+4>>2],b+8|0);N[b+4>>2]=U(Q(e/Q(M[j+24>>2])),Q(1.1754943508222875e-38));$d(b+4|0,1);N[h>>2]=N[b+4>>2]}da=b+16|0;e=Q(N[h>>2]*Q(10));N[a+200>>2]=e;b=e<N[a+484>>2];j=a+528|0;if(J[j>>2]==1){c:{d:{if(b){break d}g=J[j+4>>2];if(g>>>0>=M[j+8>>2]){break d}g=g+1|0;break c}J[j>>2]=0;g=0}J[j+4>>2]=g}e:{if(b){break e}k=ra(h,0,100);g=0;while(1){f=0;while(1){o=P(f,36)+21760|0;e=Q(0);b=0;while(1){t=P(b,3);u=P(b,24)+g|0;l=0;while(1){e=Q(Q(N[n+(l+u<<2)>>2]*N[o+(l+t<<2)>>2])+e);l=l+1|0;if((l|0)!=3){continue}break}b=b+1|0;if((b|0)!=3){continue}break}N[(P(f,88)+(g<<2)|0)+306432>>2]=e+N[(f<<2)+22128>>2];f=f+1|0;if((f|0)!=10){continue}break}g=g+1|0;if((g|0)!=22){continue}break}f=0;g=ra(307312,0,512);while(1){l=(f<<9)+22176|0;e=N[(f<<2)+306432>>2];b=0;while(1){n=b<<2;o=n+g|0;N[o>>2]=Q(N[l+n>>2]*e)+N[o>>2];b=b+1|0;if((b|0)!=128){continue}break}f=f+1|0;if((f|0)!=220){continue}break}b=0;while(1){f=b<<2;g=f+307312|0;N[g>>2]=N[f+134816>>2]+N[g>>2];b=b+1|0;if((b|0)!=128){continue}break}Fb(307312,307824);Ic(135328,200864,307824,308336);Fb(308336,308848);Ic(201376,266912,308848,309360);Fb(309360,309872);f=0;g=ra(310384,0,96);while(1){l=P(f,96)+267424|0;e=N[(f<<2)+309872>>2];b=0;while(1){n=b<<2;o=n+g|0;N[o>>2]=Q(N[l+n>>2]*e)+N[o>>2];b=b+1|0;if((b|0)!=24){continue}break}f=f+1|0;if((f|0)!=128){continue}break}b=0;while(1){f=b<<2;g=f+310384|0;N[g>>2]=N[f+279712>>2]+N[g>>2];b=b+1|0;if((b|0)!=24){continue}break}b=0;while(1){p=p+$a(+N[(b<<2)+310384>>2]);b=b+1|0;if((b|0)!=24){continue}break}p=U(p,2.2250738585072014e-308);b=0;while(1){f=b<<2;N[f+k>>2]=$a(+N[f+310384>>2])/p;b=b+1|0;if((b|0)!=24){continue}break}J[k+96>>2]=0;f=0;b=0;f:{while(1){if((J[k+(f<<2)>>2]&2139095040)==2139095040){break f}f=f+1|0;if((f|0)!=25){continue}break}e=N[k>>2];f=1;while(1){i=N[k+(f<<2)>>2];g=i>e;e=g?i:e;b=g?f:b;f=f+1|0;if((f|0)!=25){continue}break}J[k+272>>2]=b;b=1}if(b){f=J[k+272>>2];break e}f=0;na(0,293769);break a}J[a+552>>2]=f;g=J[a+500>>2];b=f>>>0<=23?J[(f<<2)+294152>>2]:4;g:{if(!g){oa(293364,-2);break g}J[J[g>>2]+(J[g+8>>2]<<2)>>2]=b;J[g+8>>2]=(J[g+8>>2]+1>>>0)%M[g+4>>2]}Xd(J[a+500>>2],h);if(!(J[j+4>>2]|J[h>>2]!=1)){J[j>>2]=1}sb(J[a+524>>2]);if((ae(J[a+520>>2],c,d)|0)!=J[a>>2]){f=0;na(0,293830);break a}if(!ub(J[a+520>>2])){f=0;na(0,293908);break a}if(J[a+544>>2]){b=a+8|0;Ta(J[a+520>>2],b,J[77935],J[77936],J[77937]);Ga(J[a+488>>2],b);b=cc(J[a+488>>2]);Xd(J[a+500>>2],h+272|0);J[h+8>>2]=J[a+528>>2]?1:J[h+272>>2];d=0;i=Q(0);while(1){c=d<<2;N[c+310480>>2]=N[b+c>>2]*Q(.009999999776482582);d=d+1|0;if((d|0)!=72){continue}break}b=0;while(1){e=Q(0);d=0;while(1){e=Q(e+N[(P(d,24)+b<<2)+310480>>2]);d=d+1|0;if((d|0)!=3){continue}break}N[(b<<2)+310768>>2]=e/Q(3);b=b+1|0;if((b|0)!=24){continue}break}d=0;c=ra(310864,0,128);while(1){j=(d<<7)+279808|0;e=N[(d<<2)+310768>>2];b=0;while(1){f=b<<2;g=f+c|0;N[g>>2]=Q(N[f+j>>2]*e)+N[g>>2];b=b+1|0;if((b|0)!=32){continue}break}d=d+1|0;if((d|0)!=24){continue}break}b=0;while(1){c=b<<2;d=c+310864|0;N[d>>2]=N[c+282880>>2]+N[d>>2];b=b+1|0;if((b|0)!=32){continue}break}Eb(310864,310992);Hc(283008,287104,310992,311120);Eb(311120,311248);Hc(287232,291328,311248,311376);Eb(311376,311504);b=0;e=Q(0);while(1){c=b<<3;m=N[(b<<2)+311504>>2];e=Q(Q(N[c+291460>>2]*m)+e);i=Q(Q(N[c+291456>>2]*m)+i);b=b+1|0;if((b|0)!=32){continue}break}N[77909]=e+Q(-.8470831513404846);N[77908]=i+Q(-.41103917360305786);d=0;b=1;while(1){c=d<<2;i=Q($a(+N[c+311632>>2]));e=Q(1);h:{if(i>=Q(3.4028234663852886e38)){break h}e=Q(0);if(i<=Q(1.1754943508222875e-38)){break h}e=Q(Q(1)/Q(Q(Q(1)/i)+Q(1)))}N[c+311640>>2]=e;d=1;c=b;b=0;if(c){continue}break}N[77912]=N[77910]*Q(.8999999761581421);N[77913]=N[77911]*Q(.8999999761581421);N[h+272>>2]=N[77912]+Q(.10000000149011612);N[h+276>>2]=N[77913]+Q(.10000000149011612);b=J[h+276>>2];J[h>>2]=J[h+272>>2];J[h+4>>2]=b;dc(J[a+488>>2]);c=da-32|0;da=c;b=J[a+504>>2];i:{j:{k:{switch(J[h+8>>2]){case 1:e=N[h+4>>2];i=N[b+24>>2];Ea(J[b>>2],N[b+16>>2],N[b+20>>2]);Ea(J[b+4>>2],N[b+12>>2],N[b+20>>2]);Xa(J[b>>2],e<i?e:i);Xa(J[b+4>>2],N[h>>2]);Da(J[b+8>>2],N[b+44>>2]);break j;case 2:e=N[b+28>>2];d=J[b>>2];if(e<N[d>>2]){N[d>>2]=e}Ea(J[b>>2],N[b+16>>2],N[b+20>>2]);Ea(J[b+4>>2],N[b+12>>2],N[b+20>>2]);Da(J[b>>2],N[b+36>>2]);Da(J[b+4>>2],N[b+40>>2]);Xa(J[b+8>>2],Q(1));break j;case 3:Ea(J[b>>2],N[b+12>>2],N[b+20>>2]);Ea(J[b+4>>2],N[b+12>>2],N[b+20>>2]);Da(J[b>>2],N[b+36>>2]);Da(J[b+4>>2],N[b+40>>2]);Da(J[b+8>>2],N[b+44>>2]);break j;case 4:Ea(J[b>>2],N[b+12>>2],N[b+20>>2]);Ea(J[b+4>>2],N[b+12>>2],N[b+20>>2]);Da(J[b>>2],N[b+32>>2]);Da(J[b+4>>2],N[b+40>>2]);Da(J[b+8>>2],N[b+44>>2]);break j;default:oa(291712,-2);break i;case 0:break k}}Ea(J[b>>2],N[b+12>>2],N[b+20>>2]);Ea(J[b+4>>2],N[b+12>>2],N[b+20>>2]);Xa(J[b>>2],N[h+4>>2]);Xa(J[b+4>>2],N[h>>2]);Da(J[b+8>>2],N[b+44>>2])}J[b+68>>2]=J[h+8>>2]}b=c+8|0;d=J[a+504>>2];j=J[d>>2];N[b+4>>2]=N[j>>2];f=J[d+4>>2];N[b>>2]=N[f>>2];d=J[d+8>>2];N[b+8>>2]=N[d>>2];J[b+16>>2]=J[j+20>>2];J[b+12>>2]=J[f+20>>2];J[b+20>>2]=J[d+20>>2];Od(b,a+204|0);da=c+32|0}l:{if(J[a+548>>2]){f=0;b=h+272|0;Ta(J[a+520>>2],b,J[77929],J[77930],J[77931]);Ga(J[a+496>>2],b);b=cc(J[a+496>>2]);dc(J[a+496>>2]);c=J[a+552>>2];if(c>>>0<=24){c=J[(c<<2)+294248>>2]}else{c=3}J[h+260>>2]=J[a+528>>2]?2:c;m:{n:{switch(J[a+512>>2]){case 0:Fc(b,h);b=h+20|0;break m;case 1:break n;default:break l}}Fc(b,h);J[h+20>>2]=0;J[h+24>>2]=0;b=h+28|0}J[b>>2]=0;d=J[a+508>>2];b=0;j=da-16|0;da=j;o:{if(J[h+260>>2]==4){c=J[d+36>>2];if(c>>>0<M[d+40>>2]){J[d+32>>2]=1;J[d+36>>2]=c+1;break o}J[d+24>>2]=1;J[d+32>>2]=0;break o}J[d+32>>2]=0;J[d+36>>2]=0;J[d+24>>2]=0}q=N[d+(J[d+24>>2]?20:16)>>2];r=Q(1);r=J[h+260>>2]?r:N[d+64>>2];g=J[d+60>>2];p:{if((g|0)>0){while(1){g=b<<2;c=J[g+J[d+8>>2]>>2];q:{if(J[d+32>>2]){e=N[g+J[d+48>>2]>>2];break q}r:{switch(J[h+260>>2]){case 0:e=N[g+h>>2];break q;case 1:s:{t:{u:{switch(J[d+4>>2]){case 0:e=Q(1);if((b|0)!=5){break t}break s;case 1:break u;default:break t}}e=Q(1);if((b|0)==5){break s}}e=Q(0)}break q;case 2:v:{w:{x:{switch(J[d+4>>2]){case 0:e=Q(1);if((b|0)!=5){break w}break v;case 1:break x;default:break w}}e=Q(1);if((b|0)==6){break v}}e=Q(0)}break q;case 3:e=N[g+J[d+44>>2]>>2];break q;case 4:break r;default:break p}}e=ib(J[d+4>>2],b)}Lc(c,e);m=Q(0);k=g+J[d+52>>2]|0;y:{if(!(k?c:0)){oa(5058,-2);break y}if(N[c+8>>2]<q){oa(5070,-2);break y}i=N[c+4>>2];e=Q(Q(1)/i);i=Fa(i,e>q?e:q);if(i>Q(0)){l=J[c+12>>2];g=Hb(J[c+16>>2],l);c=J[c>>2];e=i;while(1){s=N[c+(g<<2)>>2];m=e<=Q(1)?Q(Q(e*s)+m):Q(m+s);g=Hb(g,l);e=Q(e+Q(-1));if(e>Q(0)){continue}break}}N[k>>2]=m/i}b=b+1|0;g=J[d+60>>2];if((b|0)<(g|0)){continue}break}}l=J[d+52>>2];b=0;c=0;k=g-1|0;if((k|0)>0){e=Q(-3.4028234663852886e38);while(1){i=N[l+(b<<2)>>2];c=i>e;e=c?i:e;f=c?b:f;b=b+1|0;if((k|0)!=(b|0)){continue}break}c=0;e=Q(-3.4028234663852886e38);b=0;while(1){z:{if((b|0)==(f|0)){break z}i=N[l+(b<<2)>>2];if(!(i>e)){break z}c=b;e=i}b=b+1|0;if((k|0)!=(b|0)){continue}break}}J[j+12>>2]=f;J[j+8>>2]=c;if((g|0)>0){b=0;f=J[j+8>>2];g=J[j+12>>2];while(1){c=b<<2;e=N[c+J[d+52>>2]>>2];A:{if(!((b|0)!=(k|0)&(b|0)!=(g|0))){break A}e=Q(r*N[J[d+52>>2]+(f<<2)>>2]);if((b|0)==(f|0)){break A}c=J[c+J[d+8>>2]>>2];B:{if(!c){oa(5082,-2);break B}J[c+16>>2]=Hb(J[c+16>>2],J[c+12>>2]);Lc(c,Q(0))}e=Q(0)}if(!(J[d+24>>2]?0:J[d+32>>2])){c=b<<2;l=c+J[d+56>>2]|0;c=c+J[d+48>>2]|0;J[l>>2]=Ha(e,N[c>>2]);N[c>>2]=e}b=b+1|0;if((b|0)<J[d+60>>2]){continue}break}}J[d+68>>2]=J[h+260>>2]}da=j+16|0;b=J[a+508>>2];qa(a+228|0,J[b+48>>2],J[b+60>>2]<<2)}sb(J[a+520>>2]);f=J[a>>2];break a}na(0,293990)}da=h+368|0;return f}function Na(a,b,c,d){var e=0,f=0,g=Q(0),h=0,i=Q(0),j=Q(0),k=0,l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=0,s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=0,x=0,y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),H=Q(0),I=Q(0),K=Q(0),L=Q(0),M=Q(0),O=Q(0),R=0,S=0,T=0,U=Q(0),V=Q(0),W=Q(0),X=Q(0),Y=Q(0),Z=Q(0),_=Q(0),$=0,aa=0,ba=0,ca=Q(0),ea=Q(0),fa=Q(0),ga=0,ha=Q(0),ia=Q(0),ja=Q(0),ka=Q(0),la=Q(0),ma=0;e=da-96|0;da=e;aa=c>>>3|0;O=Q(d|0);n=Q(3.1415927410125732);a:{if(c>>>0<16){S=1;r=a;R=b;d=aa;break a}d=b;r=a;S=1;f=c;while(1){w=f;R=r;r=d;m=hb(n);v=Va(n);if((S|0)>0){ba=w>>>3|0;ma=ba<<1;g=Q(1);l=Q(0);x=0;ga=0;$=aa;while(1){if(w>>>0>=8){d=(ga<<5)+R|0;f=($<<5)+R|0;k=P(x,ma);h=(k<<5)+r|0;k=(k+ba<<5)+r|0;j=Q(l*O);i=Q(-j);T=0;while(1){E=N[h+36>>2];F=N[h+40>>2];G=N[h+44>>2];H=N[h+48>>2];s=N[k+48>>2];y=N[h+52>>2];o=N[k+36>>2];z=N[k+52>>2];A=N[h+56>>2];p=N[k+40>>2];I=N[k+56>>2];K=N[h+60>>2];t=N[k+44>>2];B=N[k+60>>2];C=N[h+20>>2];u=N[k+20>>2];D=N[h+24>>2];q=N[k+24>>2];L=N[h+28>>2];M=N[k+28>>2];U=N[h+32>>2];V=N[k+32>>2];W=N[h+4>>2];X=N[h+8>>2];Y=N[h+12>>2];Z=N[k+4>>2];_=N[k+8>>2];ca=N[k+12>>2];ha=N[h>>2];ea=N[k>>2];fa=N[k+16>>2];ia=Q(Q(j*ea)+Q(g*fa));ja=N[h+16>>2];N[d+16>>2]=ia+ja;ea=Q(Q(i*fa)+Q(g*ea));N[d>>2]=ha+ea;fa=Q(Q(j*ca)+Q(g*M));N[d+28>>2]=L+fa;ka=Q(Q(j*_)+Q(g*q));N[d+24>>2]=D+ka;la=Q(Q(j*Z)+Q(g*u));N[d+20>>2]=C+la;M=Q(Q(i*M)+Q(g*ca));N[d+12>>2]=Y+M;q=Q(Q(i*q)+Q(g*_));N[d+8>>2]=X+q;u=Q(Q(i*u)+Q(g*Z));N[d+4>>2]=W+u;N[f+28>>2]=L-fa;N[f+24>>2]=D-ka;N[f+20>>2]=C-la;N[f+16>>2]=ja-ia;N[f+12>>2]=Y-M;N[f+8>>2]=X-q;N[f+4>>2]=W-u;N[f>>2]=ha-ea;C=Q(Q(j*t)+Q(g*B));N[d+60>>2]=K+C;u=Q(Q(j*p)+Q(g*I));N[d+56>>2]=A+u;D=Q(Q(j*o)+Q(g*z));N[d+52>>2]=y+D;q=Q(Q(j*V)+Q(g*s));N[d+48>>2]=H+q;t=Q(Q(i*B)+Q(g*t));N[d+44>>2]=G+t;p=Q(Q(i*I)+Q(g*p));N[d+40>>2]=F+p;o=Q(Q(i*z)+Q(g*o));N[d+36>>2]=E+o;s=Q(Q(i*s)+Q(g*V));N[d+32>>2]=U+s;N[f+60>>2]=K-C;N[f+56>>2]=A-u;N[f+52>>2]=y-D;N[f+48>>2]=H-q;N[f+44>>2]=G-t;N[f+40>>2]=F-p;N[f+36>>2]=E-o;N[f+32>>2]=U-s;k=k- -64|0;h=h- -64|0;f=f- -64|0;d=d- -64|0;T=T+2|0;if(ba>>>0>T>>>0){continue}break}}j=Q(v*l);l=Q(Q(l*m)+Q(v*g));g=Q(Q(g*m)-j);$=$+ba|0;ga=ba+ga|0;x=x+1|0;if((x|0)!=(S|0)){continue}break}}f=w>>>1|0;n=Q(n*Q(.5));S=S<<1;d=R;if(w>>>0>31){continue}break}d=w>>>4|0}l=hb(n);m=Va(n);if((S|0)>0){k=d<<1;g=Q(1);j=Q(0);T=0;$=0;x=aa;while(1){h=P(k,T);f=(h<<5)+R|0;v=N[f+4>>2];E=N[f+8>>2];F=N[f+12>>2];G=N[f+20>>2];h=(d+h<<5)+R|0;H=N[h+20>>2];s=N[h+4>>2];y=N[f+24>>2];o=N[h+24>>2];z=N[h+8>>2];A=N[f+28>>2];p=N[h+28>>2];I=N[h+12>>2];K=N[f>>2];w=($<<5)+r|0;i=Q(j*O);t=N[h>>2];B=N[h+16>>2];C=Q(Q(i*t)+Q(g*B));u=N[f+16>>2];N[w+16>>2]=C+u;t=Q(Q(g*t)-Q(i*B));N[w>>2]=K+t;B=Q(Q(i*I)+Q(g*p));N[w+28>>2]=A+B;D=Q(Q(i*z)+Q(g*o));N[w+24>>2]=y+D;q=Q(Q(i*s)+Q(g*H));N[w+20>>2]=G+q;p=Q(Q(g*I)-Q(i*p));N[w+12>>2]=F+p;o=Q(Q(g*z)-Q(i*o));N[w+8>>2]=E+o;i=Q(Q(g*s)-Q(i*H));N[w+4>>2]=v+i;f=(x<<5)+r|0;N[f+28>>2]=A-B;N[f+24>>2]=y-D;N[f+20>>2]=G-q;N[f+16>>2]=u-C;N[f+12>>2]=F-p;N[f+8>>2]=E-o;N[f+4>>2]=v-i;N[f>>2]=K-t;i=Q(m*g);g=Q(Q(g*l)-Q(m*j));x=d+x|0;$=d+$|0;j=Q(i+Q(j*l));T=T+1|0;if((T|0)!=(S|0)){continue}break}}v=Q(n*Q(.5));g=Q(v+v);l=hb(g);m=Va(g);N[e+88>>2]=v;N[e+92>>2]=v;d=J[e+92>>2];J[e+56>>2]=J[e+88>>2];J[e+60>>2]=d;J[e+80>>2]=0;J[e+84>>2]=0;J[e+48>>2]=0;J[e+52>>2]=0;d=e- -64|0;eb(d,e+48|0);f=J[e+92>>2];J[e+40>>2]=J[e+88>>2];J[e+44>>2]=f;f=J[e+84>>2];J[e+32>>2]=J[e+80>>2];J[e+36>>2]=f;j=N[e+76>>2];g=N[e+72>>2];i=N[e+68>>2];n=N[e+64>>2];fb(d,e+32|0);d=J[e+76>>2];J[e+88>>2]=J[e+72>>2];J[e+92>>2]=d;d=J[e+68>>2];J[e+80>>2]=J[e+64>>2];J[e+84>>2]=d;x=S<<1;if((x|0)>0){f=(aa<<5)+R|0;k=0;d=r;h=R;while(1){E=N[e+92>>2];N[e+92>>2]=Q(E*l)+Q(m*j);F=N[e+88>>2];N[e+88>>2]=Q(F*l)+Q(m*g);G=N[e+84>>2];N[e+84>>2]=Q(G*l)+Q(m*i);H=N[e+80>>2];N[e+80>>2]=Q(H*l)+Q(m*n);s=N[d+36>>2];y=N[d+24>>2];o=N[d+20>>2];z=N[d+28>>2];A=N[d+48>>2];p=N[d+56>>2];I=N[d+40>>2];K=N[d>>2];t=N[d+4>>2];B=N[d+32>>2];C=N[d+16>>2];u=N[d+8>>2];D=N[d+12>>2];q=N[d+52>>2];L=N[d+60>>2];M=Q(E*O);U=N[d+44>>2];V=Q(Q(j*L)+Q(M*U));N[f+28>>2]=q-V;W=Q(F*O);X=Q(Q(g*p)+Q(I*W));N[f+24>>2]=A-X;Y=Q(G*O);Z=Q(Q(i*z)+Q(D*Y));N[f+20>>2]=o-Z;_=Q(H*O);ca=Q(Q(n*y)+Q(u*_));N[f+16>>2]=C-ca;L=Q(Q(j*U)-Q(L*M));N[f+12>>2]=s-L;p=Q(Q(g*I)-Q(p*W));N[f+8>>2]=B-p;z=Q(Q(i*D)-Q(z*Y));N[f+4>>2]=t-z;y=Q(Q(n*u)-Q(y*_));N[f>>2]=K-y;N[h+28>>2]=q+V;N[h+24>>2]=A+X;N[h+20>>2]=o+Z;N[h+16>>2]=C+ca;N[h+12>>2]=s+L;N[h+8>>2]=B+p;N[h+4>>2]=t+z;N[h>>2]=K+y;j=Q(Q(j*l)-Q(m*E));g=Q(Q(g*l)-Q(m*F));i=Q(Q(i*l)-Q(m*G));n=Q(Q(n*l)-Q(m*H));f=f+32|0;h=h+32|0;d=d- -64|0;k=k+2|0;if((x|0)>(k|0)){continue}break}}g=Q(v*Q(.5));n=Q(g*Q(4));l=hb(n);m=Va(n);N[e+88>>2]=g+g;N[e+92>>2]=g*Q(3);d=J[e+92>>2];J[e+24>>2]=J[e+88>>2];J[e+28>>2]=d;N[e+84>>2]=g;h=0;J[e+80>>2]=0;d=J[e+84>>2];J[e+16>>2]=J[e+80>>2];J[e+20>>2]=d;d=e- -64|0;eb(d,e+16|0);f=J[e+92>>2];J[e+8>>2]=J[e+88>>2];J[e+12>>2]=f;f=J[e+84>>2];J[e>>2]=J[e+80>>2];J[e+4>>2]=f;j=N[e+76>>2];g=N[e+72>>2];i=N[e+68>>2];n=N[e+64>>2];fb(d,e);d=J[e+76>>2];J[e+88>>2]=J[e+72>>2];J[e+92>>2]=d;d=J[e+68>>2];J[e+80>>2]=J[e+64>>2];J[e+84>>2]=d;x=S<<2;if((x|0)>0){f=(aa<<5)+r|0;d=R;while(1){v=N[e+92>>2];N[e+92>>2]=Q(v*l)+Q(m*j);E=N[e+88>>2];N[e+88>>2]=Q(E*l)+Q(m*g);F=N[e+84>>2];N[e+84>>2]=Q(F*l)+Q(m*i);G=N[e+80>>2];N[e+80>>2]=Q(G*l)+Q(m*n);H=N[d+40>>2];s=N[d+20>>2];y=N[d+24>>2];o=N[d+28>>2];z=N[d+48>>2];A=N[d+52>>2];p=N[d+36>>2];I=N[d>>2];K=N[d+8>>2];t=N[d+32>>2];B=N[d+16>>2];C=N[d+4>>2];u=N[d+12>>2];D=N[d+56>>2];q=N[d+60>>2];L=Q(v*O);M=N[d+44>>2];U=Q(Q(j*q)+Q(L*M));N[f+28>>2]=D-U;V=Q(E*O);W=Q(Q(g*A)+Q(p*V));N[f+24>>2]=z-W;X=Q(F*O);Y=Q(Q(i*o)+Q(u*X));N[f+20>>2]=y-Y;Z=Q(G*O);_=Q(Q(n*s)+Q(C*Z));N[f+16>>2]=B-_;q=Q(Q(j*M)-Q(q*L));N[f+12>>2]=H-q;A=Q(Q(g*p)-Q(A*V));N[f+8>>2]=t-A;o=Q(Q(i*u)-Q(o*X));N[f+4>>2]=K-o;s=Q(Q(n*C)-Q(s*Z));N[f>>2]=I-s;N[r+28>>2]=D+U;N[r+24>>2]=z+W;N[r+20>>2]=y+Y;N[r+16>>2]=B+_;N[r+12>>2]=H+q;N[r+8>>2]=t+A;N[r+4>>2]=K+o;N[r>>2]=I+s;j=Q(Q(j*l)-Q(m*v));g=Q(Q(g*l)-Q(m*E));i=Q(Q(i*l)-Q(m*F));n=Q(Q(n*l)-Q(m*G));f=f+32|0;r=r+32|0;d=d- -64|0;h=h+4|0;if((x|0)>(h|0)){continue}break}}if((b|0)!=(R|0)){qa(a,b,c<<3&-32)}da=e+96|0}function re(a,b,c,d,e,f){a=a|0;b=+b;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,y=0,z=0;l=da-560|0;da=l;J[l+44>>2]=0;C(+b);g=x(1)|0;x(0)|0;a:{if((g|0)<0){s=1;v=302934;b=-b;C(+b);g=x(1)|0;x(0)|0;break a}if(e&2048){s=1;v=302937;break a}s=e&1;v=s?302940:302935;z=!s}b:{if((g&2146435072)==2146435072){d=s+3|0;va(a,32,c,d,e&-65537);ua(a,v,s);f=f&32;ua(a,b!=b?f?302953:302961:f?302957:302965,3);va(a,32,c,d,e^8192);i=(c|0)<(d|0)?d:c;break b}u=l+16|0;c:{d:{e:{b=Vc(b,l+44|0);b=b+b;if(b!=0){g=J[l+44>>2];J[l+44>>2]=g-1;r=f|32;if((r|0)!=97){break e}break c}r=f|32;if((r|0)==97){break c}k=J[l+44>>2];m=(d|0)<0?6:d;break d}k=g-29|0;J[l+44>>2]=k;b=b*268435456;m=(d|0)<0?6:d}p=(k|0)<0?l+48|0:l+336|0;h=p;while(1){if(b<4294967296&b>=0){d=~~b>>>0}else{d=0}J[h>>2]=d;h=h+4|0;b=(b-+(d>>>0))*1e9;if(b!=0){continue}break}f:{if((k|0)<=0){d=k;g=h;j=p;break f}j=p;d=k;while(1){d=(d|0)<29?d:29;g=h-4|0;g:{if(j>>>0>g>>>0){break g}i=0;while(1){o=J[g>>2];n=d&31;w=i;if((d&63)>>>0>=32){i=o<<n;o=0}else{i=(1<<n)-1&o>>>32-n;o=o<<n}n=w+o|0;i=i+y|0;i=n>>>0<o>>>0?i+1|0:i;i=Ue(n,i,1e9,0);o=Re(i,ga,-1e9,0)+n|0;J[g>>2]=o;g=g-4|0;if(j>>>0<=g>>>0){continue}break}if(!i){break g}j=j-4|0;J[j>>2]=i}while(1){g=h;if(j>>>0<g>>>0){h=g-4|0;if(!J[h>>2]){continue}}break}d=J[l+44>>2]-d|0;J[l+44>>2]=d;h=g;if((d|0)>0){continue}break}}if((d|0)<0){t=((m+25>>>0)/9|0)+1|0;n=(r|0)==102;while(1){d=0-d|0;i=(d|0)<9?d:9;h:{if(g>>>0<=j>>>0){h=J[j>>2];break h}o=1e9>>>i|0;y=-1<<i^-1;d=0;h=j;while(1){w=d;d=J[h>>2];J[h>>2]=w+(d>>>i|0);d=P(o,d&y);h=h+4|0;if(h>>>0<g>>>0){continue}break}h=J[j>>2];if(!d){break h}J[g>>2]=d;g=g+4|0}d=i+J[l+44>>2]|0;J[l+44>>2]=d;j=(!h<<2)+j|0;h=n?p:j;g=g-h>>2>(t|0)?h+(t<<2)|0:g;if((d|0)<0){continue}break}}d=0;i:{if(g>>>0<=j>>>0){break i}d=P(p-j>>2,9);h=10;i=J[j>>2];if(i>>>0<10){break i}while(1){d=d+1|0;h=P(h,10);if(i>>>0>=h>>>0){continue}break}}h=(m-((r|0)==102?0:d)|0)-((r|0)==103&(m|0)!=0)|0;if((h|0)<(P(g-p>>2,9)-9|0)){i=h+9216|0;n=(i|0)/9|0;k=((((k|0)<0?4:292)+l|0)+(n<<2)|0)-4048|0;h=10;i=i+P(n,-9)|0;if((i|0)<=7){while(1){h=P(h,10);i=i+1|0;if((i|0)!=8){continue}break}}n=J[k>>2];t=(n>>>0)/(h>>>0)|0;i=P(t,h);o=k+4|0;j:{if((i|0)==(n|0)&(o|0)==(g|0)){break j}n=n-i|0;k:{if(!(t&1)){b=9007199254740992;if(!(H[k-4|0]&1)|((h|0)!=1e9|j>>>0>=k>>>0)){break k}}b=9007199254740994}q=(g|0)==(o|0)?1:1.5;o=h>>>1|0;q=n>>>0<o>>>0?.5:(o|0)==(n|0)?q:1.5;if(!(K[v|0]!=45|z)){q=-q;b=-b}J[k>>2]=i;if(b+q==b){break j}d=h+i|0;J[k>>2]=d;if(d>>>0>=1e9){while(1){J[k>>2]=0;k=k-4|0;if(k>>>0<j>>>0){j=j-4|0;J[j>>2]=0}d=J[k>>2]+1|0;J[k>>2]=d;if(d>>>0>999999999){continue}break}}d=P(p-j>>2,9);h=10;i=J[j>>2];if(i>>>0<10){break j}while(1){d=d+1|0;h=P(h,10);if(i>>>0>=h>>>0){continue}break}}h=k+4|0;g=g>>>0>h>>>0?h:g}while(1){h=g;i=g>>>0<=j>>>0;if(!i){g=h-4|0;if(!J[g>>2]){continue}}break}l:{if((r|0)!=103){k=e&8;break l}g=m?m:1;k=(g|0)>(d|0)&(d|0)>-5;m=(k?d^-1:-1)+g|0;f=(k?-1:-2)+f|0;k=e&8;if(k){break l}g=-9;m:{if(i){break m}n=J[h-4>>2];if(!n){break m}i=10;g=0;if((n>>>0)%10|0){break m}while(1){k=g;g=g+1|0;i=P(i,10);if(!((n>>>0)%(i>>>0)|0)){continue}break}g=k^-1}i=P(h-p>>2,9);if((f&-33)==70){k=0;g=(g+i|0)-9|0;g=(g|0)>0?g:0;m=(g|0)>(m|0)?m:g;break l}k=0;g=((d+i|0)+g|0)-9|0;g=(g|0)>0?g:0;m=(g|0)>(m|0)?m:g}i=-1;r=k|m;if(((r?2147483645:2147483646)|0)<(m|0)){break b}n=(((r|0)!=0)+m|0)+1|0;o=f&-33;n:{if((o|0)==70){if((2147483647-n|0)<(d|0)){break b}g=(d|0)>0?d:0;break n}g=d>>31;g=Qa((g^d)-g|0,0,u);if((u-g|0)<=1){while(1){g=g-1|0;H[g|0]=48;if((u-g|0)<2){continue}break}}t=g-2|0;H[t|0]=f;H[g-1|0]=(d|0)<0?45:43;g=u-t|0;if((g|0)>(2147483647-n|0)){break b}}d=g+n|0;if((d|0)>(s^2147483647)){break b}f=d+s|0;va(a,32,c,f,e);ua(a,v,s);va(a,48,c,f,e^65536);o:{p:{q:{if((o|0)==70){g=l+16|0;d=g|8;k=g|9;i=j>>>0>p>>>0?p:j;j=i;while(1){g=Qa(J[j>>2],0,k);r:{if((i|0)!=(j|0)){if(l+16>>>0>=g>>>0){break r}while(1){g=g-1|0;H[g|0]=48;if(l+16>>>0<g>>>0){continue}break}break r}if((g|0)!=(k|0)){break r}H[l+24|0]=48;g=d}ua(a,g,k-g|0);j=j+4|0;if(p>>>0>=j>>>0){continue}break}if(r){ua(a,302969,1)}if((m|0)<=0|h>>>0<=j>>>0){break q}while(1){g=Qa(J[j>>2],0,k);if(g>>>0>l+16>>>0){while(1){g=g-1|0;H[g|0]=48;if(l+16>>>0<g>>>0){continue}break}}ua(a,g,(m|0)<9?m:9);g=m-9|0;j=j+4|0;if(h>>>0<=j>>>0){break p}d=(m|0)>9;m=g;if(d){continue}break}break p}s:{if((m|0)<0){break s}i=h>>>0>j>>>0?h:j+4|0;g=l+16|0;d=g|8;p=g|9;h=j;while(1){g=Qa(J[h>>2],0,p);if((p|0)==(g|0)){H[l+24|0]=48;g=d}t:{if((h|0)!=(j|0)){if(l+16>>>0>=g>>>0){break t}while(1){g=g-1|0;H[g|0]=48;if(l+16>>>0<g>>>0){continue}break}break t}ua(a,g,1);g=g+1|0;if(!(k|m)){break t}ua(a,302969,1)}w=g;g=p-g|0;ua(a,w,(g|0)>(m|0)?m:g);m=m-g|0;h=h+4|0;if(i>>>0<=h>>>0){break s}if((m|0)>=0){continue}break}}va(a,48,m+18|0,18,0);ua(a,t,u-t|0);break o}g=m}va(a,48,g+9|0,9,0)}va(a,32,c,f,e^8192);i=(c|0)<(f|0)?f:c;break b}m=(f<<26>>31&9)+v|0;u:{if(d>>>0>11){break u}g=12-d|0;q=16;while(1){q=q*16;g=g-1|0;if(g){continue}break}if(K[m|0]==45){b=-(q+(-b-q));break u}b=b+q-q}k=s|2;j=f&32;h=J[l+44>>2];g=h>>31;g=Qa((g^h)-g|0,0,u);if((u|0)==(g|0)){H[l+15|0]=48;g=l+15|0}p=g-2|0;H[p|0]=f+15;H[g-1|0]=(h|0)<0?45:43;i=e&8;h=l+16|0;while(1){f=h;if(R(b)<2147483648){g=~~b}else{g=-2147483648}H[h|0]=j|K[g+303456|0];b=(b-+(g|0))*16;h=f+1|0;if(!(!(i|(d|0)>0)&b==0|(h-(l+16|0)|0)!=1)){H[f+1|0]=46;h=f+2|0}if(b!=0){continue}break}i=-1;n=u-p|0;f=n+k|0;if((2147483645-f|0)<(d|0)){break b}v:{w:{if(!d){break w}j=h-(l+16|0)|0;if((j-2|0)>=(d|0)){break w}g=d+2|0;break v}j=h-(l+16|0)|0;g=j}d=g+f|0;va(a,32,c,d,e);ua(a,m,k);va(a,48,c,d,e^65536);ua(a,l+16|0,j);va(a,48,g-j|0,0,0);ua(a,p,n);va(a,32,c,d,e^8192);i=(c|0)<(d|0)?d:c}da=l+560|0;return i|0}function Tc(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,x=0,y=0,z=0;j=da-80|0;da=j;J[j+76>>2]=b;x=j+55|0;t=j+56|0;b=0;a:{b:{c:{d:{e:while(1){if((2147483647-o|0)<(b|0)){break d}o=b+o|0;f:{g:{h:{k=J[j+76>>2];b=k;h=K[b|0];if(h){while(1){i:{h=h&255;j:{if(!h){h=b;break j}if((h|0)!=37){break i}h=b;while(1){if(K[b+1|0]!=37){break j}i=b+2|0;J[j+76>>2]=i;h=h+1|0;l=K[b+2|0];b=i;if((l|0)==37){continue}break}}b=h-k|0;w=2147483647-o|0;if((b|0)>(w|0)){break d}if(a){ua(a,k,b)}if((h|0)!=(k|0)){continue e}r=-1;h=1;b=J[j+76>>2];i=H[b+1|0];if(!(!kb(i)|K[b+2|0]!=36)){r=i-48|0;v=1;h=3}b=h+b|0;J[j+76>>2]=b;p=0;m=H[b|0];i=m-32|0;k:{if(i>>>0>31){h=b;break k}h=b;i=1<<i;if(!(i&75913)){break k}while(1){h=b+1|0;J[j+76>>2]=h;p=i|p;m=H[b+1|0];i=m-32|0;if(i>>>0>=32){break k}b=h;i=1<<i;if(i&75913){continue}break}}l:{if((m|0)==42){b=H[h+1|0];m:{if(!(!kb(b)|K[h+2|0]!=36)){J[((b<<2)+e|0)-192>>2]=10;m=h+3|0;q=J[((H[h+1|0]<<3)+d|0)-384>>2];v=1;break m}if(v){break h}m=h+1|0;if(!a){J[j+76>>2]=m;v=0;q=0;break l}b=J[c>>2];J[c>>2]=b+4;q=J[b>>2];v=0}J[j+76>>2]=m;if((q|0)>=0){break l}q=0-q|0;p=p|8192;break l}q=Sc(j+76|0);if((q|0)<0){break d}m=J[j+76>>2]}b=0;l=-1;n:{if(K[m|0]!=46){i=m;s=0;break n}if(K[m+1|0]==42){h=H[m+2|0];o:{if(!(!kb(h)|K[m+3|0]!=36)){J[((h<<2)+e|0)-192>>2]=10;i=m+4|0;l=J[((H[m+2|0]<<3)+d|0)-384>>2];break o}if(v){break h}i=m+2|0;l=0;if(!a){break o}h=J[c>>2];J[c>>2]=h+4;l=J[h>>2]}J[j+76>>2]=i;s=(l^-1)>>>31|0;break n}J[j+76>>2]=m+1;l=Sc(j+76|0);i=J[j+76>>2];s=1}while(1){n=b;h=28;u=i;if(H[i|0]-123>>>0<4294967238){break c}i=u+1|0;J[j+76>>2]=i;b=K[(H[u|0]+P(n,58)|0)+302927|0];if(b-1>>>0<8){continue}break}p:{q:{if((b|0)!=27){if(!b){break c}if((r|0)>=0){J[(r<<2)+e>>2]=b;b=(r<<3)+d|0;h=J[b+4>>2];J[j+64>>2]=J[b>>2];J[j+68>>2]=h;break q}if(!a){break f}Rc(j- -64|0,b,c,g);break p}if((r|0)>=0){break c}}b=0;if(!a){continue e}}m=p&-65537;i=p&8192?m:p;p=0;r=302924;h=t;r:{s:{t:{u:{v:{w:{x:{y:{z:{A:{B:{C:{D:{E:{F:{G:{b=H[u|0];b=n?(b&15)==3?b&-33:b:b;switch(b-88|0){case 11:break r;case 9:case 13:case 14:case 15:break s;case 27:break x;case 12:case 17:break A;case 23:break B;case 0:case 32:break C;case 24:break D;case 22:break E;case 29:break F;case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:case 10:case 16:case 18:case 19:case 20:case 21:case 25:case 26:case 28:case 30:case 31:break g;default:break G}}H:{switch(b-65|0){case 0:case 4:case 5:case 6:break s;case 2:break v;case 1:case 3:break g;default:break H}}if((b|0)==83){break w}break g}n=J[j+64>>2];k=J[j+68>>2];r=302924;break z}b=0;I:{switch(n&255){case 0:J[J[j+64>>2]>>2]=o;continue e;case 1:J[J[j+64>>2]>>2]=o;continue e;case 2:h=J[j+64>>2];J[h>>2]=o;J[h+4>>2]=o>>31;continue e;case 3:I[J[j+64>>2]>>1]=o;continue e;case 4:H[J[j+64>>2]]=o;continue e;case 6:J[J[j+64>>2]>>2]=o;continue e;case 7:break I;default:continue e}}h=J[j+64>>2];J[h>>2]=o;J[h+4>>2]=o>>31;continue e}l=l>>>0>8?l:8;i=i|8;b=120}m=t;y=b&32;n=J[j+64>>2];k=J[j+68>>2];if(n|k){while(1){m=m-1|0;H[m|0]=y|K[(n&15)+303456|0];z=!k&n>>>0>15|(k|0)!=0;u=k;k=k>>>4|0;n=(u&15)<<28|n>>>4;if(z){continue}break}}k=m;if(!(i&8)|!(J[j+64>>2]|J[j+68>>2])){break y}r=(b>>>4|0)+302924|0;p=2;break y}b=t;n=J[j+64>>2];k=J[j+68>>2];if(n|k){while(1){b=b-1|0;H[b|0]=n&7|48;u=!k&n>>>0>7|(k|0)!=0;m=k;k=k>>>3|0;n=(m&7)<<29|n>>>3;if(u){continue}break}}k=b;if(!(i&8)){break y}b=t-k|0;l=(b|0)<(l|0)?l:b+1|0;break y}b=J[j+68>>2];k=b;n=J[j+64>>2];if((b|0)<0){k=0-(k+((n|0)!=0)|0)|0;n=0-n|0;J[j+64>>2]=n;J[j+68>>2]=k;p=1;r=302924;break z}if(i&2048){p=1;r=302925;break z}p=i&1;r=p?302926:302924}k=Qa(n,k,t)}if((l|0)<0?s:0){break d}i=s?i&-65537:i;m=J[j+64>>2];b=J[j+68>>2];if(!((m|b)!=0|l)){k=t;h=k;l=0;break g}b=!(b|m)+(t-k|0)|0;l=(b|0)<(l|0)?l:b;break g}n=0;s=l>>>0<2147483647?l:2147483647;h=s;i=(h|0)!=0;J:{K:{L:{M:{b=J[j+64>>2];k=b?b:302971;b=k;N:{if(!(b&3)|!h){break N}while(1){n=K[b|0];if(!n){break M}h=h-1|0;i=(h|0)!=0;b=b+1|0;if(!(b&3)){break N}if(h){continue}break}}if(!i){break K}O:{if(!K[b|0]|h>>>0<4){break O}while(1){i=J[b>>2];if((i^-1)&i-16843009&-2139062144){break O}b=b+4|0;h=h-4|0;if(h>>>0>3){continue}break}}if(!h){break K}i=0;break L}i=1}while(1){if(!i){n=K[b|0];i=1;continue}if(!n){break J}b=b+1|0;h=h-1|0;if(!h){break K}i=0;continue}}b=0}b=b?b-k|0:s;h=b+k|0;if((l|0)>=0){i=m;l=b;break g}i=m;l=b;if(K[h|0]){break d}break g}if(l){h=J[j+64>>2];break u}b=0;va(a,32,q,0,i);break t}J[j+12>>2]=0;J[j+8>>2]=J[j+64>>2];h=j+8|0;J[j+64>>2]=h;l=-1}b=0;P:{while(1){k=J[h>>2];if(!k){break P}k=Qc(j+4|0,k);m=(k|0)<0;if(!(m|k>>>0>l-b>>>0)){h=h+4|0;b=b+k|0;if(l>>>0>b>>>0){continue}break P}break}if(m){break b}}h=61;if((b|0)<0){break c}va(a,32,q,b,i);if(!b){b=0;break t}k=0;h=J[j+64>>2];while(1){l=J[h>>2];if(!l){break t}l=Qc(j+4|0,l);k=l+k|0;if(k>>>0>b>>>0){break t}ua(a,j+4|0,l);h=h+4|0;if(b>>>0>k>>>0){continue}break}}va(a,32,q,b,i^8192);b=(b|0)<(q|0)?q:b;continue e}if((l|0)<0?s:0){break d}h=61;b=ha[f|0](a,O[j+64>>3],q,l,i,b)|0;if((b|0)>=0){continue e}break c}H[j+55|0]=J[j+64>>2];l=1;k=x;i=m;break g}i=b+1|0;J[j+76>>2]=i;h=K[b+1|0];b=i;continue}}if(a){break a}if(!v){break f}b=1;while(1){a=J[(b<<2)+e>>2];if(a){Rc((b<<3)+d|0,a,c,g);o=1;b=b+1|0;if((b|0)!=10){continue}break a}break}o=1;if(b>>>0>=10){break a}h=0;while(1){if(h){break h}b=b+1|0;if((b|0)==10){break a}h=J[(b<<2)+e>>2];continue}}h=28;break c}m=h-k|0;n=(l|0)>(m|0)?l:m;if((n|0)>(2147483647-p|0)){break d}h=61;l=n+p|0;b=(l|0)<(q|0)?q:l;if((w|0)<(b|0)){break c}va(a,32,b,l,i);ua(a,r,p);va(a,48,b,l,i^65536);va(a,48,n,m,0);ua(a,k,m);va(a,32,b,l,i^8192);continue}break}o=0;break a}h=61}J[78206]=h}o=-1}da=j+80|0;return o}function ed(a,b){var c=0,d=0,e=Q(0),f=Q(0),g=0,h=0,i=Q(0),j=0,k=Q(0),l=Q(0),m=Q(0),n=0;c=da-464|0;da=c;J[c+460>>2]=b;J[c+448>>2]=0;J[c+452>>2]=0;J[c+440>>2]=0;J[c+444>>2]=0;J[c+432>>2]=0;J[c+436>>2]=0;a:{if(!(J[a+452>>2]!=1&J[a+448>>2]!=1)){b=c+460|0;d=c+152|0;ha[J[J[J[a+440>>2]+4>>2]+20>>2]](J[a+424>>2],b,a+432|0,J[a+400>>2],0,d);ha[J[J[J[a+440>>2]+4>>2]+20>>2]](J[a+428>>2],b,a+436|0,J[a+400>>2],0,d);b=Pd(J[a>>2],J[a+432>>2],J[a+436>>2],J[a+400>>2]);break a}b=Pd(J[a>>2],b,b,J[a+400>>2])}d=J[a>>2];g=J[d+208>>2];J[c+408>>2]=J[d+204>>2];J[c+412>>2]=g;g=J[d+224>>2];J[c+424>>2]=J[d+220>>2];J[c+428>>2]=g;g=J[d+216>>2];J[c+416>>2]=J[d+212>>2];J[c+420>>2]=g;N[c+136>>2]=N[c+408>>2];g=J[c+416>>2];J[c+140>>2]=J[c+412>>2];J[c+144>>2]=g;g=c+152|0;qa(g,d+228|0,J[d+516>>2]<<2);wd(J[a+112>>2],c+136|0);wd(J[a+384>>2],g);b:{if(!J[a+48>>2]){break b}nd(c+104|0,b);b=J[a+84>>2];J[c+96>>2]=J[a+80>>2];J[c+100>>2]=b;b=J[a+72>>2];d=J[a+76>>2];g=J[c+116>>2];J[c+80>>2]=J[c+112>>2];J[c+84>>2]=g;J[c+88>>2]=b;J[c+92>>2]=d;b=J[c+108>>2];J[c+72>>2]=J[c+104>>2];J[c+76>>2]=b;md(c+120|0,c+88|0,c+72|0);b=J[c+132>>2];J[a+80>>2]=J[c+128>>2];J[a+84>>2]=b;b=J[c+124>>2];J[a+72>>2]=J[c+120>>2];J[a+76>>2]=b;d=J[a+84>>2];b=c- -64|0;J[b>>2]=J[a+80>>2];J[b+4>>2]=d;b=J[a+76>>2];J[c+56>>2]=J[a+72>>2];J[c+60>>2]=b;b=a- -64|0;d=J[b+4>>2];J[c+48>>2]=J[b>>2];J[c+52>>2]=d;b=J[a+60>>2];J[c+40>>2]=J[a+56>>2];J[c+44>>2]=b;b=da-48|0;da=b;d=J[c+68>>2];J[b+24>>2]=J[c+64>>2];J[b+28>>2]=d;d=J[c+60>>2];J[b+16>>2]=J[c+56>>2];J[b+20>>2]=d;d=J[c+52>>2];J[b+8>>2]=J[c+48>>2];J[b+12>>2]=d;d=J[c+44>>2];J[b>>2]=J[c+40>>2];J[b+4>>2]=d;Tb(b+32|0,b+16|0,b);da=b+48|0;if(J[b+36>>2]>>>31|0){break b}h=da-304|0;da=h;vd(J[a+112>>2]);ud(J[a+112>>2],h+288|0,3);td(J[a+112>>2]);vd(J[a+384>>2]);b=h+32|0;ud(J[a+384>>2],b,J[a+388>>2]);td(J[a+384>>2]);N[a+88>>2]=N[h+288>>2];N[a+92>>2]=N[h+292>>2];N[a+96>>2]=N[h+296>>2];J[a+100>>2]=J[a+116>>2];d=J[a+124>>2];J[a+104>>2]=J[a+120>>2];J[a+108>>2]=d;qa(a+128|0,b,256);if(Rb(a,h+8|0)){c:{b=h+8|0;d=J[a+456>>2];if(!d){na(0,295712);break c}if(!b){na(0,295752);break c}e=N[b>>2];if(e>Q(0)){i=Q(e*N[d+12>>2]);f=e}e=N[b+4>>2];if(e>f){i=Q(e*N[d+16>>2]);f=e}e=N[b+8>>2];if(e>f){i=Q(e*N[d+20>>2]);f=e}e=N[b+12>>2];if(e>f){i=Q(e*N[d+24>>2]);f=e}e=f;f=N[b+16>>2];if(e<f){i=Q(f*N[d+28>>2])}d:{if(i<Q(0)){na(1,296002);f=Q(0);break d}f=Q(T(i,Q(1)))}if(J[d+52>>2]){f=Q(U(f<Q(1)?f:Q(1),Q(0)));g=J[d+36>>2];e=Q(N[d+44>>2]*Q(J[d+32>>2]));e:{if(e<Q(4294967296)&e>=Q(0)){b=~~e>>>0;break e}b=0}f:{g:{if((b|0)==1){N[g>>2]=f;e=f<Q(1)?f:Q(1);break g}Qb(g+4|0,g,(b<<2)-4|0);N[g>>2]=f;e=Q(.5);if(!b){break f}e=f<Q(1)?f:Q(1);j=1;while(1){i=N[g+(j<<2)>>2];e=e>i?i:e;f=f<i?i:f;j=j+1|0;if((b|0)!=(j|0)){continue}break}}e=Q(Q(e+f)*Q(.5))}f=e}if(J[d+76>>2]){k=N[d+60>>2];l=N[d+64>>2];m=Q(k+l);e=Q(U(f<Q(1)?f:Q(1),Q(0)));i=N[d+56>>2];f=Q(e-i);f=f<Q(0)?Q(-f):f;h:{if(f>N[d+68>>2]){k=Q(Q(Q(e*k)+Q(l*i))/m);break h}k=Q(Q(Q(e*l)+Q(k*i))/m);if(f<N[d+72>>2]){break h}k=Q(Q(e+i)*Q(.5))}f=k;N[d+56>>2]=f}b=0;j=0;e=Q(N[d>>2]*Q(1e4));i:{if(!(e>=Q(-1))|!(e<=Q(1))){break i}e=Q(N[d+44>>2]*Q(J[d+32>>2]));j:{if(e<Q(4294967296)&e>=Q(0)){g=~~e>>>0;break j}g=0}if(g){n=J[d+36>>2];while(1){e=Q(N[(j<<2)+n>>2]*Q(1e4));if(!(e>=Q(-1))|!(e<=Q(1))){break i}j=j+1|0;if((g|0)!=(j|0)){continue}break}}e=Q(N[d+56>>2]*Q(1e4));b=e>=Q(-1)&e<=Q(1)}if(b){Vb(d)}N[d>>2]=f;J[d+4>>2]=b}}da=h+304|0;b=J[a+84>>2];J[c+32>>2]=J[a+80>>2];J[c+36>>2]=b;b=J[a+76>>2];J[c+24>>2]=J[a+72>>2];J[c+28>>2]=b;b=J[a+68>>2];J[c+16>>2]=J[a+64>>2];J[c+20>>2]=b;b=J[a+60>>2];J[c+8>>2]=J[a+56>>2];J[c+12>>2]=b;Tb(c+120|0,c+24|0,c+8|0);b=J[c+132>>2];J[a+80>>2]=J[c+128>>2];J[a+84>>2]=b;b=J[c+124>>2];J[a+72>>2]=J[c+120>>2];J[a+76>>2]=b}b=0;g=J[a>>2];if(J[g+544>>2]){d=J[g+504>>2];h=J[d>>2];k:{if(!J[h+20>>2]|!J[h+24>>2]){break k}h=J[d+4>>2];if(!J[h+20>>2]|!J[h+24>>2]){break k}d=J[d+8>>2];if(!J[d+20>>2]){break k}b=J[d+24>>2]!=0}d=b&1}else{d=1}if(J[g+548>>2]){b=J[g+508>>2];g=J[b+24>>2]&1;h=J[b+60>>2];if((h|0)>0){j=J[b+56>>2];b=0;while(1){g=J[j+(b<<2)>>2]&g;b=b+1|0;if((h|0)!=(b|0)){continue}break}}d=d&g}J[a+16>>2]=d;if((d|0)==1){b=0;g=da-32|0;da=g;if(!J[a+20>>2]){d=g+8|0;Rb(a,d);l:{if(!Ha(N[d>>2],Q(0))){break l}if(!Ha(N[d+4>>2],Q(0))){break l}if(!Ha(N[d+8>>2],Q(0))){break l}if(!Ha(N[d+12>>2],Q(0))){break l}b=(Ha(N[d+16>>2],Q(0))|0)!=0}}da=g+32|0;J[a+16>>2]=J[a+16>>2]&b}fd(c+408|0,c+432|0);J[a+116>>2]=J[c+444>>2];J[a+120>>2]=J[c+448>>2];J[a+124>>2]=J[c+452>>2];da=c+464|0}function $c(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=0,t=0,u=0,v=0,w=0,y=0,A=0,B=0;o=da-16|0;da=o;t=(D(a),x(2));e=t&2147483647;a:{if(e>>>0<=1305022426){j=+a;c=j*.6366197723675814+6755399441055744+-6755399441055744;q=j+c*-1.5707963109016418+c*-1.5893254773528196e-8;O[b>>3]=q;d=q<-.7853981852531433;if(R(c)<2147483648){e=~~c}else{e=-2147483648}if(d){c=c+-1;O[b>>3]=j+c*-1.5707963109016418+c*-1.5893254773528196e-8;e=e-1|0;break a}if(!(q>.7853981852531433)){break a}c=c+1;O[b>>3]=j+c*-1.5707963109016418+c*-1.5893254773528196e-8;e=e+1|0;break a}if(e>>>0>=2139095040){O[b>>3]=Q(a-a);e=0;break a}d=e;e=(e>>>23|0)-150|0;O[o+8>>3]=(z(2,d-(e<<23)|0),E());u=o+8|0;g=da-560|0;da=g;d=(e-3|0)/24|0;r=(d|0)>0?d:0;h=e+P(r,-24)|0;l=J[74944];if((l|0)>=0){e=l+1|0;d=r;while(1){O[(g+320|0)+(f<<3)>>3]=(d|0)<0?0:+J[(d<<2)+299792>>2];d=d+1|0;f=f+1|0;if((e|0)!=(f|0)){continue}break}}m=h-24|0;e=0;s=(l|0)>0?l:0;while(1){d=0;c=0;while(1){c=O[(d<<3)+u>>3]*O[(g+320|0)+(e-d<<3)>>3]+c;d=d+1|0;if((d|0)!=1){continue}break}O[(e<<3)+g>>3]=c;d=(e|0)==(s|0);e=e+1|0;if(!d){continue}break}A=47-h|0;v=48-h|0;B=h-25|0;e=l;b:{while(1){c=O[(e<<3)+g>>3];d=0;f=e;k=(e|0)<=0;if(!k){while(1){n=(g+480|0)+(d<<2)|0;j=c*5.960464477539063e-8;c:{if(R(j)<2147483648){i=~~j;break c}i=-2147483648}j=+(i|0);c=j*-16777216+c;d:{if(R(c)<2147483648){i=~~c;break d}i=-2147483648}J[n>>2]=i;f=f-1|0;c=O[(f<<3)+g>>3]+j;d=d+1|0;if((d|0)!=(e|0)){continue}break}}c=lb(c,m);c=c+V(c*.125)*-8;e:{if(R(c)<2147483648){n=~~c;break e}n=-2147483648}c=c-+(n|0);f:{g:{h:{w=(m|0)<=0;i:{if(!w){f=(e<<2)+g|0;i=J[f+476>>2];d=i>>v;p=f;f=i-(d<<v)|0;J[p+476>>2]=f;n=d+n|0;i=f>>A;break i}if(m){break h}i=J[((e<<2)+g|0)+476>>2]>>23}if((i|0)<=0){break f}break g}i=2;if(c>=.5){break g}i=0;break f}d=0;f=0;if(!k){while(1){p=(g+480|0)+(d<<2)|0;y=J[p>>2];k=16777215;j:{k:{if(f){break k}k=16777216;if(y){break k}f=0;break j}J[p>>2]=k-y;f=1}d=d+1|0;if((d|0)!=(e|0)){continue}break}}l:{if(w){break l}d=8388607;m:{switch(B|0){case 1:d=4194303;break;case 0:break m;default:break l}}k=(e<<2)+g|0;J[k+476>>2]=J[k+476>>2]&d}n=n+1|0;if((i|0)!=2){break f}c=1-c;i=2;if(!f){break f}c=c-lb(1,m)}if(c==0){d=1;k=0;f=e;n:{if((e|0)<=(l|0)){break n}while(1){f=f-1|0;k=J[(g+480|0)+(f<<2)>>2]|k;if((f|0)>(l|0)){continue}break}if(!k){break n}h=m;while(1){h=h-24|0;e=e-1|0;if(!J[(g+480|0)+(e<<2)>>2]){continue}break}break b}while(1){f=d;d=d+1|0;if(!J[(g+480|0)+(l-f<<2)>>2]){continue}break}f=e+f|0;while(1){e=e+1|0;O[(g+320|0)+(e<<3)>>3]=J[(e+r<<2)+299792>>2];d=0;c=0;while(1){c=O[(d<<3)+u>>3]*O[(g+320|0)+(e-d<<3)>>3]+c;d=d+1|0;if((d|0)!=1){continue}break}O[(e<<3)+g>>3]=c;if((e|0)<(f|0)){continue}break}e=f;continue}break}c=lb(c,24-h|0);o:{if(c>=16777216){m=(g+480|0)+(e<<2)|0;j=c*5.960464477539063e-8;p:{if(R(j)<2147483648){d=~~j;break p}d=-2147483648}c=+(d|0)*-16777216+c;q:{if(R(c)<2147483648){f=~~c;break q}f=-2147483648}J[m>>2]=f;e=e+1|0;break o}if(R(c)<2147483648){d=~~c}else{d=-2147483648}h=m}J[(g+480|0)+(e<<2)>>2]=d}c=lb(1,h);if((e|0)>=0){h=e;while(1){d=h;O[(d<<3)+g>>3]=c*+J[(g+480|0)+(d<<2)>>2];h=d-1|0;c=c*5.960464477539063e-8;if(d){continue}break}h=0;f=e;while(1){m=h>>>0<s>>>0?h:s;d=0;c=0;while(1){c=O[(d<<3)+302560>>3]*O[(d+f<<3)+g>>3]+c;l=(d|0)!=(m|0);d=d+1|0;if(l){continue}break}O[(g+160|0)+(e-f<<3)>>3]=c;f=f-1|0;d=(e|0)!=(h|0);h=h+1|0;if(d){continue}break}}c=0;if((e|0)>=0){while(1){d=e;e=e-1|0;c=c+O[(g+160|0)+(d<<3)>>3];if(d){continue}break}}O[o>>3]=i?-c:c;da=g+560|0;e=n&7;c=O[o>>3];if((t|0)<0){O[b>>3]=-c;e=0-e|0;break a}O[b>>3]=c}da=o+16|0;return e}function Ia(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0;a:{if(!a){break a}d=a-8|0;b=J[a-4>>2];a=b&-8;f=d+a|0;b:{if(b&1){break b}if(!(b&3)){break a}b=J[d>>2];d=d-b|0;if(d>>>0<M[78211]){break a}a=a+b|0;if(J[78212]!=(d|0)){if(b>>>0<=255){e=J[d+8>>2];b=b>>>3|0;c=J[d+12>>2];if((c|0)==(e|0)){J[78207]=J[78207]&We(b);break b}J[e+12>>2]=c;J[c+8>>2]=e;break b}h=J[d+24>>2];b=J[d+12>>2];c:{if((d|0)!=(b|0)){c=J[d+8>>2];J[c+12>>2]=b;J[b+8>>2]=c;break c}d:{e=d+20|0;c=J[e>>2];if(c){break d}e=d+16|0;c=J[e>>2];if(c){break d}b=0;break c}while(1){g=e;b=c;e=b+20|0;c=J[e>>2];if(c){continue}e=b+16|0;c=J[b+16>>2];if(c){continue}break}J[g>>2]=0}if(!h){break b}e=J[d+28>>2];c=(e<<2)+313132|0;e:{if(J[c>>2]==(d|0)){J[c>>2]=b;if(b){break e}J[78208]=J[78208]&We(e);break b}J[h+(J[h+16>>2]==(d|0)?16:20)>>2]=b;if(!b){break b}}J[b+24>>2]=h;c=J[d+16>>2];if(c){J[b+16>>2]=c;J[c+24>>2]=b}c=J[d+20>>2];if(!c){break b}J[b+20>>2]=c;J[c+24>>2]=b;break b}b=J[f+4>>2];if((b&3)!=3){break b}J[78209]=a;J[f+4>>2]=b&-2;J[d+4>>2]=a|1;J[a+d>>2]=a;return}if(d>>>0>=f>>>0){break a}b=J[f+4>>2];if(!(b&1)){break a}f:{if(!(b&2)){if(J[78213]==(f|0)){J[78213]=d;a=J[78210]+a|0;J[78210]=a;J[d+4>>2]=a|1;if(J[78212]!=(d|0)){break a}J[78209]=0;J[78212]=0;return}if(J[78212]==(f|0)){J[78212]=d;a=J[78209]+a|0;J[78209]=a;J[d+4>>2]=a|1;J[a+d>>2]=a;return}a=(b&-8)+a|0;g:{if(b>>>0<=255){e=J[f+8>>2];b=b>>>3|0;c=J[f+12>>2];if((c|0)==(e|0)){J[78207]=J[78207]&We(b);break g}J[e+12>>2]=c;J[c+8>>2]=e;break g}h=J[f+24>>2];b=J[f+12>>2];h:{if((f|0)!=(b|0)){c=J[f+8>>2];J[c+12>>2]=b;J[b+8>>2]=c;break h}i:{e=f+20|0;c=J[e>>2];if(c){break i}e=f+16|0;c=J[e>>2];if(c){break i}b=0;break h}while(1){g=e;b=c;e=b+20|0;c=J[e>>2];if(c){continue}e=b+16|0;c=J[b+16>>2];if(c){continue}break}J[g>>2]=0}if(!h){break g}e=J[f+28>>2];c=(e<<2)+313132|0;j:{if(J[c>>2]==(f|0)){J[c>>2]=b;if(b){break j}J[78208]=J[78208]&We(e);break g}J[h+(J[h+16>>2]==(f|0)?16:20)>>2]=b;if(!b){break g}}J[b+24>>2]=h;c=J[f+16>>2];if(c){J[b+16>>2]=c;J[c+24>>2]=b}c=J[f+20>>2];if(!c){break g}J[b+20>>2]=c;J[c+24>>2]=b}J[d+4>>2]=a|1;J[a+d>>2]=a;if(J[78212]!=(d|0)){break f}J[78209]=a;return}J[f+4>>2]=b&-2;J[d+4>>2]=a|1;J[a+d>>2]=a}if(a>>>0<=255){a=a>>>3|0;b=(a<<3)+312868|0;c=J[78207];a=1<<a;k:{if(!(c&a)){J[78207]=a|c;a=b;break k}a=J[b+8>>2]}J[b+8>>2]=d;J[a+12>>2]=d;J[d+12>>2]=b;J[d+8>>2]=a;return}e=31;J[d+16>>2]=0;J[d+20>>2]=0;if(a>>>0<=16777215){b=a>>>8|0;g=b+1048320>>>16&8;b=b<<g;e=b+520192>>>16&4;b=b<<e;c=b+245760>>>16&2;b=(b<<c>>>15|0)-(c|(e|g))|0;e=(b<<1|a>>>b+21&1)+28|0}J[d+28>>2]=e;g=(e<<2)+313132|0;l:{m:{c=J[78208];b=1<<e;n:{if(!(c&b)){J[78208]=b|c;J[g>>2]=d;J[d+24>>2]=g;break n}e=a<<((e|0)==31?0:25-(e>>>1|0)|0);b=J[g>>2];while(1){c=b;if((J[b+4>>2]&-8)==(a|0)){break m}b=e>>>29|0;e=e<<1;g=c+(b&4)|0;b=J[g+16>>2];if(b){continue}break}J[g+16>>2]=d;J[d+24>>2]=c}J[d+12>>2]=d;J[d+8>>2]=d;break l}a=J[c+8>>2];J[a+12>>2]=d;J[c+8>>2]=d;J[d+24>>2]=0;J[d+12>>2]=c;J[d+8>>2]=a}a=J[78215]-1|0;J[78215]=a?a:-1}}function Jd(a){a=a|0;var b=Q(0),c=0,d=Q(0),e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=0,j=Q(0),k=Q(0),l=Q(0);c=da-32|0;da=c;i=J[a+288>>2];b=N[i+8>>2];b=b>=Q(10)?Q(10):b<=Q(0)?Q(0):b;e=N[i+12>>2];d=N[i+4>>2];a:{b:{c:{d:{e:{f:{g:{h:{i:{f=N[i>>2];j:{if(f<Q(4294967296)&f>=Q(0)){i=~~f>>>0;break j}i=0}switch(i|0){case 6:break c;case 5:break d;case 4:break e;case 3:break f;case 2:break g;case 1:break h;case 0:break i;default:break a}}g=d;d=N[a+280>>2];d=Q(Q(Oa(g,Q(Q(d*Q(.5))+Q(-100)))*Q(6.2831854820251465))/d);e=Aa(d);f=Q(Q(1)-e);N[c+12>>2]=f;f=Q(f*Q(.5));N[c+16>>2]=f;N[c+8>>2]=f;b=b>Q(.0010000000474974513)?b:Q(.0010000000474974513);b=Q(Ja(d)/Q(b+b));N[c+28>>2]=Q(1)-b;N[c+24>>2]=e*Q(-2);N[c+20>>2]=b+Q(1);break b}g=d;d=N[a+280>>2];e=Q(Q(Oa(g,Q(Q(d*Q(.5))+Q(-100)))*Q(6.2831854820251465))/d);d=Aa(e);N[c+12>>2]=Q(-1)-d;f=Q(Q(d+Q(1))*Q(.5));N[c+16>>2]=f;N[c+8>>2]=f;b=b>Q(.0010000000474974513)?b:Q(.0010000000474974513);b=Q(Ja(e)/Q(b+b));N[c+28>>2]=Q(1)-b;N[c+24>>2]=d*Q(-2);N[c+20>>2]=b+Q(1);break b}e=N[a+280>>2];J[c+16>>2]=1065353216;J[c+8>>2]=1065353216;d=Q(Q(Oa(d,Q(Q(e*Q(.5))+Q(-100)))*Q(6.2831854820251465))/e);e=Q(Aa(d)*Q(-2));N[c+12>>2]=e;b=b>Q(.0010000000474974513)?b:Q(.0010000000474974513);b=Q(Ja(d)/Q(b+b));N[c+28>>2]=Q(1)-b;N[c+24>>2]=e;N[c+20>>2]=b+Q(1);break b}e=Q(Y(e>Q(152587890625e-16)?e:Q(152587890625e-16)));f=Q(e+Q(-1));j=Q(e+Q(1));g=d;d=N[a+280>>2];d=Q(Q(Oa(g,Q(Q(d*Q(.5))+Q(-100)))*Q(6.2831854820251465))/d);g=Aa(d);h=Q(j*g);N[c+12>>2]=Q(e+e)*Q(f-h);g=Q(f*g);k=Q(j-g);l=Q(Y(e));b=b>Q(.0010000000474974513)?b:Q(.0010000000474974513);b=Q(Q(l+l)*Q(Ja(d)/Q(b+b)));N[c+16>>2]=e*Q(k-b);N[c+8>>2]=e*Q(k+b);d=Q(g+j);N[c+28>>2]=d-b;N[c+24>>2]=Q(h+f)*Q(-2);N[c+20>>2]=d+b;break b}e=Q(Y(e>Q(152587890625e-16)?e:Q(152587890625e-16)));f=Q(e+Q(1));g=d;d=N[a+280>>2];g=Q(Q(Oa(g,Q(Q(d*Q(.5))+Q(-100)))*Q(6.2831854820251465))/d);h=Aa(g);d=Q(f*h);j=Q(e+Q(-1));N[c+12>>2]=Q(e*Q(-2))*Q(d+j);h=Q(j*h);k=Q(h+f);l=Q(Y(e));b=b>Q(.0010000000474974513)?b:Q(.0010000000474974513);b=Q(Q(l+l)*Q(Ja(g)/Q(b+b)));N[c+16>>2]=e*Q(k-b);N[c+8>>2]=e*Q(k+b);e=Q(f-h);N[c+28>>2]=e-b;d=Q(j-d);N[c+24>>2]=d+d;N[c+20>>2]=e+b;break b}g=d;d=N[a+280>>2];d=Q(Q(Oa(g,Q(Q(d*Q(.5))+Q(-100)))*Q(6.2831854820251465))/d);f=Q(Aa(d)*Q(-2));N[c+12>>2]=f;b=b>Q(.0010000000474974513)?b:Q(.0010000000474974513);b=Q(Ja(d)/Q(b+b));d=Q(Y(e>Q(152587890625e-16)?e:Q(152587890625e-16)));e=Q(b*d);N[c+16>>2]=Q(1)-e;N[c+8>>2]=e+Q(1);b=Q(b/d);N[c+28>>2]=Q(1)-b;N[c+24>>2]=f;N[c+20>>2]=b+Q(1);break b}e=N[a+280>>2];J[c+12>>2]=0;d=Q(Q(d*Q(6.2831854820251465))/e);b=Q(Ja(d)/Q(b+b));N[c+8>>2]=b;N[c+16>>2]=-b;N[c+28>>2]=Q(1)-b;N[c+24>>2]=Aa(d)*Q(-2);N[c+20>>2]=b+Q(1)}N[a+8>>2]=N[c+8>>2]/N[c+20>>2];N[a+12>>2]=N[c+12>>2]/N[c+20>>2];N[a+16>>2]=N[c+16>>2]/N[c+20>>2];N[a>>2]=N[c+24>>2]/N[c+20>>2];N[a+4>>2]=N[c+28>>2]/N[c+20>>2]}da=c+32|0}function oc(a,b,c){var d=0,e=Q(0),f=0,g=0,h=0,i=0,j=0,k=0,l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=0,q=0,r=Q(0),s=Q(0),t=0;g=da+-64|0;da=g;f=xb(a);a:{if((f|0)<0){c=0;oa(292928,-2);break a}if(!((c|0)>=(f|0)?b:0)){c=0;oa(292940,-2);break a}if(N[a+20>>2]>Q(N[a+16>>2]*Q(.5))){c=0;oa(292952,-2);break a}f=tc(J[a+4>>2]);j=g+48|0;ya(b,c,j);c=pa(j,68,4);J[c+8>>2]=0;J[c>>2]=b;e=N[a+16>>2];N[c+12>>2]=e;b=J[a+12>>2];J[c+20>>2]=f;J[c+16>>2]=b;J[c+24>>2]=J[a+4>>2];J[c+28>>2]=J[a+8>>2];J[c+32>>2]=rc(f,e,N[a+24>>2]);J[77914]=f>>>1;d=g+24|0;sc(a,d);b=zc(d);h=pa(j,b,8);i=da-16|0;da=i;ya(h,b,i);b=pa(i,60,8);h=ra(b+8|0,0,52);J[b+4>>2]=292870;J[b>>2]=303472;b:{c:{if(J[d>>2]!=1){break c}k=h;h=pa(i,8,1);J[k>>2]=h;if(h){break c}b=0;na(0,292879);break b}J[b+12>>2]=J[d+16>>2];h=J[d+8>>2];k=J[d+4>>2];d=pa(i,h+k|0,J[d+12>>2]);J[b+40>>2]=h;J[b+36>>2]=k;J[b+32>>2]=d;Cc(b)}da=i+16|0;J[c+4>>2]=b;J[c+36>>2]=pa(j,J[c+32>>2]<<4,4);h=f<<2;d=pa(j,h,4);J[c+40>>2]=d;d:{e:{switch(J[a+28>>2]){case 1:b=0;if(f){l=Q(f>>>0);while(1){e=Q(Q(b>>>0)/l);m=Aa(yb(Q(e*Q(6.2831854820251465))));n=Aa(yb(Q(e*Q(12.566370964050293))));N[d+(b<<2)>>2]=Q(Aa(yb(Q(e*Q(18.84955596923828))))*Q(-.011680000461637974))+Q(Q(n*Q(.14127999544143677))+Q(Q(m*Q(-.488290011882782))+Q(.35874998569488525)));b=b+1|0;if((f|0)!=(b|0)){continue}break}}break d;default:oa(292964,-2);c=0;break a;case 0:break e}}b=0;if(f){e=Q(f-1>>>0);while(1){l=Q(b>>>0);N[d+(b<<2)>>2]=Q(Aa(Q(Q(Q(l+l)*Q(3.1415927410125732))/e))*Q(-.46000000834465027))+Q(.5400000214576721);b=b+1|0;if((f|0)!=(b|0)){continue}break}}}b=g+48|0;d=J[a+12>>2];J[c+44>>2]=pa(b,P(d,12),4);k=pa(b,d<<2,4);J[c+48>>2]=k;f:{if(!d){break f}b=0;while(1){i=g+24|0;qc(i,f,N[a+16>>2],N[a+20>>2]);j=g+8|0;pc(j,i,b,d);d=b<<2;J[d+k>>2]=pa(g+48|0,db(N[g+8>>2],N[g+16>>2])<<2,4);k=J[d+J[c+48>>2]>>2];q=J[a+32>>2];m=N[j+4>>2];l=N[j>>2];r=Q(m-l);n=N[j+8>>2];s=Q(n-m);d=0;j=vb(l);t=db(l,n);q=(q|0)!=1;while(1){o=Q(0);e=Q(d+j>>>0);g:{h:{if(e<=l){break h}if(!(!(e>l)|!(e<m))){o=Q(Q(e-l)/r);break h}if(!(!(e>=m)|!(e<=n))){o=Q(Q(1)-Q(Q(e-m)/s));break h}if(!(e>n)){break g}}N[k+(d<<2)>>2]=o}if(!q){p=k+(d<<2)|0;o=N[p>>2];e=Va(Q(Q(Q(Q(N[i+12>>2]*e)*Q(.5))/N[i+4>>2])*Q(3.1415927410125732)));e=Q(e+e);N[p>>2]=o*Q(e*e)}p=(d|0)!=(t|0);d=d+1|0;if(p){continue}break}i=J[g+12>>2];d=J[c+44>>2]+P(b,12)|0;J[d>>2]=J[g+8>>2];J[d+4>>2]=i;J[d+8>>2]=J[g+16>>2];b=b+1|0;d=J[a+12>>2];if(b>>>0>=d>>>0){break f}k=J[c+48>>2];continue}}a=g+48|0;J[c+52>>2]=pa(a,h,4);J[c+56>>2]=pa(a,h>>>1|0,4);b=f<<3&1073741816;J[c+60>>2]=pa(a,b,16);J[c+64>>2]=pa(a,b,16)}da=g- -64|0;return c}function Ta(a,b,c,d,e){var f=0,g=0,h=0,i=Q(0),j=0,k=0,l=0,m=0,n=0,o=0,p=0,q=0,r=0,s=Q(0),t=0,u=0;if(!a){oa(293036,-2);return}if(J[a+16>>2]!=24){oa(293048,-2);return}if(!ub(a)){oa(293060,-2);return}g=J[a+20>>2];j=J[a+52>>2];f=da-16|0;da=f;h=J[a+4>>2];l=J[a+24>>2];k=l<<2;m=f+8|0;Wa(h,1,k,m);qa(ra(j,0,g<<2)+(g-l<<1&-4)|0,J[f+8>>2],k);Bc(h,m);da=f+16|0;g=J[a+40>>2];j=J[a+52>>2];f=0;h=J[a+20>>2];if(h){while(1){l=f<<2;k=l+j|0;N[k>>2]=N[g+l>>2]*N[k>>2];f=f+1|0;if((h|0)!=(f|0)){continue}break}}k=J[a+52>>2];j=J[a+60>>2];h=J[a+64>>2];m=J[a+56>>2];f=0;g=J[a+20>>2];a:{if(g){l=g>>>1|0;while(1){n=(j+(f<<3&-32)|0)+((f&3)<<2)|0;N[n>>2]=N[k+(f<<2)>>2];J[n+16>>2]=0;f=f+1|0;if((g|0)!=(f|0)){continue}break}Na(h,j,g,-1);if(g>>>0>=2){g=l>>>0>1?l:1;f=0;while(1){j=(h+(f<<3&-32)|0)+((f&3)<<2)|0;i=N[j>>2];s=Q(i*i);i=N[j+16>>2];N[m+(f<<2)>>2]=U(Q(s+Q(i*i)),Q(1.1754943508222875e-38));f=f+1|0;if((g|0)!=(f|0)){continue}break}}break a}Na(h,j,0,-1)}if((c|0)==1){o=J[a+56>>2];n=J[a+20>>2]>>>1|0;p=J[a+36>>2];c=da-16|0;da=c;g=J[a+32>>2];f=g-1|0;i=Q(Q(g>>>0)*Q(.5));b:{if(Q(R(i))<Q(2147483648)){j=~~i;break b}j=-2147483648}r=hc(j,f);J[c+8>>2]=0;J[c+12>>2]=0;J[c>>2]=-8388609;J[c+4>>2]=0;f=c;h=0-j|0;l=g-j|0;if((h|0)<(l|0)){q=n-1|0;while(1){m=f;f=p+(h+j<<4)|0;i=N[(hc(h,q)<<2)+o>>2];N[f>>2]=i;g=c;c:{while(1){k=g;if(i<N[g>>2]){tb(J[k+4>>2],f,m);break c}g=J[k+8>>2];if(g){continue}break}tb(k,f,m)}h=h+1|0;if((l|0)!=(h|0)){continue}break}}if(n){p=c+8|0;q=l+n|0;t=n-1|0;m=J[c+12>>2];k=l;while(1){g=0;i=N[(hc(k,t)<<2)+o>>2];h=p;j=c;n=c;if((r|0)>=0){while(1){n=J[h>>2];h=n+8|0;u=(g|0)!=(r|0);g=g+1|0;if(u){continue}break}}N[(k-l<<2)+o>>2]=N[n>>2];g=m;m=J[g+12>>2];h=J[g+8>>2];if(h){J[h+4>>2]=J[g+4>>2]}J[J[g+4>>2]+8>>2]=h;J[g+12>>2]=0;J[g+4>>2]=0;J[g+8>>2]=0;N[g>>2]=i;d:{while(1){h=j;if(i<N[h>>2]){tb(J[h+4>>2],g,f);break d}j=J[h+8>>2];if(j){continue}break}tb(h,g,f)}f=g;k=k+1|0;if((q|0)>(k|0)){continue}break}}da=c+16|0}c=J[77915];if(c){qa(c,J[a+56>>2],J[77914]<<2)}g=J[a+48>>2];j=J[a+56>>2];h=J[a+44>>2];c=0;l=J[a+16>>2];if(l){while(1){f=h+P(c,12)|0;i=N[f>>2];k=vb(i);m=db(i,N[f+8>>2]);e:{if(!m){i=Q(0);break e}n=J[g+(c<<2)>>2];i=Q(0);f=0;while(1){i=Q(Q(N[n+(f<<2)>>2]*N[j+(f+k<<2)>>2])+i);f=f+1|0;if((m|0)!=(f|0)){continue}break}}N[(c<<2)+b>>2]=i;c=c+1|0;if((l|0)!=(c|0)){continue}break}}if((e|0)==1){$d(b,J[a+16>>2])}if((d|0)==1){c=0;i=Q(0);a=J[a+16>>2];if(a){while(1){i=Q(i+N[(c<<2)+b>>2]);c=c+1|0;if((a|0)!=(c|0)){continue}break}i=Q(i/Q(a>>>0));c=0;while(1){d=(c<<2)+b|0;N[d>>2]=N[d>>2]-i;c=c+1|0;if((a|0)!=(c|0)){continue}break}}}}function Je(a,b,c,d,e,f){a=a|0;b=b|0;c=c|0;d=d|0;e=e|0;f=f|0;var g=0,h=0,i=Q(0),j=0,k=0,l=0,m=Q(0),n=Q(0),o=Q(0),p=0,q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=0,x=0,y=0,z=0,A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),I=0;a:{if(e){J[f>>2]=1;l=J[a+276>>2];if(l){h=a+20|0;e=0;while(1){j=h+(e<<4)|0;if(Q(R(N[j>>2]))>Q(30517578125e-15)|Q(R(N[j+4>>2]))>Q(30517578125e-15)|(Q(R(N[j+8>>2]))>Q(30517578125e-15)|Q(R(N[j+12>>2]))>Q(30517578125e-15))){break a}e=e+1|0;if((l|0)!=(e|0)){continue}break}}H[a+292|0]=1;return}if(K[a+292|0]!=1){break a}Hd(a);H[a+292|0]=0}J[f>>2]=0;l=J[a+276>>2];if(K[a+293|0]==1){if(l){I=d&3;e=0;while(1){l=e<<2;h=J[l+c>>2];g=J[b+l>>2];b:{if(!(g&15|(I|h&15))){k=0;if(d){while(1){w=J[g>>2];x=J[g+4>>2];y=J[g+8>>2];z=J[g+12>>2];j=J[g+16>>2];p=J[g+20>>2];l=J[g+28>>2];J[h+24>>2]=J[g+24>>2];J[h+28>>2]=l;J[h+16>>2]=j;J[h+20>>2]=p;J[h+8>>2]=y;J[h+12>>2]=z;J[h>>2]=w;J[h+4>>2]=x;w=J[g+32>>2];x=J[g+36>>2];y=J[g+56>>2];z=J[g+60>>2];j=J[g+48>>2];p=J[g+52>>2];l=J[g+44>>2];J[h+40>>2]=J[g+40>>2];J[h+44>>2]=l;J[h+48>>2]=j;J[h+52>>2]=p;J[h+56>>2]=y;J[h+60>>2]=z;J[h+32>>2]=w;J[h+36>>2]=x;g=g- -64|0;h=h- -64|0;k=k+16|0;if(k>>>0<d>>>0){continue}break}}break b}k=0;if(d){while(1){N[h>>2]=N[g>>2];h=h+4|0;g=g+4|0;k=k+1|0;if((k|0)!=(d|0)){continue}break}}}e=e+1|0;if(e>>>0<M[a+276>>2]){continue}break}}J[f>>2]=0;return}c:{if(!l){break c}f=a;h=a+20|0;if(l){s=N[f+12>>2];m=N[f>>2];r=N[f+8>>2];D=Q(s-Q(m*r));v=N[f+16>>2];E=Q(v-Q(m*s));e=d&-4;i=N[f+4>>2];F=Q(Q(m*m)-i);A=Q(-i);t=Q(-m);while(1){j=(p<<4)+h|0;o=N[j+8>>2];i=N[j+4>>2];q=N[j>>2];a=p<<2;g=J[a+c>>2];k=J[a+b>>2];n=N[j+12>>2];a=0;if(e){while(1){G=Q(v*q);m=N[k+12>>2];q=N[k+8>>2];o=Q(A*o);u=N[k+4>>2];B=N[k>>2];C=Q(Q(F*n)+Q(Q(t*Q(G+o))+Q(Q(E*i)+Q(Q(r*u)+Q(D*B)))));N[g+4>>2]=C;i=Q(o+Q(Q(t*n)+Q(G+Q(Q(r*B)+Q(s*i)))));N[g>>2]=i;n=Q(A*i);i=Q(v*B);o=Q(n+Q(Q(t*C)+Q(i+Q(Q(r*q)+Q(s*u)))));N[g+8>>2]=o;n=Q(Q(F*C)+Q(Q(t*Q(i+n))+Q(Q(E*u)+Q(Q(r*m)+Q(D*q)))));N[g+12>>2]=n;g=g+16|0;k=k+16|0;i=m;a=a+4|0;if(e>>>0>a>>>0){continue}break}a=e}if(a>>>0<d>>>0){while(1){m=Q(A*o);o=n;u=m;m=N[k>>2];n=Q(u+Q(Q(t*n)+Q(Q(v*q)+Q(Q(r*m)+Q(s*i)))));N[g>>2]=n;g=g+4|0;k=k+4|0;q=i;i=m;a=a+1|0;if((d|0)!=(a|0)){continue}break}}N[j>>2]=q;N[j+4>>2]=i;N[j+8>>2]=o;N[j+12>>2]=n;p=p+1|0;if((l|0)!=(p|0)){continue}break}}a=J[f+276>>2];if(!a){break c}e=0;while(1){b=(e<<4)+h|0;i=Q(R(N[b+12>>2]));if(Q(R(N[b+8>>2]))<Q(1.0000000195414814e-24)){J[b+8>>2]=0}if(i<Q(1.0000000195414814e-24)){J[b+12>>2]=0}e=e+1|0;if((a|0)!=(e|0)){continue}break}}}function qe(a,b){a=a|0;b=b|0;var c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;d=b;b=J[b>>2]+7&-8;J[d>>2]=b+16;o=a;a=b;k=J[a>>2];b=J[a+4>>2];e=J[a+12>>2];m=e;g=da-32|0;da=g;e=e&2147483647;c=e-1006698496|0;f=e-1140785152|0;d=J[a+8>>2];a:{if((c|0)==(f|0)&d>>>0<d>>>0|c>>>0<f>>>0){a=d;d=m<<4|a>>>28;c=a<<4|b>>>28;e=d;a=b&268435455;b=a;if((a|0)==134217728&(k|0)!=0|a>>>0>134217728){a=e+1073741824|0;b=c+1|0;a=b?a:a+1|0;c=b;break a}a=e+1073741824|0;if(b^134217728|k){break a}b=c&1;e=b+c|0;c=e;a=b>>>0>c>>>0?a+1|0:a;break a}if(!(!d&(e|0)==2147418112?!(b|k):e>>>0<2147418112)){a=d;d=m<<4|a>>>28;c=a<<4|b>>>28;a=d&524287|2146959360;break a}c=0;a=2146435072;if(e>>>0>1140785151){break a}a=0;n=e>>>16|0;if(n>>>0<15249){break a}c=k;a=b;f=m&65535|65536;e=f;l=d;h=d;j=n-15233|0;b:{if(j&64){f=c;d=j+-64|0;c=d&31;if((d&63)>>>0>=32){a=f<<c;h=0}else{a=(1<<c)-1&f>>>32-c|a<<c;h=f<<c}f=a;c=0;a=0;break b}if(!j){break b}d=j;i=d&31;if((d&63)>>>0>=32){d=h<<i;h=0}else{d=(1<<i)-1&h>>>32-i|f<<i;h=h<<i}f=d;p=h;h=c;d=64-j|0;i=d&31;if((d&63)>>>0>=32){d=0;h=a>>>i|0}else{d=a>>>i|0;h=((1<<i)-1&a)<<32-i|h>>>i}h=p|h;f=d|f;i=j&31;if((j&63)>>>0>=32){d=c<<i;c=0}else{d=(1<<i)-1&c>>>32-i|a<<i;c=c<<i}a=d}J[g+16>>2]=c;J[g+20>>2]=a;J[g+24>>2]=h;J[g+28>>2]=f;d=15361-n|0;c:{if(d&64){b=l;a=d+-64|0;f=a&31;if((a&63)>>>0>=32){d=0;k=e>>>f|0}else{d=e>>>f|0;k=((1<<f)-1&e)<<32-f|b>>>f}b=d;l=0;e=0;break c}if(!d){break c}f=l;a=64-d|0;c=a&31;if((a&63)>>>0>=32){a=f<<c;c=0}else{a=(1<<c)-1&f>>>32-c|e<<c;c=f<<c}f=a;h=c;c=k;a=d;j=a&31;if((a&63)>>>0>=32){d=0;b=b>>>j|0}else{d=b>>>j|0;b=((1<<j)-1&b)<<32-j|c>>>j}k=h|b;b=d|f;d=l;f=a&31;if((a&63)>>>0>=32){a=0;l=e>>>f|0}else{a=e>>>f|0;l=((1<<f)-1&e)<<32-f|d>>>f}e=a}J[g>>2]=k;J[g+4>>2]=b;J[g+8>>2]=l;J[g+12>>2]=e;b=J[g+8>>2];e=J[g+4>>2];c=b<<4|e>>>28;a=J[g+12>>2]<<4|b>>>28;e=e&268435455;b=J[g>>2]|(J[g+16>>2]|J[g+24>>2]|(J[g+20>>2]|J[g+28>>2]))!=0;if((e|0)==134217728&(b|0)!=0|e>>>0>134217728){b=c+1|0;a=b?a:a+1|0;c=b;break a}if(e^134217728|b){break a}b=c+(c&1)|0;a=b>>>0<c>>>0?a+1|0:a;c=b}da=g+32|0;z(0,c|0);z(1,m&-2147483648|a);O[o>>3]=B()}function xc(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=Q(0),m=Q(0),n=0,o=0,p=0,q=0,r=0,s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),H=Q(0),I=Q(0),K=Q(0),L=Q(0),M=Q(0),O=Q(0),P=Q(0),R=Q(0),S=Q(0),T=Q(0),U=Q(0),V=Q(0),W=Q(0),X=Q(0),Y=Q(0);r=c&-16;if(r){j=J[a+4>>2];k=J[a>>2];n=J[b+4>>2];o=J[b>>2];while(1){d=i<<2;p=d|48;g=p+n|0;l=N[g>>2];e=o+p|0;m=N[e>>2];s=N[g+4>>2];t=N[e+4>>2];u=N[g+8>>2];v=N[e+8>>2];w=N[g+12>>2];x=N[e+12>>2];g=d|32;e=g+n|0;y=N[e>>2];f=g+o|0;z=N[f>>2];A=N[e+4>>2];B=N[f+4>>2];C=N[e+8>>2];D=N[f+8>>2];E=N[e+12>>2];F=N[f+12>>2];e=d|16;f=e+n|0;G=N[f>>2];h=e+o|0;H=N[h>>2];I=N[f+4>>2];K=N[h+4>>2];L=N[f+8>>2];M=N[h+8>>2];O=N[f+12>>2];P=N[h+12>>2];f=d+n|0;R=N[f>>2];h=d+o|0;S=N[h>>2];T=N[f+4>>2];U=N[h+4>>2];V=N[f+8>>2];W=N[h+8>>2];q=d+k|0;X=N[h+12>>2];Y=N[f+12>>2];N[q+12>>2]=Q(X+Y)*Q(.5);N[q+8>>2]=Q(W+V)*Q(.5);N[q+4>>2]=Q(U+T)*Q(.5);N[q>>2]=Q(S+R)*Q(.5);d=d+j|0;N[d+12>>2]=Q(X-Y)*Q(.5);N[d+8>>2]=Q(W-V)*Q(.5);N[d+4>>2]=Q(U-T)*Q(.5);N[d>>2]=Q(S-R)*Q(.5);d=e+k|0;N[d+12>>2]=Q(P+O)*Q(.5);N[d+8>>2]=Q(M+L)*Q(.5);N[d+4>>2]=Q(K+I)*Q(.5);N[d>>2]=Q(H+G)*Q(.5);d=e+j|0;N[d+12>>2]=Q(P-O)*Q(.5);N[d+8>>2]=Q(M-L)*Q(.5);N[d+4>>2]=Q(K-I)*Q(.5);N[d>>2]=Q(H-G)*Q(.5);d=g+k|0;N[d+12>>2]=Q(F+E)*Q(.5);N[d+8>>2]=Q(D+C)*Q(.5);N[d+4>>2]=Q(B+A)*Q(.5);N[d>>2]=Q(z+y)*Q(.5);d=g+j|0;N[d+12>>2]=Q(F-E)*Q(.5);N[d+8>>2]=Q(D-C)*Q(.5);N[d+4>>2]=Q(B-A)*Q(.5);N[d>>2]=Q(z-y)*Q(.5);d=k+p|0;N[d+12>>2]=Q(x+w)*Q(.5);N[d+8>>2]=Q(v+u)*Q(.5);N[d+4>>2]=Q(t+s)*Q(.5);N[d>>2]=Q(m+l)*Q(.5);d=j+p|0;N[d+12>>2]=Q(x-w)*Q(.5);N[d+8>>2]=Q(v-u)*Q(.5);N[d+4>>2]=Q(t-s)*Q(.5);N[d>>2]=Q(m-l)*Q(.5);i=i+16|0;if(r>>>0>i>>>0){continue}break}}if(c>>>0>i>>>0){d=J[a+4>>2];j=J[a>>2];k=J[b+4>>2];b=J[b>>2];while(1){a=i<<2;l=N[a+b>>2];m=N[a+k>>2];N[a+j>>2]=Q(l+m)*Q(.5);N[a+d>>2]=Q(l-m)*Q(.5);i=i+1|0;if((i|0)!=(c|0)){continue}break}}}function Fc(a,b){var c=0,d=0,e=0,f=0,g=Q(0),h=0,i=0,j=0;f=ra(305680,0,160);while(1){e=P(d,160)+5408|0;g=N[(d<<2)+a>>2];c=0;while(1){h=c<<2;j=h+f|0;N[j>>2]=Q(N[e+h>>2]*g)+N[j>>2];c=c+1|0;if((c|0)!=40){continue}break}d=d+1|0;if((d|0)!=72){continue}break}c=0;while(1){a=c<<2;d=a+305680|0;N[d>>2]=N[a+16928>>2]+N[d>>2];c=c+1|0;if((c|0)!=40){continue}break}c=0;while(1){a=c<<2;N[a+305840>>2]=N[a+17088>>2]+Q(Q(N[a+17248>>2]*Q(N[a+305680>>2]-N[a+17408>>2]))/Q(Y(Q(N[a+17568>>2]+Q(9999999747378752e-20)))));c=c+1|0;if((c|0)!=40){continue}break}a=0;while(1){c=a<<2;N[c+306e3>>2]=U(N[c+305840>>2],Q(0));a=a+1|0;if((a|0)!=40){continue}break}c=0;d=ra(306160,0,80);while(1){f=P(c,80)+17728|0;g=N[(c<<2)+306e3>>2];a=0;while(1){e=a<<2;h=e+d|0;N[h>>2]=Q(N[f+e>>2]*g)+N[h>>2];a=a+1|0;if((a|0)!=20){continue}break}c=c+1|0;if((c|0)!=40){continue}break}a=0;while(1){c=a<<2;d=c+306160|0;N[d>>2]=N[c+20928>>2]+N[d>>2];a=a+1|0;if((a|0)!=20){continue}break}c=0;while(1){a=c<<2;N[a+306240>>2]=N[a+21008>>2]+Q(Q(N[a+21088>>2]*Q(N[a+306160>>2]-N[a+21168>>2]))/Q(Y(Q(N[a+21248>>2]+Q(9999999747378752e-20)))));c=c+1|0;if((c|0)!=20){continue}break}a=0;while(1){c=a<<2;N[c+306320>>2]=U(N[c+306240>>2],Q(0));a=a+1|0;if((a|0)!=20){continue}break}c=0;J[76602]=0;J[76603]=0;J[76600]=0;J[76601]=0;J[76604]=0;while(1){d=P(c,20)+21328|0;g=N[(c<<2)+306320>>2];a=0;while(1){f=a<<2;e=f+306400|0;N[e>>2]=Q(N[d+f>>2]*g)+N[e>>2];a=a+1|0;if((a|0)!=5){continue}break}c=c+1|0;if((c|0)!=20){continue}break}a=0;while(1){c=a<<2;d=c+306400|0;N[d>>2]=N[c+21728>>2]+N[d>>2];a=a+1|0;if((a|0)!=5){continue}break}a=0;while(1){i=i+$a(+N[(a<<2)+306400>>2]);a=a+1|0;if((a|0)!=5){continue}break}i=U(i,2.2250738585072014e-308);a=0;while(1){c=a<<2;N[c+b>>2]=$a(+N[c+306400>>2])/i;a=a+1|0;if((a|0)!=5){continue}break}}function Bd(a,b,c,d,e){var f=0,g=0,h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),H=Q(0),I=Q(0),J=Q(0),K=Q(0),L=Q(0),M=Q(0),O=Q(0),P=Q(0),R=Q(0),S=Q(0),T=Q(0),U=Q(0),V=Q(0),W=Q(0),X=Q(0),Y=Q(0),Z=Q(0),_=Q(0),$=Q(0);g=a&-16;if(g){while(1){n=N[d+36>>2];o=N[d+40>>2];p=N[d+44>>2];q=N[d+68>>2];r=N[d+72>>2];s=N[d+76>>2];t=N[d+100>>2];u=N[d+104>>2];v=N[c>>2];w=N[d>>2];x=N[e>>2];y=N[c+4>>2];z=N[d+4>>2];A=N[e+4>>2];B=N[c+8>>2];C=N[d+8>>2];D=N[e+8>>2];E=N[c+12>>2];F=N[d+12>>2];G=N[e+12>>2];H=N[c+16>>2];I=N[d+32>>2];J=N[e+16>>2];K=N[c+20>>2];L=N[e+20>>2];M=N[c+24>>2];O=N[e+24>>2];P=N[c+28>>2];R=N[e+28>>2];S=N[c+32>>2];T=N[d+64>>2];U=N[e+32>>2];V=N[c+36>>2];W=N[e+36>>2];X=N[c+40>>2];Y=N[e+40>>2];Z=N[c+44>>2];_=N[e+44>>2];$=N[c+48>>2];h=N[d+96>>2];i=N[e+48>>2];j=N[c+52>>2];k=N[e+52>>2];l=N[c+56>>2];m=N[e+56>>2];N[c+60>>2]=Q(N[d+108>>2]*Q(N[e+60>>2]*b))+N[c+60>>2];N[c+56>>2]=l+Q(u*Q(m*b));N[c+52>>2]=j+Q(t*Q(k*b));N[c+48>>2]=$+Q(h*Q(i*b));N[c+44>>2]=Z+Q(s*Q(_*b));N[c+40>>2]=X+Q(r*Q(Y*b));N[c+36>>2]=V+Q(q*Q(W*b));N[c+32>>2]=S+Q(T*Q(U*b));N[c+28>>2]=P+Q(p*Q(R*b));N[c+24>>2]=M+Q(o*Q(O*b));N[c+20>>2]=K+Q(n*Q(L*b));N[c+16>>2]=H+Q(I*Q(J*b));N[c+12>>2]=E+Q(F*Q(G*b));N[c+8>>2]=B+Q(C*Q(D*b));N[c+4>>2]=y+Q(z*Q(A*b));N[c>>2]=v+Q(w*Q(x*b));d=d+128|0;e=e- -64|0;c=c- -64|0;f=f+16|0;if(g>>>0>f>>>0){continue}break}f=g}if(a>>>0>f>>>0){while(1){h=N[d>>2];i=N[e>>2];j=N[d+4>>2];k=N[e+4>>2];l=N[d+8>>2];m=N[e+8>>2];N[c+12>>2]=Q(N[d+12>>2]*Q(N[e+12>>2]*b))+N[c+12>>2];N[c+8>>2]=Q(l*Q(m*b))+N[c+8>>2];N[c+4>>2]=Q(j*Q(k*b))+N[c+4>>2];N[c>>2]=Q(h*Q(i*b))+N[c>>2];d=d+32|0;e=e+16|0;c=c+16|0;f=f+4|0;if(f>>>0<a>>>0){continue}break}}}function yc(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=Q(0),m=Q(0),n=0,o=0,p=0,q=0,r=0,s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),H=Q(0),I=Q(0),K=Q(0),L=Q(0),M=Q(0),O=Q(0),P=Q(0),R=Q(0),S=Q(0),T=Q(0),U=Q(0),V=Q(0),W=Q(0),X=Q(0),Y=Q(0);r=c&-16;if(r){j=J[a+4>>2];k=J[a>>2];n=J[b+4>>2];o=J[b>>2];while(1){d=i<<2;p=d|48;g=p+n|0;l=N[g>>2];e=o+p|0;m=N[e>>2];s=N[g+4>>2];t=N[e+4>>2];u=N[g+8>>2];v=N[e+8>>2];w=N[g+12>>2];x=N[e+12>>2];g=d|32;e=g+n|0;y=N[e>>2];f=g+o|0;z=N[f>>2];A=N[e+4>>2];B=N[f+4>>2];C=N[e+8>>2];D=N[f+8>>2];E=N[e+12>>2];F=N[f+12>>2];e=d|16;f=e+n|0;G=N[f>>2];h=e+o|0;H=N[h>>2];I=N[f+4>>2];K=N[h+4>>2];L=N[f+8>>2];M=N[h+8>>2];O=N[f+12>>2];P=N[h+12>>2];f=d+n|0;R=N[f>>2];h=d+o|0;S=N[h>>2];T=N[f+4>>2];U=N[h+4>>2];V=N[f+8>>2];W=N[h+8>>2];q=d+k|0;X=N[h+12>>2];Y=N[f+12>>2];N[q+12>>2]=X+Y;N[q+8>>2]=W+V;N[q+4>>2]=U+T;N[q>>2]=S+R;d=d+j|0;N[d+12>>2]=X-Y;N[d+8>>2]=W-V;N[d+4>>2]=U-T;N[d>>2]=S-R;d=e+k|0;N[d+12>>2]=P+O;N[d+8>>2]=M+L;N[d+4>>2]=K+I;N[d>>2]=H+G;d=e+j|0;N[d+12>>2]=P-O;N[d+8>>2]=M-L;N[d+4>>2]=K-I;N[d>>2]=H-G;d=g+k|0;N[d+12>>2]=F+E;N[d+8>>2]=D+C;N[d+4>>2]=B+A;N[d>>2]=z+y;d=g+j|0;N[d+12>>2]=F-E;N[d+8>>2]=D-C;N[d+4>>2]=B-A;N[d>>2]=z-y;d=k+p|0;N[d+12>>2]=x+w;N[d+8>>2]=v+u;N[d+4>>2]=t+s;N[d>>2]=m+l;d=j+p|0;N[d+12>>2]=x-w;N[d+8>>2]=v-u;N[d+4>>2]=t-s;N[d>>2]=m-l;i=i+16|0;if(r>>>0>i>>>0){continue}break}}if(c>>>0>i>>>0){d=J[a+4>>2];j=J[a>>2];k=J[b+4>>2];b=J[b>>2];while(1){a=i<<2;l=N[a+b>>2];m=N[a+k>>2];N[a+j>>2]=l+m;N[a+d>>2]=l-m;i=i+1|0;if((i|0)!=(c|0)){continue}break}}}function ob(a,b){var c=0,d=0,e=Q(0),f=0,g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=0;c=da-48|0;da=c;g=N[b>>2];d=J[b>>2];h=N[b+4>>2];k=J[b+4>>2];i=N[b+12>>2];f=J[b+12>>2];j=N[b+8>>2];N[c+40>>2]=Q(j*Q(.15915493667125702))+(z(2,J[b+8>>2]&-2147483648|1056964608),E());N[c+44>>2]=Q(i*Q(.15915493667125702))+(z(2,f&-2147483648|1056964608),E());f=J[c+44>>2];J[c+8>>2]=J[c+40>>2];J[c+12>>2]=f;N[c+36>>2]=Q(h*Q(.15915493667125702))+(z(2,k&-2147483648|1056964608),E());N[c+32>>2]=Q(g*Q(.15915493667125702))+(z(2,d&-2147483648|1056964608),E());d=J[c+36>>2];J[c>>2]=J[c+32>>2];J[c+4>>2]=d;e=N[c+4>>2];a:{if(Q(R(e))<Q(2147483648)){d=~~e;break a}d=-2147483648}N[c+4>>2]=d|0;e=N[c>>2];b:{if(Q(R(e))<Q(2147483648)){d=~~e;break b}d=-2147483648}N[c>>2]=d|0;e=N[c+12>>2];c:{if(Q(R(e))<Q(2147483648)){d=~~e;break c}d=-2147483648}N[c+12>>2]=d|0;e=N[c+8>>2];d:{if(Q(R(e))<Q(2147483648)){d=~~e;break d}d=-2147483648}N[c+8>>2]=d|0;d=J[c+4>>2];J[c+16>>2]=J[c>>2];J[c+20>>2]=d;d=J[c+12>>2];J[c+24>>2]=J[c+8>>2];J[c+28>>2]=d;d=J[c+28>>2];J[c+40>>2]=J[c+24>>2];J[c+44>>2]=d;d=J[c+20>>2];J[c+32>>2]=J[c+16>>2];J[c+36>>2]=d;N[b>>2]=g-Q(N[c+32>>2]*Q(6.2831854820251465));N[b+4>>2]=h-Q(N[c+36>>2]*Q(6.2831854820251465));N[b+8>>2]=j-Q(N[c+40>>2]*Q(6.2831854820251465));N[b+12>>2]=i-Q(N[c+44>>2]*Q(6.2831854820251465));d=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=d;d=J[b+12>>2];J[a+8>>2]=J[b+8>>2];J[a+12>>2]=d;da=c+48|0}function za(a,b){var c=0,d=0,e=0,f=0,g=0,h=0,i=Q(0),j=0;f=(D(b),x(2));g=Xc(f);a:{b:{c:{c=(D(a),x(2));d:{if(c-2139095040>>>0>=2164260864){if(g){break d}break b}if(!g){break c}}i=Q(1);if((c|0)==1065353216){break a}d=f<<1;if(!d){break a}g=d>>>0<4278190081;d=c<<1;if(!(g&d>>>0<=4278190080)){return Q(a+b)}if((d|0)==2130706432){break a}return((f^-1)>>>31|0)==(d>>>0<2130706432|0)?Q(0):Q(b*b)}if(Xc(c)){i=Q(a*a);if((c|0)<0){i=(Wc(f)|0)==1?Q(-i):i}if((f|0)>=0){break a}return Yc(Q(Q(1)/i))}if((c|0)<0){d=Wc(f);if(!d){return bd(a)}c=c&2147483647;d=((d|0)==1)<<16}if(c>>>0>8388607){break b}c=((D(Q(a*Q(8388608))),x(2))&2147483647)-192937984|0}f=c-1060306944|0;g=f>>>15&240;e=+(z(2,c-(f&-8388608)|0),E())*O[g+302624>>3]+-1;h=e*e;e=((e*.288457581109214+-.36092606229713164)*(h*h)+((e*.480898481472577+-.7213474675006291)*h+(e*1.4426950408774342+(O[g+302632>>3]+ +(f>>23)))))*+b;C(+e);c=x(1)|0;x(0)|0;e:{c=c&2147450880;if((c|0)==1079967744|c>>>0<1079967744){break e}if(e>127.99999995700433){return dd(d)}if(!(e<=-150)){break e}return cd(d)}h=O[37418];j=h+e;e=e-(j-h);h=(O[37419]*e+O[37420])*(e*e)+(O[37421]*e+1);C(+j);x(1)|0;g=x(0)|0;f=d+g|0;d=f<<15;f=((g&31)<<3)+299088|0;g=J[f>>2];c=g;d=J[f+4>>2]+d|0;z(0,c|0);z(1,(c>>>0<c>>>0?d+1|0:d)|0);i=Q(h*+B())}return i}function Zd(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;if(!(J[76213]?a:0)){sa(4,2524,0);return}b=J[a+28>>2];a:{if(!b){oa(296643,-2);break a}f=J[b+460>>2];c=J[b+456>>2];if(c){b:{if(!c){na(0,295672);break b}if(J[c+8>>2]){J[c+8>>2]=0}J[c+36>>2]=0;J[c+40>>2]=0}J[b+456>>2]=0}c=J[b+36>>2];if(c){ha[J[J[J[b+32>>2]+4>>2]+12>>2]](c);J[b+40>>2]=0;J[b+44>>2]=0;J[b+32>>2]=0;J[b+36>>2]=0}c=J[b+424>>2];if(c){ha[J[J[J[b+440>>2]+4>>2]+12>>2]](c)}c=J[b+428>>2];if(c){ha[J[J[J[b+440>>2]+4>>2]+12>>2]](c)}J[b+424>>2]=0;J[b+428>>2]=0;J[b+440>>2]=0;J[b+444>>2]=0;J[b+432>>2]=0;J[b+436>>2]=0;if(J[b+28>>2]){J[b+28>>2]=0}c=J[b>>2];if(c){if(J[c+548>>2]){ec(J[c+496>>2]);d=J[c+508>>2];if(J[d+60>>2]>0){while(1){if(!J[J[d+8>>2]+(e<<2)>>2]){oa(5022,-2)}e=e+1|0;if((e|0)<J[d+60>>2]){continue}break}}}if(J[c+544>>2]){ec(J[c+488>>2]);if(!J[c+500>>2]){oa(293340,-2)}}if(!nc(J[c+520>>2])){na(0,293493)}if(!nc(J[c+524>>2])){na(0,293551)}ec(J[c+492>>2]);J[b>>2]=0}if(J[b+24>>2]){J[b+24>>2]=0}J[b+404>>2]=0;J[b+408>>2]=0;J[b+392>>2]=0;J[b+396>>2]=0;J[b+412>>2]=0;J[b+416>>2]=0;if(f){Zb(f)}}b=J[a+116>>2];c:{if(!b){break c}c=J[76215];if(c){ha[c|0](b);break c}Ia(b)}d:{e:{b=J[a+120>>2];if(b){c=J[76215];if(!c){break e}ha[c|0](b)}b=J[76215];if(!b){break d}ha[b|0](a);return}Ia(b)}Ia(a)}function Qe(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0,o=0;a:{b:{c:{d:{e:{f:{g:{h:{i:{j:{e=b;if(e){if(!c){break j}f=d;if(!f){break i}e=S(f)-S(e)|0;if(e>>>0<=31){break h}break b}if((d|0)==1|d>>>0>1){break b}b=(a>>>0)/(c>>>0)|0;ea=a-P(b,c)|0;fa=0;ga=0;return b}f=d;if(!a){break g}if(!f){break f}g=f-1|0;if(g&f){break f}ea=a;fa=e&g;a=e>>>Xe(f)|0;ga=0;return a}f=c-1|0;if(!(f&c)){break e}h=(S(c)+33|0)-S(e)|0;g=0-h|0;break c}h=e+1|0;g=63-e|0;break c}ea=0;a=(e>>>0)/(f>>>0)|0;fa=e-P(a,f)|0;ga=0;return a}e=S(f)-S(e)|0;if(e>>>0<31){break d}break b}ea=a&f;fa=0;if((c|0)==1){break a}d=a;c=Xe(c);a=c&31;if((c&63)>>>0>=32){e=0;a=b>>>a|0}else{e=b>>>a|0;a=((1<<a)-1&b)<<32-a|d>>>a}ga=e;return a}h=e+1|0;g=63-e|0}i=a;e=h&63;f=e&31;if((e&63)>>>0>=32){e=0;k=b>>>f|0}else{e=b>>>f|0;k=((1<<f)-1&b)<<32-f|i>>>f}f=e;e=g&63;a=e&31;if((e&63)>>>0>=32){e=i<<a;a=0}else{e=(1<<a)-1&i>>>32-a|b<<a;a=i<<a}b=e;if(h){e=d-1|0;g=c-1|0;e=(g|0)!=-1?e+1|0:e;i=e;while(1){j=k;e=f<<1|j>>>31;f=j<<1;j=e;f=b>>>31|f;e=i-((f>>>0>g>>>0)+e|0)>>31;l=e;m=c&e;k=f-m|0;f=j-((d&e)+(f>>>0<m>>>0)|0)|0;e=b<<1|a>>>31;a=n|a<<1;b=e|o;j=0;l=l&1;n=l;h=h-1|0;if(h){continue}break}}ea=k;fa=f;e=b<<1|a>>>31;a=l|a<<1;ga=e|j;return a}ea=a;fa=b;a=0;b=0}ga=b;return a}function Dd(a,b,c,d){var e=0,f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0),y=Q(0),z=Q(0),A=Q(0),B=Q(0),C=Q(0),D=Q(0),E=Q(0),F=Q(0),G=Q(0),H=Q(0),I=Q(0),K=Q(0),L=Q(0);if(a){while(1){f=N[d+48>>2];g=N[c+48>>2];h=N[d+52>>2];i=N[c+52>>2];j=N[d+56>>2];k=N[c+56>>2];l=N[d+60>>2];m=N[c+60>>2];n=N[d+32>>2];o=N[c+32>>2];p=N[d+36>>2];q=N[c+36>>2];r=N[d+40>>2];s=N[c+40>>2];t=N[d+44>>2];u=N[c+44>>2];v=N[d+16>>2];w=N[c+16>>2];x=N[d+20>>2];y=N[c+20>>2];z=N[d+24>>2];A=N[c+24>>2];B=N[d+28>>2];C=N[c+28>>2];D=N[d>>2];E=N[c>>2];F=N[d+4>>2];G=N[c+4>>2];H=N[d+8>>2];I=N[c+8>>2];K=N[d+12>>2];L=N[c+12>>2];J[b+16>>2]=0;J[b+20>>2]=0;J[b+24>>2]=0;J[b+28>>2]=0;J[b+48>>2]=0;J[b+52>>2]=0;J[b+56>>2]=0;J[b+60>>2]=0;J[b+80>>2]=0;J[b+84>>2]=0;J[b+88>>2]=0;J[b+92>>2]=0;N[b+12>>2]=L*K;N[b+8>>2]=I*H;N[b+4>>2]=G*F;N[b>>2]=E*D;N[b+44>>2]=C*B;N[b+40>>2]=A*z;N[b+36>>2]=y*x;N[b+32>>2]=w*v;N[b+76>>2]=u*t;N[b+72>>2]=s*r;N[b+68>>2]=q*p;N[b+64>>2]=o*n;N[b+108>>2]=m*l;N[b+104>>2]=k*j;N[b+100>>2]=i*h;N[b+96>>2]=g*f;J[b+120>>2]=0;J[b+124>>2]=0;J[b+112>>2]=0;J[b+116>>2]=0;b=b+128|0;d=d- -64|0;c=c- -64|0;e=e+16|0;if(e>>>0<a>>>0){continue}break}}}function Cd(a,b,c,d,e,f){var g=Q(0),h=0,i=0,j=0,k=0,l=0,m=Q(0),n=Q(0),o=Q(0),p=0,q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=Q(0),x=Q(0);i=a<<2;e=ra(e,0,i);f=ra(f,0,i);g=Q(Q(a>>>0)/b);a:{if(g<Q(4294967296)&g>=Q(0)){i=~~g>>>0;break a}i=0}g=Q(.5);i=a>>>0>i>>>0?i:a;p=i&-4;if(p){q=Q(b*Q(0));r=Q(b*Q(3));s=Q(b*Q(4));while(1){a=j<<2;h=a|12;t=N[h+d>>2];k=a|8;u=N[k+d>>2];l=a|4;v=N[l+d>>2];w=N[a+d>>2];x=N[c+h>>2];n=N[c+k>>2];o=N[c+l>>2];m=Q(q+g);b:{if(Q(R(m))<Q(2147483648)){h=~~m;break b}h=-2147483648}h=h<<2;N[h+e>>2]=N[a+c>>2];m=Q(g+b);c:{if(Q(R(m))<Q(2147483648)){a=~~m;break c}a=-2147483648}k=a<<2;N[k+e>>2]=o;o=Q(Q(b+b)+g);d:{if(Q(R(o))<Q(2147483648)){a=~~o;break d}a=-2147483648}l=a<<2;N[l+e>>2]=n;n=Q(r+g);e:{if(Q(R(n))<Q(2147483648)){a=~~n;break e}a=-2147483648}a=a<<2;N[a+e>>2]=x;N[f+h>>2]=w*b;N[f+k>>2]=v*b;N[f+l>>2]=u*b;N[a+f>>2]=t*b;g=Q(s+g);j=j+4|0;if(p>>>0>j>>>0){continue}break}}if(i>>>0>j>>>0){while(1){if(Q(R(g))<Q(2147483648)){a=~~g}else{a=-2147483648}a=a<<2;h=j<<2;N[a+e>>2]=N[h+c>>2];N[a+f>>2]=N[d+h>>2]*b;g=Q(g+b);j=j+1|0;if((i|0)!=(j|0)){continue}break}}}function gb(a,b){var c=Q(0),d=0,e=0,f=0,g=0;c=Q(a+b);a:{if(!(((D(a),x(2))&2147483647)>>>0<2139095041&((D(b),x(2))&2147483647)>>>0<=2139095040)){break a}d=(D(b),x(2));if((d|0)==1065353216){c=ad(a);break a}g=d>>>30&2;e=(D(a),x(2));f=g|e>>>31;b:{e=e&2147483647;c:{if(!e){d:{switch(f-2|0){case 0:c=Q(3.1415927410125732);break a;case 1:break d;default:break c}}c=Q(-3.1415927410125732);break a}d=d&2147483647;if((d|0)!=2139095040){c=(z(2,(D(a),x(2))&-2147483648|1070141403),E());if(!d){break a}c=(z(2,(D(a),x(2))&-2147483648|1070141403),E());if(!((e|0)!=2139095040&e>>>0<=d+218103808>>>0)){break a}e:{if(g){c=Q(0);if(d>>>0>e+218103808>>>0){break e}}c=ad(Q(R(Q(a/b))))}a=c;f:{switch(f|0){case 1:c=Q(-a);break a;case 2:c=Q(Q(3.1415927410125732)-Q(a+Q(8.742277657347586e-8)));break a;case 0:break c;default:break f}}c=Q(Q(a+Q(8.742277657347586e-8))+Q(-3.1415927410125732));break a}if((e|0)==2139095040){break b}a=N[(f<<2)+299720>>2]}c=a;break a}c=N[(f<<2)+299704>>2]}return c}function fb(a,b){var c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=0,j=Q(0);i=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=i;i=J[b+12>>2];J[a+8>>2]=J[b+8>>2];J[a+12>>2]=i;d=N[b+8>>2];g=N[b>>2];f=N[b+12>>2];c=N[b+4>>2];e=Q(c*c);h=e;c=Q(c*e);e=Q(e*c);j=Q(h*e);N[a+4>>2]=Q(Q(h*j)*Q(27557318844628753e-22))+Q(Q(Q(e*Q(.008333333767950535))+Q(N[a+4>>2]-Q(c*Q(.1666666716337204))))-Q(j*Q(.00019841270113829523)));c=Q(d*d);h=c;d=Q(d*c);c=Q(c*d);e=Q(h*c);N[a+8>>2]=Q(Q(h*e)*Q(27557318844628753e-22))+Q(Q(Q(c*Q(.008333333767950535))+Q(N[a+8>>2]-Q(d*Q(.1666666716337204))))-Q(e*Q(.00019841270113829523)));d=Q(f*f);e=d;d=Q(f*d);f=Q(e*d);c=Q(e*f);N[a+12>>2]=Q(Q(e*c)*Q(27557318844628753e-22))+Q(Q(Q(f*Q(.008333333767950535))+Q(N[a+12>>2]-Q(d*Q(.1666666716337204))))-Q(c*Q(.00019841270113829523)));d=Q(g*g);c=d;d=Q(g*d);g=Q(c*d);f=Q(c*g);N[a>>2]=Q(Q(c*f)*Q(27557318844628753e-22))+Q(Q(Q(g*Q(.008333333767950535))+Q(N[a>>2]-Q(d*Q(.1666666716337204))))-Q(f*Q(.00019841270113829523)))}function $a(a){var b=0,c=0,d=0,e=0,f=0,g=0,h=0,i=0,j=0;C(+a);e=x(1)|0;c=x(0)|0;a:{b:{d=e>>>20&2047;if(d-969>>>0<63){j=d;break b}if(d>>>0<=968){return a+1}if(d>>>0<1033){break b}b=0;if(!c&(e|0)==-1048576){break a}if((d|0)==2047){return a+1}if((e|0)<0){return _c(1.2882297539194267e-231)}return _c(3.105036184601418e231)}b=O[37117];f=O[37116]*a+b;b=f-b;b=b*O[37119]+(b*O[37118]+a);a=b*b;g=a*a*(b*O[37123]+O[37122]);a=a*(b*O[37121]+O[37120]);C(+f);x(1)|0;h=x(0)|0;c=h<<4&2032;b=g+(a+(O[c+297040>>3]+b));d=c+297048|0;c=h<<13;e=0;i=J[d>>2]+e|0;c=c+J[d+4>>2]|0;c=e>>>0>i>>>0?c+1|0:c;d=i;if(!j){c:{if(!(h&-2147483648)){z(0,d|0);z(1,c-1058013184|0);a=+B();a=(a*b+a)*5.486124068793689e303;break c}e=da-16|0;z(0,d|0);z(1,c+1071644672|0);g=+B();f=g*b;a=f+g;if(a<1){J[e+8>>2]=0;J[e+12>>2]=1048576;O[e+8>>3]=O[e+8>>3]*2.2250738585072014e-308;b=a+1;a=b+(f+(g-a)+(a+(1-b)))+-1;a=a==0?0:a}a=a*2.2250738585072014e-308}return a}z(0,d|0);z(1,c|0);a=+B();b=a*b+a}return b}function me(a){a=a|0;var b=0,c=0,d=0,e=0,f=0;c=da-16|0;da=c;J[c+8>>2]=4;J[c>>2]=5;J[c+4>>2]=0;e=da-272|0;da=e;J[e+12>>2]=c;d=e+16|0;Kb(d,256,3542,c);b=da-16|0;da=b;J[b>>2]=d;f=J[75730];d=da-16|0;da=d;J[d+12>>2]=b;Uc(f,1063,b,0,0);da=d+16|0;da=b+16|0;da=e+272|0;a:{if(J[76213]){sa(3,1099,0);a=1;break a}J[76213]=0;b:{if(!a){J[76214]=0;J[76215]=0;break b}b=J[a+4>>2];J[76214]=J[a>>2];J[76215]=b}ld();a=J[76351];c:{if(!(J[76352]|(!a|(a|0)==1))){na(1,3719);J[76351]=1;na(1,4271);break c}J[76351]=1}Nd(2,3);b=da-16|0;da=b;J[77938]=294352;J[b+12>>2]=16973824;a=J[b+12>>2];d:{if((a|0)!=16973824){mb(0,294448,16973824,a);a=0;break d}J[77939]=Md(0);J[77918]=293392;J[77916]=1106247680;J[77917]=1092616192;J[77923]=1;J[77921]=24;J[77922]=1174011904;J[77919]=1;J[77920]=1142292480;J[77928]=1;J[77926]=24;J[77927]=1174011904;J[77924]=0;J[77925]=0;Gc(311716);Gc(311728);J[77937]=1;J[77935]=1;J[77936]=1;H[311760]=1;a=1}da=b+16|0;J[76213]=a}da=c+16|0;return a|0}function Gd(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=Q(0),f=0,g=0,h=Q(0);a:{if(!a|!b){break a}if((cb(a)|0)>(c|0)){break a}g=J[a+20>>2];e=N[g+4>>2];b:{if(Q(R(e))<Q(2147483648)){c=~~e;break b}c=-2147483648}c=c?c:1024;if(c-1&c){break a}e=N[g+8>>2];d=b+15&-16;J[d+52>>2]=4;b=J[a>>2];f=J[a+4>>2];b=b>>>0>f>>>0?b:f;J[d+16>>2]=b;a=J[a+8>>2];J[d+28>>2]=c;J[d+20>>2]=a;if(Q(R(e))<Q(2147483648)){a=~~e}else{a=-2147483648}a=a?a:4;J[d+48>>2]=P(a,c);J[d+24>>2]=a;a=0;J[d+44>>2]=0;f=d+75&-16;b=f+P(b,28688)|0;J[d+4>>2]=b;J[d>>2]=f;h=Q(Q(3.1415927410125732)/Q(c>>>0));e=Q(0);while(1){N[b+(a<<2)>>2]=Ja(e);e=Q(h+e);a=a+1|0;if((c|0)!=(a|0)){continue}break}a=(b+(c<<2)|0)+15&-16;J[d+8>>2]=a;J[d+56>>2]=a+65536;J[a+65536>>2]=1065353216;J[a+65540>>2]=1065353216;e=N[g>>2];J[a+65548>>2]=1139126272;N[a+65544>>2]=e;Fd(d)}return d|0}function ad(a){var b=0,c=0,d=Q(0),e=Q(0),f=0,g=Q(0);f=(D(a),x(2));c=f&2147483647;if(c>>>0>=1283457024){return((D(a),x(2))&2147483647)>>>0>2139095040?a:(z(2,(D(a),x(2))&-2147483648|1070141402),E())}a:{b:{if(c>>>0<=1054867455){b=-1;if(c>>>0>=964689920){break b}break a}a=Q(R(a));if(c>>>0<=1066926079){if(c>>>0<=1060110335){a=Q(Q(Q(a+a)+Q(-1))/Q(a+Q(2)));b=0;break b}a=Q(Q(a+Q(-1))/Q(a+Q(1)));b=1;break b}if(c>>>0<=1075576831){a=Q(Q(a+Q(-1.5))/Q(Q(a*Q(1.5))+Q(1)));b=2;break b}a=Q(Q(-1)/a);b=3}e=Q(a*a);d=Q(e*e);g=Q(d*Q(Q(d*Q(-.106480173766613))+Q(-.19999158382415771)));d=Q(e*Q(Q(d*Q(Q(d*Q(.06168760731816292))+Q(.14253635704517365)))+Q(.333333283662796)));if(c>>>0<=1054867455){return Q(a-Q(a*Q(g+d)))}b=b<<2;a=Q(N[b+299744>>2]-Q(Q(Q(a*Q(g+d))-N[b+299760>>2])-a));a=(f|0)>=0?a:Q(-a)}return a}function Pb(a){var b=0,c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=0,h=Q(0),i=Q(0);b=(D(a),x(2));a:{b:{if((b|0)<=8388607){if(!(b&2147483647)){return Q(Q(-1)/Q(a*a))}if((b|0)<0){return Q(Q(a-a)/Q(0))}b=(D(Q(a*Q(33554432))),x(2));g=-152;break b}if(b>>>0>2139095039){break a}g=-127;a=Q(0);if((b|0)==1065353216){break a}}b=b+4913933|0;h=Q((b>>>23|0)+g|0);a=Q((z(2,(b&8388607)+1060439283|0),E())+Q(-1));c=Q(a*Q(a*Q(.5)));d=Q(a/Q(a+Q(2)));e=Q(d*d);f=Q(e*e);i=a;a=(z(2,(D(Q(a-c)),x(2))&-4096),E());c=Q(Q(d*Q(c+Q(Q(e*Q(Q(f*Q(.2849878668785095))+Q(.6666666269302368)))+Q(f*Q(Q(f*Q(.24279078841209412))+Q(.40000972151756287))))))+Q(Q(i-a)-c));a=Q(Q(h*Q(.3010292053222656))+Q(Q(a*Q(.434326171875))+Q(Q(c*Q(.434326171875))+Q(Q(h*Q(7.903415166765626e-7))+Q(Q(c+a)*Q(-3168997136526741e-20))))))}return a}function Aa(a){var b=Q(0),c=0,d=0,e=0,f=0;c=da-16|0;da=c;e=(D(a),x(2));d=e&2147483647;a:{if(d>>>0<=1061752794){b=Q(1);if(d>>>0<964689920){break a}b=Ca(+a);break a}if(d>>>0<=1081824209){f=+a;if(d>>>0>=1075235812){b=Q(-Ca(((e|0)>=0?-3.141592653589793:3.141592653589793)+f));break a}if((e|0)<0){b=Ba(f+1.5707963267948966);break a}b=Ba(1.5707963267948966-f);break a}if(d>>>0<=1088565717){if(d>>>0>=1085271520){b=Ca(((e|0)>=0?-6.283185307179586:6.283185307179586)+ +a);break a}if((e|0)<0){b=Ba(-4.71238898038469-+a);break a}b=Ba(+a+-4.71238898038469);break a}b=Q(a-a);if(d>>>0>=2139095040){break a}b:{switch($c(a,c+8|0)&3){case 0:b=Ca(O[c+8>>3]);break a;case 1:b=Ba(-O[c+8>>3]);break a;case 2:b=Q(-Ca(O[c+8>>3]));break a;default:break b}}b=Ba(O[c+8>>3])}a=b;da=c+16|0;return a}function Ja(a){var b=0,c=0,d=0,e=0;b=da-16|0;da=b;e=(D(a),x(2));c=e&2147483647;a:{if(c>>>0<=1061752794){if(c>>>0<964689920){break a}a=Ba(+a);break a}if(c>>>0<=1081824209){d=+a;if(c>>>0<=1075235811){if((e|0)<0){a=Q(-Ca(d+1.5707963267948966));break a}a=Ca(d+-1.5707963267948966);break a}a=Ba(-(((e|0)>=0?-3.141592653589793:3.141592653589793)+d));break a}if(c>>>0<=1088565717){d=+a;if(c>>>0<=1085271519){if((e|0)<0){a=Ca(d+4.71238898038469);break a}a=Q(-Ca(d+-4.71238898038469));break a}a=Ba(((e|0)>=0?-6.283185307179586:6.283185307179586)+d);break a}if(c>>>0>=2139095040){a=Q(a-a);break a}b:{switch($c(a,b+8|0)&3){case 0:a=Ba(O[b+8>>3]);break a;case 1:a=Ca(O[b+8>>3]);break a;case 2:a=Ba(-O[b+8>>3]);break a;default:break b}}a=Q(-Ca(O[b+8>>3]))}da=b+16|0;return a}function Rc(a,b,c,d){a:{switch(b-9|0){case 0:b=J[c>>2];J[c>>2]=b+4;J[a>>2]=J[b>>2];return;case 6:b=J[c>>2];J[c>>2]=b+4;b=I[b>>1];J[a>>2]=b;J[a+4>>2]=b>>31;return;case 7:b=J[c>>2];J[c>>2]=b+4;J[a>>2]=L[b>>1];J[a+4>>2]=0;return;case 8:b=J[c>>2];J[c>>2]=b+4;b=H[b|0];J[a>>2]=b;J[a+4>>2]=b>>31;return;case 9:b=J[c>>2];J[c>>2]=b+4;J[a>>2]=K[b|0];J[a+4>>2]=0;return;case 16:b=J[c>>2]+7&-8;J[c>>2]=b+8;O[a>>3]=O[b>>3];return;case 17:ha[d|0](a,c);default:return;case 1:case 4:case 14:b=J[c>>2];J[c>>2]=b+4;b=J[b>>2];J[a>>2]=b;J[a+4>>2]=b>>31;return;case 2:case 5:case 11:case 15:b=J[c>>2];J[c>>2]=b+4;J[a>>2]=J[b>>2];J[a+4>>2]=0;return;case 3:case 10:case 12:case 13:break a}}b=J[c>>2]+7&-8;J[c>>2]=b+8;c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c}function eb(a,b){var c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0),h=Q(0);f=N[b>>2];d=N[b+4>>2];e=N[b+8>>2];c=N[b+12>>2];c=Q(c*c);g=Q(c*c);h=Q(c*g);N[a+12>>2]=Q(Q(c*h)*Q(24801587642286904e-21))+Q(Q(Q(g*Q(.0416666679084301))+Q(Q(1)-Q(c*Q(.5))))-Q(h*Q(.0013888889225199819)));c=Q(e*e);e=Q(c*c);g=Q(c*e);N[a+8>>2]=Q(Q(c*g)*Q(24801587642286904e-21))+Q(Q(Q(e*Q(.0416666679084301))+Q(Q(1)-Q(c*Q(.5))))-Q(g*Q(.0013888889225199819)));c=Q(d*d);d=Q(c*c);e=Q(c*d);N[a+4>>2]=Q(Q(c*e)*Q(24801587642286904e-21))+Q(Q(Q(d*Q(.0416666679084301))+Q(Q(1)-Q(c*Q(.5))))-Q(e*Q(.0013888889225199819)));c=Q(f*f);f=Q(c*c);d=Q(c*f);N[a>>2]=Q(Q(c*d)*Q(24801587642286904e-21))+Q(Q(Q(f*Q(.0416666679084301))+Q(Q(1)-Q(c*Q(.5))))-Q(d*Q(.0013888889225199819)))}function ue(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0,i=0,j=0;e=da-32|0;da=e;f=J[a+28>>2];J[e+16>>2]=f;g=J[a+20>>2];J[e+28>>2]=c;J[e+24>>2]=b;b=g-f|0;J[e+20>>2]=b;f=b+c|0;g=2;b=e+16|0;a:{while(1){b:{c:{d=ba(J[a+60>>2],b|0,g|0,e+12|0)|0;if(d){J[78206]=d;d=-1}else{d=0}d:{if(!d){d=J[e+12>>2];if((d|0)==(f|0)){break d}if((d|0)>=0){break c}break b}if((f|0)!=-1){break b}}b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;J[a+16>>2]=b+J[a+48>>2];a=c;break a}h=J[b+4>>2];i=h>>>0<d>>>0;j=(i<<3)+b|0;h=d-(i?h:0)|0;J[j>>2]=h+J[j>>2];j=(i?12:4)+b|0;J[j>>2]=J[j>>2]-h;b=i?b+8|0:b;f=f-d|0;g=g-i|0;continue}break}J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;J[a>>2]=J[a>>2]|32;a=0;if((g|0)==2){break a}a=c-J[b+4>>2]|0}da=e+32|0;return a|0}function oa(a,b){var c=0,d=0,e=0;a:{b:{while(1){if(J[(c<<3)+4336>>2]==(b|0)){break b}c=c+1|0;if((c|0)!=7){continue}break}e=4400;break a}e=J[(c<<3)+4340>>2]}Wb(305424,256);if(_a(a)>>>0<256){b=255;c=305424;c:{d:{e:{if((a^305424)&3){break e}d=1;f:{if(!(a&3)){break f}while(1){d=K[a|0];H[c|0]=d;if(!d){break c}c=c+1|0;b=b-1|0;d=(b|0)!=0;a=a+1|0;if(!(a&3)){break f}if(b){continue}break}}if(!d){break d}if(!K[a|0]){break c}if(b>>>0<4){break e}while(1){d=J[a>>2];if((d^-1)&d-16843009&-2139062144){break e}J[c>>2]=d;c=c+4|0;a=a+4|0;b=b-4|0;if(b>>>0>3){continue}break}}if(!b){break d}while(1){d=K[a|0];H[c|0]=d;if(!d){break c}c=c+1|0;a=a+1|0;b=b-1|0;if(b){continue}break}}b=0}ra(c,0,b)}Ad(4328);Ad(e);mb(0,305424,0,0)}function zd(a,b){var c=Q(0),d=Q(0),e=Q(0),f=Q(0),g=Q(0),h=Q(0),i=Q(0),j=Q(0),k=Q(0),l=Q(0),m=Q(0),n=Q(0),o=Q(0),p=Q(0),q=Q(0),r=Q(0),s=Q(0),t=Q(0),u=Q(0),v=Q(0),w=0;if(a>>>0>=4){w=a>>>2|0;c=N[b+60>>2];d=N[b+56>>2];e=N[b+52>>2];f=N[b+48>>2];g=N[b+44>>2];h=N[b+40>>2];i=N[b+36>>2];j=N[b+32>>2];k=N[b+28>>2];l=N[b+24>>2];m=N[b+20>>2];n=N[b+16>>2];o=N[b+12>>2];p=N[b+8>>2];q=N[b+4>>2];r=N[b>>2];b=0;while(1){s=Q(Q(c*c)+Q(Q(g*g)+Q(Q(k*k)+Q(Q(o*o)+s))));t=Q(Q(d*d)+Q(Q(h*h)+Q(Q(l*l)+Q(Q(p*p)+t))));u=Q(Q(e*e)+Q(Q(i*i)+Q(Q(m*m)+Q(Q(q*q)+u))));v=Q(Q(f*f)+Q(Q(j*j)+Q(Q(n*n)+Q(Q(r*r)+v))));b=b+4|0;if(w>>>0>b>>>0){continue}break}c=Q(Q(Q(v+u)+t)+s)}else{c=Q(0)}return Q(c/Q(a>>>0))}function ma(a,b,c,d){var e=0,f=0,g=0,h=0,i=0;e=-1;i=J[a+12>>2];a:{if((i|0)==-1){oa(4902,-2);break a}if(!(!((b|0)<=0|(c|0)<=0)&(d|0)>0)){oa(4914,-2);break a}if(d-1&d){oa(4926,-2);break a}if(+(c|0)>0x8000000000000000/+(b|0)){oa(4938,-2);break a}g=Re(c,0,b,0);b=ga;if(!b&g>>>0>=2147483648|b){oa(4950,-2);break a}c=J[a+8>>2];f=J[a+4>>2];b:{if((f|0)<(d|0)){b=(((c+f|0)-1|0)%(f|0)^-1)+d|0;J[a+4>>2]=d;c=(g>>>0)%(d>>>0)|0;break b}b=(((c+d|0)-1|0)%(d|0)^-1)+d|0;e=c;h=b+c|0;c=(b>>31)+(c>>31)|0;c=e>>>0>h>>>0?c+1|0:c;e=h+((g|0)%(f|0)|0)|0;c=Te(e,e>>>0<h>>>0?c+1|0:c,f,f>>31)}J[a+8>>2]=c;e=-1;b=(b+g|0)+i|0;if((b|0)<0){oa(4962,-2);break a}J[a>>2]=d;e=b}J[a+12>>2]=e}function le(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;d=da-16|0;da=d;J[d+4>>2]=c;J[d>>2]=b;b=da-16|0;da=b;J[b+12>>2]=d;Kb(304880,2147483647,a,d);da=b+16|0;da=d+16|0;c=_a(304880);a=c;a:{if(J[75895]<0){b=Nb(304880,c,303504);break a}b=Nb(304880,c,303504)}if((a|0)!=(b|0)){a=b}b:{if((((a|0)!=(c|0)?-1:0)|0)<0){break b}c:{if(J[75896]==10){break c}a=J[75881];if((a|0)==J[75880]){break c}J[75881]=a+1;H[a|0]=10;break b}b=da-16|0;da=b;H[b+15|0]=10;a=J[75880];d:{if(!a){if(Ob(303504)){break d}a=J[75880]}c=a;a=J[75881];if(!((c|0)==(a|0)|J[75896]==10)){J[75881]=a+1;H[a|0]=10;break d}if((ha[J[75885]](303504,b+15|0,1)|0)!=1){break d}}da=b+16|0}}function ge(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;a:{e=J[c+4>>2];if(!e){break a}g=J[c>>2];if(!g){break a}b:{switch(b|0){case 1:d=J[a+40>>2];f=J[a+32>>2];b=g-f|0;c:{if(d>>>0<=b>>>0){d=b;break c}d=d-b|0;qa((b+J[a+36>>2]|0)+f|0,g,e>>>0<d>>>0?e:d);e=J[c+4>>2];g=J[c>>2];f=J[a+32>>2];d=g-f|0}h=e+d|0;d=J[a+36>>2];d:{if(h>>>0<=d>>>0){break d}if(b>>>0<d>>>0){b=h-d|0;b=b>>>0>e>>>0?e:b;qa(f,(h-b|0)+f|0,b);break d}qa((b-d|0)+f|0,g,e)}b=J[c+4>>2];J[a+16>>2]=b+J[a+16>>2];J[a+56>>2]=b+J[a+56>>2];return;case 0:J[a+20>>2]=J[a+20>>2]+e;J[a+48>>2]=J[a+48>>2]+e;return;default:break b}}J[c>>2]=0;J[c+4>>2]=0}}function qc(a,b,c,d){var e=0,f=0,g=0,h=0;N[a+4>>2]=d;J[a>>2]=b>>>1;N[a+12>>2]=c/Q(b>>>0);h=a;c=Q(Q(d/Q(700))+Q(1));a=(D(c),x(2));d=Q(0);a:{if((a|0)==1065353216){break a}b:{if(a-2139095040>>>0<=2164260863){b=a<<1;if(!b){a=da-16|0;N[a+12>>2]=-1;d=Q(N[a+12>>2]/Q(0));break a}if((a|0)==2139095040){break b}if(!(b>>>0<4278190080&(a|0)>=0)){d=bd(c);break a}a=(D(Q(c*Q(8388608))),x(2))-192937984|0}b=a-1060306944|0;f=b>>>15&240;e=+(z(2,a-(b&-8388608)|0),E())*O[f+299416>>3]+-1;g=e*e;c=Q((O[37460]*g+(O[37461]*e+O[37462]))*g+(+(b>>23)*O[37459]+O[f+299424>>3]+e))}d=c}N[h+8>>2]=d*Q(1127.010498046875)}function Ua(a){var b=0,c=0,d=0,e=0,f=0;d=da+-64|0;da=d;b=J[a+4>>2];a:{if(!(b>>>0>=4&b>>>0<=M[a>>2])){oa(292916,-2);a=-1;break a}b=tc(b);c=d+48|0;ta(c);ma(c,68,1,1);e=d+24|0;sc(a,e);ma(c,zc(e),1,8);ma(c,16,rc(b,N[a+16>>2],N[a+24>>2]),4);ma(c,4,b,4);ma(c,12,J[a+12>>2],4);ma(c,4,J[a+12>>2],4);e=J[a+12>>2];if(e){c=0;while(1){f=d+24|0;qc(f,b,N[a+16>>2],N[a+20>>2]);pc(d+8|0,f,c,e);ma(d+48|0,4,db(N[d+8>>2],N[d+16>>2]),4);c=c+1|0;e=J[a+12>>2];if(c>>>0<e>>>0){continue}break}}a=d+48|0;ma(a,4,b,4);ma(a,4,b>>>1|0,4);b=b>>>2|0;ma(a,32,b,128);ma(a,32,b,128);a=J[a+12>>2]}da=d- -64|0;return a}function Qd(a){var b=0,c=0;c=da-96|0;da=c;J[a+552>>2]=24;J[a+200>>2]=-8388609;_d(J[a+524>>2]);mc(J[a+524>>2]);b=a+104|0;Ta(J[a+524>>2],b,J[77932],J[77933],J[77934]);bc(J[a+492>>2]);Ga(J[a+492>>2],b);Ga(J[a+492>>2],b);sb(J[a+524>>2]);_d(J[a+520>>2]);mc(J[a+520>>2]);if(J[a+544>>2]){b=a+8|0;Ta(J[a+520>>2],b,J[77935],J[77936],J[77937]);bc(J[a+488>>2]);Ga(J[a+488>>2],b);Ga(J[a+488>>2],b);Yd(J[a+500>>2]);Ec(J[a+504>>2])}if(J[a+548>>2]){Ta(J[a+520>>2],c,J[77929],J[77930],J[77931]);bc(J[a+496>>2]);Ga(J[a+496>>2],c);Ga(J[a+496>>2],c);Jc(J[a+508>>2])}sb(J[a+520>>2]);da=c+96|0}function wb(a){var b=0,c=0,d=Q(0),e=0,f=0,g=0,h=0;a:{b:{a=Q(a/Q(1127.010498046875));b=Mb(a)&2047;if(b>>>0<Mb(Q(88))>>>0){break b}d=Q(0);if(((D(a),x(2))|0)==-8388608){break a}d=Q(a+a);if(Mb(Q($))>>>0<=b>>>0){break a}if(a>Q(88.72283172607422)){d=dd(0);break a}if(!(a<Q(-103.97207641601562))){break b}d=cd(0);break a}c=O[37423]*+a;f=O[37422];g=c+f;c=c-(g-f);c=(O[37424]*c+O[37425])*(c*c)+(O[37426]*c+1);C(+g);x(1)|0;b=x(0)|0;h=b<<15;b=((b&31)<<3)+299088|0;e=J[b>>2];b=J[b+4>>2]+h|0;z(0,e|0);z(1,(e>>>0<e>>>0?b+1|0:b)|0);d=Q(c*+B())}return Q(Q(d+Q(-1))*Q(700))}function Uc(a,b,c,d,e){var f=0,g=0,h=0;f=da-208|0;da=f;J[f+204>>2]=c;c=f+160|0;ra(c,0,40);J[f+200>>2]=J[f+204>>2];a:{if((Tc(0,b,f+200|0,f+80|0,c,d,e)|0)<0){break a}h=J[a+76>>2]>=0;c=J[a>>2];if(J[a+72>>2]<=0){J[a>>2]=c&-33}b:{c:{d:{if(!J[a+48>>2]){J[a+48>>2]=80;J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0;g=J[a+44>>2];J[a+44>>2]=f;break d}if(J[a+16>>2]){break c}}if(Ob(a)){break b}}Tc(a,b,f+200|0,f+80|0,f+160|0,d,e)}if(g){ha[J[a+36>>2]](a,0,0)|0;J[a+48>>2]=0;J[a+44>>2]=g;J[a+28>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0}J[a>>2]=J[a>>2]|c&32;if(!h){break a}}da=f+208|0}function ie(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;var e=0,f=0,g=0;a:{switch(b|0){case 0:e=J[a+20>>2];g=J[a+36>>2];f=J[a+24>>2];b=J[a+40>>2]+(g-f|0)|0;b=b>>>0>e>>>0?e:b;b=b>>>0<c>>>0?b:c;J[d+4>>2]=b;J[d>>2]=f+J[a+32>>2];J[a+20>>2]=e-b;J[a+24>>2]=(b+f>>>0)%(g>>>0);J[a+44>>2]=b+J[a+44>>2];return;case 1:e=J[a+16>>2];g=J[a+36>>2];f=J[a+28>>2];b=J[a+40>>2]+(g-f|0)|0;b=b>>>0>e>>>0?e:b;b=b>>>0<c>>>0?b:c;J[d+4>>2]=b;J[d>>2]=f+J[a+32>>2];J[a+16>>2]=e-b;J[a+28>>2]=(b+f>>>0)%(g>>>0);J[a+52>>2]=b+J[a+52>>2];return;default:break a}}J[d>>2]=0;J[d+4>>2]=0}function md(a,b,c){var d=0,e=0,f=0,g=0,h=0,i=0;d=da-80|0;da=d;e=J[b+12>>2];J[d+24>>2]=J[b+8>>2];J[d+28>>2]=e;e=J[b+4>>2];J[d+16>>2]=J[b>>2];J[d+20>>2]=e;Ub(d- -64|0,d+16|0);b=J[c+12>>2];J[d+8>>2]=J[c+8>>2];J[d+12>>2]=b;b=J[c+4>>2];J[d>>2]=J[c>>2];J[d+4>>2]=b;Ub(d+48|0,d);b=J[d+72>>2];c=J[d+76>>2];e=J[d+56>>2];g=J[d+60>>2];od(d+32|0,b,c,e,g);h=b;f=c;b=J[d+32>>2];c=J[d+36>>2];f=kd(h,f,b,c);i=ga;e=Re(J[d+48>>2],J[d+52>>2],kd(e,g,b,c),ga);g=ga;h=a;f=Re(f,i,J[d+64>>2],J[d+68>>2]);e=e+f|0;a=ga+g|0;pd(h,e,e>>>0<f>>>0?a+1|0:a,b,c);da=d+80|0}function Fd(a){a=a|0;var b=Q(0),c=0,d=Q(0),e=Q(0),f=0;b=wc(Q(2400));d=wc(Q(-2400));c=J[a+56>>2];e=N[c>>2];N[a+36>>2]=b<=e?b:d>=e?d:e;e=N[c+4>>2];N[a+40>>2]=b<=e?b:d>=e?d:e;b=N[c+8>>2];a:{if(Q(R(b))<Q(2147483648)){f=~~b;break a}f=-2147483648}J[a+12>>2]=f;d=Q(M[a+20>>2]);b=N[c+12>>2];b=Q(d/(b<=Q(0)?Q(459.375):b>Q(d*Q(.5))?Q(459.375):b));b:{if(Q(R(b))<Q(2147483648)){c=~~b;break b}c=-2147483648}J[a+32>>2]=c;f=a;a=J[a+28>>2]>>>1|0;c:{d:{if(a>>>0<=c>>>0){a=a-1|0;break d}if(c>>>0<11){break c}a=c-10|0}J[f+32>>2]=a}}function he(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0;a:{d=J[c+4>>2];if(!d){break a}e=J[c>>2];if(!e){break a}b:{switch(b|0){case 0:b=J[a+36>>2];c=((b+J[a+24>>2]|0)-d>>>0)%(b>>>0)|0;if((c|0)!=((e-J[a+32>>2]>>>0)%(b>>>0)|0)){break a}J[a+24>>2]=c;J[a+20>>2]=J[a+20>>2]+d;J[a+44>>2]=J[a+44>>2]-d;return;case 1:b=J[a+36>>2];c=((b+J[a+28>>2]|0)-d>>>0)%(b>>>0)|0;if((c|0)!=((e-J[a+32>>2]>>>0)%(b>>>0)|0)){break a}J[a+28>>2]=c;J[a+16>>2]=J[a+16>>2]+d;J[a+52>>2]=J[a+52>>2]-d;return;default:break b}}J[c>>2]=0;J[c+4>>2]=0}}function Xd(a,b){var c=0,d=0,e=0,f=0,g=0;c=da-32|0;da=c;a:{b:{if(!(!a|!b)){J[c+16>>2]=0;J[c+8>>2]=0;J[c+12>>2]=0;J[c>>2]=0;J[c+4>>2]=0;e=J[a+4>>2];if(e){g=J[a>>2];while(1){f=(J[g+(d<<2)>>2]<<2)+c|0;J[f>>2]=J[f>>2]+1;d=d+1|0;if((e|0)!=(d|0)){continue}break}}e=0;if(!J[a+12>>2]){a=5;d=0;break b}if(J[c+4>>2]){J[b>>2]=1;break a}a=5;d=0;if(!J[c+8>>2]){break b}J[b>>2]=2;break a}oa(293376,-2);break a}while(1){f=J[(d<<2)+c>>2];g=f>>>0>e>>>0;e=g?f:e;a=g?d:a;d=d+1|0;if((d|0)!=5){continue}break}J[b>>2]=a}da=c+32|0}function Wd(a,b){J[b>>2]=0;J[b+52>>2]=0;J[b+44>>2]=0;J[b+48>>2]=1045220557;J[b+36>>2]=1050253722;J[b+40>>2]=1058357117;J[b+28>>2]=1022739087;J[b+32>>2]=0;J[b+20>>2]=1036831949;J[b+24>>2]=1036831949;J[b+12>>2]=1051931443;J[b+16>>2]=1036831949;J[b+4>>2]=1034147594;J[b+8>>2]=1056964608;a:{switch(a|0){case 0:J[b+64>>2]=0;J[b+68>>2]=1036831949;J[b+56>>2]=1056964608;J[b+60>>2]=1036831949;return;case 1:J[b+64>>2]=1036831949;J[b+68>>2]=1036831949;J[b+56>>2]=0;J[b+60>>2]=1040522936;break;default:break a}}}function Ub(a,b){var c=0,d=0,e=0,f=0,g=0,h=0;e=da-32|0;da=e;c=J[b>>2];d=J[b+4>>2];a:{if(!(c|d)){c=J[b+4>>2];J[a>>2]=J[b>>2];J[a+4>>2]=c;c=J[b+12>>2];J[a+8>>2]=J[b+8>>2];J[a+12>>2]=c;break a}f=J[b+8>>2];b=J[b+12>>2];od(e+16|0,c,d,f,b);g=c;h=d;c=J[e+24>>2];d=J[e+28>>2];ab(e,Se(g,h,c,d),ga,Se(f,b,c,d),ga);d=J[e+4>>2];b=J[e>>2];f=b;b=J[e+8>>2];c=J[e+12>>2];g=(c|0)<0;J[a>>2]=g?0-f|0:f;J[a+4>>2]=g?0-(((f|0)!=0)+d|0)|0:d;d=b;b=c>>31;f=d^b;J[a+8>>2]=f-b;J[a+12>>2]=(c^b)-((b>>>0>f>>>0)+b|0)}da=e+32|0}function Ne(a){a=a|0;var b=0;if(!(J[76213]?a:0)){sa(4,2418,0);return}a=J[a+28>>2];a:{if(!a){oa(296870,-2);break a}Qd(J[a>>2]);J[a+420>>2]=0;gd(a,a+88|0);b=J[a+28>>2];if(b){Yb(b);ha[J[J[J[a+32>>2]+4>>2]+16>>2]](J[a+36>>2])}b=J[a+424>>2];if(b){ha[J[J[J[a+440>>2]+4>>2]+16>>2]](b)}b=J[a+428>>2];if(b){ha[J[J[J[a+440>>2]+4>>2]+16>>2]](b)}b=J[a+36>>2];if(b){ha[J[J[J[a+32>>2]+4>>2]+16>>2]](b)}a=J[a+456>>2];if(a){b:{if(!a){na(0,295816);break b}Vb(a)}}}}function od(a,b,c,d,e){var f=0,g=0,h=0,i=0,j=0,k=0,l=0;f=c>>31;g=f;h=f;i=c^f;f=b^f;g=i-(g+(g>>>0>f>>>0)|0)|0;i=f-h|0;f=e>>31;h=f^d;j=h-f|0;f=(e^f)-((f>>>0>h>>>0)+f|0)|0;h=(f|0)==(g|0)&i>>>0>j>>>0|f>>>0<g>>>0;k=h?i:j;l=h?g:f;h=i;i=(f|0)==(g|0)&i>>>0<j>>>0|f>>>0>g>>>0;h=i?h:j;g=i?g:f;f=Ve(k,l,h,g);i=ga;if(f|i){while(1){k=h;l=g;h=f;g=i;f=Te(k,l,f,g);i=ga;if(f|i){continue}break}}J[a+8>>2]=h;J[a+12>>2]=g;J[a>>2]=Se(Re(b,c,d,e),ga,h,g);J[a+4>>2]=ga}function Jc(a){var b=0,c=0,d=0,e=0;a:{if(J[a+60>>2]<=0){break a}c=J[a+56>>2];while(1){J[c+(b<<2)>>2]=1;b=b+1|0;d=J[a+60>>2];if((b|0)<(d|0)){continue}break}if((d|0)<=0){break a}b=0;while(1){Mc(J[J[a+8>>2]+(b<<2)>>2],ib(J[a+4>>2],b));b=b+1|0;c=J[a+60>>2];if((b|0)<(c|0)){continue}break}if((c|0)<=0){break a}d=J[a+48>>2];e=J[a+4>>2];b=0;while(1){N[d+(b<<2)>>2]=ib(e,b);b=b+1|0;if((c|0)!=(b|0)){continue}break}}J[a+24>>2]=1;J[a+32>>2]=0;J[a+36>>2]=0}function _b(a){var b=0,c=0,d=0,e=0,f=0,g=0;b=da-128|0;da=b;d=b+80|0;Vd(d,N[a>>2]);e=b+48|0;Ud(e,N[a>>2]);f=b+32|0;qb(f);g=b+24|0;Td(g);c=b+112|0;ta(c);ma(c,556,1,1);ma(c,Ua(d),1,4);ma(c,Ua(e),1,4);ma(c,Ma(f),1,4);ma(c,ac(g),1,4);if(J[a+4>>2]){c=b+112|0;ma(c,Db(),1,4);ma(c,Ma(b+32|0),1,4)}if(J[a+8>>2]){c=b+8|0;Sd(c,J[a+12>>2]);a=b+112|0;ma(a,Gb(c),1,4);ma(a,Ma(b+32|0),1,4)}da=b+128|0;return J[b+124>>2]}function Ga(a,b){var c=0,d=0,e=0,f=0,g=0;d=4;if(!(b?a:0)){oa(293196,-2);return}if(J[a+12>>2]!=4){oa(293208,-2);return}if(M[a+8>>2]>=J[a+16>>2]+24>>>0){c=J[a+20>>2];while(1){e=rb(d,f);g=J[a>>2];c=rb(d,c);e=b+e|0;qa(g+c|0,e,d);qa(c+J[a+4>>2]|0,e,J[a+12>>2]);c=Sa(J[a+8>>2],J[a+20>>2]+1|0);J[a+20>>2]=c;f=f+1|0;if((f|0)!=24){d=J[a+12>>2];continue}break}J[a+16>>2]=J[a+16>>2]+24;return}oa(293220,-2)}function Nb(a,b,c){var d=0,e=0,f=0;d=J[c+16>>2];a:{if(!d){if(Ob(c)){break a}d=J[c+16>>2]}f=J[c+20>>2];if(d-f>>>0<b>>>0){return ha[J[c+36>>2]](c,a,b)|0}b:{if(J[c+80>>2]<0){d=0;break b}e=b;while(1){d=e;if(!d){d=0;break b}e=d-1|0;if(K[e+a|0]!=10){continue}break}e=ha[J[c+36>>2]](c,a,d)|0;if(e>>>0<d>>>0){break a}a=a+d|0;b=b-d|0;f=J[c+20>>2]}qa(f,a,b);J[c+20>>2]=J[c+20>>2]+b;e=b+d|0}return e}function xd(a,b,c){var d=0,e=0,f=0,g=0;d=da-16|0;da=d;ya(b,c,d);c=pa(d,28,4);e=J[a>>2];J[c>>2]=e;f=J[a+4>>2];a=0;J[c+24>>2]=0;J[c+16>>2]=0;J[c+20>>2]=0;J[c+8>>2]=f;g=e<<2;b=pa(d,g,4);J[c+4>>2]=b;a:{if((e|0)<=0){break a}e=e-1|0;f=f<<2;while(1){J[(a<<2)+b>>2]=pa(d,f,4);if((a|0)==(e|0)){break a}a=a+1|0;b=J[c+4>>2];continue}}J[c+12>>2]=pa(d,g,4);da=d+16|0;return c}function Xb(a){var b=0,c=Q(0),d=Q(0),e=0,f=0;b=da-16|0;da=b;a:{b:{c:{if(!a){c=Q(.5);d=Q(100);break c}e=-1;f=J[a>>2];if((f|0)<0){na(0,294756);break a}c=N[a+4>>2];if(c<Q(0)){break b}d=Q(f|0)}ta(b);ma(b,80,1,1);c=Q(c*d);d:{if(Q(R(c))<Q(2147483648)){a=~~c;break d}a=-2147483648}ma(b,a<<2,1,4);ma(b,8,1,8);e=J[b+12>>2];break a}na(0,294856)}da=b+16|0;return e}function pe(a,b,c){a=a|0;b=b|0;c=c|0;var d=0,e=0,f=0,g=0,h=0;e=J[a+84>>2];f=J[e>>2];d=J[e+4>>2];h=J[a+28>>2];g=J[a+20>>2]-h|0;g=d>>>0<g>>>0?d:g;if(g){qa(f,h,g);f=g+J[e>>2]|0;J[e>>2]=f;d=J[e+4>>2]-g|0;J[e+4>>2]=d}d=c>>>0>d>>>0?d:c;if(d){qa(f,b,d);f=d+J[e>>2]|0;J[e>>2]=f;J[e+4>>2]=J[e+4>>2]-d}H[f|0]=0;b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;return c|0}function lb(a,b){a:{if((b|0)>=1024){a=a*8.98846567431158e307;if(b>>>0<2047){b=b-1023|0;break a}a=a*8.98846567431158e307;b=((b|0)<3069?b:3069)-2046|0;break a}if((b|0)>-1023){break a}a=a*2.004168360008973e-292;if(b>>>0>4294965304){b=b+969|0;break a}a=a*2.004168360008973e-292;b=((b|0)>-2960?b:-2960)+1938|0}z(0,0);z(1,b+1023<<20);return a*+B()}function Oc(a,b,c,d,e,f,g){var h=0,i=0,j=0,k=0,l=Q(0);g=ra(d,0,g);while(1){k=(h<<f)+a|0;l=N[(h<<2)+c>>2];d=0;while(1){i=d<<2;j=i+g|0;N[j>>2]=Q(N[k+i>>2]*l)+N[j>>2];d=d+1|0;if((e|0)!=(d|0)){continue}break}h=h+1|0;if((h|0)!=(e|0)){continue}break}d=0;while(1){a=d<<2;c=a+g|0;N[c>>2]=N[a+b>>2]+N[c>>2];d=d+1|0;if((e|0)!=(d|0)){continue}break}}function Gb(a){var b=0,c=0,d=0;c=da-32|0;da=c;b=Pa(J[a>>2]);d=c+16|0;ta(d);ma(d,72,1,1);ma(d,4,b,4);Kc(c+8|0,N[a+4>>2],N[a+8>>2]);if((b|0)>0){a=0;while(1){ma(c+16|0,Ib(c+8|0),b,4);a=a+1|0;if((b|0)!=(a|0)){continue}break}}a=c+16|0;ma(a,4,b,4);ma(a,4,b,4);ma(a,4,b,4);ma(a,4,b,4);ma(a,4,b,4);da=c+32|0;return J[a+12>>2]}function Tb(a,b,c){var d=0,e=0,f=0;d=da-32|0;da=d;e=J[c>>2];f=0-(J[c+4>>2]+((e|0)!=0)|0)|0;J[c>>2]=0-e;J[c+4>>2]=f;e=J[b+12>>2];J[d+24>>2]=J[b+8>>2];J[d+28>>2]=e;e=J[b+4>>2];J[d+16>>2]=J[b>>2];J[d+20>>2]=e;b=J[c+12>>2];J[d+8>>2]=J[c+8>>2];J[d+12>>2]=b;b=J[c+4>>2];J[d>>2]=J[c>>2];J[d+4>>2]=b;md(a,d+16|0,d);da=d+32|0}function wd(a,b){var c=0,d=0,e=0,f=0,g=0;e=J[a>>2];a:{if(!e){c=J[a+20>>2];break a}c=J[a+20>>2];g=J[a+4>>2];while(1){f=d<<2;N[J[f+g>>2]+(c<<2)>>2]=N[b+f>>2];d=d+1|0;if((e|0)!=(d|0)){continue}break}}b=J[a+8>>2];J[a+20>>2]=Sa(b,c+1|0);c=J[a+16>>2];if((c|0)==(b|0)){J[a+24>>2]=Sa(b,J[a+24>>2]+1|0);return}J[a+16>>2]=c+1}function Ed(a){a=a|0;var b=0,c=0,d=0;if(J[a+16>>2]){c=J[a>>2];while(1){b=P(d,28688);Ka(b+c|0,2048);Ka((b+J[a>>2]|0)- -8192|0,1024);Ka((b+J[a>>2]|0)+12288|0,1024);Ka((b+J[a>>2]|0)+20480|0,2048);c=J[a>>2];b=b+c|0;J[b+28680>>2]=1065353216;J[b+28672>>2]=0;J[b+28676>>2]=0;d=d+1|0;if(d>>>0<M[a+16>>2]){continue}break}}}function cb(a){a=a|0;var b=0,c=0,d=0,e=Q(0);d=-1;a:{if(!a){break a}b=J[a>>2];if(!b){break a}c=J[a+4>>2];if(!J[a+8>>2]|(!c|!J[a+12>>2])){break a}e=N[J[a+20>>2]+4>>2];b:{if(Q(R(e))<Q(2147483648)){a=~~e;break b}a=-2147483648}a=a?a:1024;if(a-1&a){break a}d=(P(b>>>0>c>>>0?b:c,28688)+(a<<2)|0)+65676|0}return d|0}function _a(a){var b=0,c=0,d=0;b=a;a:{if(b&3){while(1){if(!K[b|0]){break a}b=b+1|0;if(b&3){continue}break}}while(1){c=b;b=b+4|0;d=J[c>>2];if(!((d^-1)&d-16843009&-2139062144)){continue}break}if(!(d&255)){return c-a|0}while(1){d=K[c+1|0];b=c+1|0;c=b;if(d){continue}break}}return b-a|0}function La(a){var b=Q(0),c=0,d=0;c=(D(a),x(2));d=c>>>23&255;if(d>>>0<=149){if(d>>>0<=125){return Q(a*Q(0))}a=(c|0)>=0?a:Q(-a);b=Q(Q(Q(a+Q(8388608))+Q(-8388608))-a);a:{if(b>Q(.5)){a=Q(Q(a+b)+Q(-1));break a}a=Q(a+b);if(!(b<=Q(-.5))){break a}a=Q(a+Q(1))}a=(c|0)>=0?a:Q(-a)}return a}function Kd(a,b,c){a=a|0;b=b|0;c=c|0;var d=0;a:{if(!a|!b){break a}if((pb(a)|0)>(c|0)){break a}d=b+15&-16;N[d+280>>2]=M[a+8>>2];a=J[a>>2];I[d+292>>1]=0;J[d+284>>2]=4;J[d+276>>2]=a;J[d+304>>2]=1065353216;J[d+308>>2]=0;J[d+296>>2]=0;J[d+300>>2]=0;J[d+288>>2]=d+296;Jd(d)}return d|0}function fc(a,b,c){var d=0,e=0;d=da-16|0;da=d;a:{if(!(b?a:0)){b=0;oa(293172,-2);break a}ya(b,c,d);b=pa(d,28,4);e=J[a+4>>2];J[b+12>>2]=e;c=J[a>>2];J[b+24>>2]=0;J[b+16>>2]=0;J[b+20>>2]=0;J[b+8>>2]=c;c=P(c,e);a=J[a+8>>2];J[b>>2]=pa(d,c,a);J[b+4>>2]=pa(d,c,a)}da=d+16|0;return b}function Qa(a,b,c){var d=0,e=0,f=0;a:{if(!b){d=a;break a}while(1){d=Ue(a,b,10,0);f=ga;e=Re(d,f,246,0)+a|0;c=c-1|0;H[c|0]=e|48;e=b>>>0>9;a=d;b=f;if(e){continue}break}}if(d){while(1){c=c-1|0;a=(d>>>0)/10|0;H[c|0]=P(a,246)+d|48;b=d>>>0>9;d=a;if(b){continue}break}}return c}function Rd(a,b,c,d){var e=Q(0);J[a+12>>2]=c;N[a+16>>2]=b;e=jb(b,N[77917]);a:{if(e<Q(4294967296)&e>=Q(0)){c=~~e>>>0;break a}c=0}J[a+8>>2]=c;b=jb(b,N[77916]);b:{if(b<Q(4294967296)&b>=Q(0)){c=~~b>>>0;break b}c=0}J[a+4>>2]=c;J[a>>2]=c;b=N[77927];N[a+24>>2]=d;N[a+20>>2]=b}function Kb(a,b,c,d){var e=0;e=da-160|0;da=e;J[e+148>>2]=b?b-1|0:0;a=b?a:e+158|0;J[e+144>>2]=a;e=ra(e,0,144);J[e+76>>2]=-1;J[e+36>>2]=32;J[e+80>>2]=-1;J[e+44>>2]=e+159;J[e+84>>2]=e+144;a:{if((b|0)<0){J[78206]=61;break a}H[a|0]=0;Uc(e,c,d,30,31)}da=e+160|0}function mb(a,b,c,d){var e=0,f=0;ld();e=J[76353];if(e){J[76353]=0;f=J[76351];J[76351]=0;ha[e|0](b,c,d,0);J[76353]=e;J[76351]=f}a:{b:{if((a|0)!=1){J[76349]=J[76349]+1;break b}J[76350]=J[76350]+1;if(J[76352]==1){break a}}a=J[76351];if(a){ha[a|0](b,c,d,0)}}}function pc(a,b,c,d){var e=Q(0),f=Q(0),g=Q(0),h=Q(0);e=N[b+8>>2];f=Q(d+1>>>0);g=wb(Q(Q(e*Q(c>>>0))/f));h=wb(Q(Q(e*Q(c+1>>>0))/f));f=wb(Q(Q(e*Q(c+2>>>0))/f));e=N[b+12>>2];f=Q(f/e);N[a+8>>2]=f;N[a+4>>2]=h/e;N[a>>2]=g/e;e=Q(M[b>>2]);if(e<f){N[a+8>>2]=e}}function yb(a){if(a>Q(3.1415927410125732)){while(1){a=Q(a+Q(-6.2831854820251465));if(a>Q(3.1415927410125732)){continue}break}}if(a<=Q(-3.1415927410125732)){while(1){a=Q(a+Q(6.2831854820251465));if(a<=Q(-3.1415927410125732)){continue}break}}return a}function ae(a,b,c){var d=0,e=0,f=0;d=da-16|0;da=d;a:{if(!a){oa(293e3,-2);a=0;break a}e=kc(lc(J[a+4>>2]),c);f=c<<2;c=d+8|0;Wa(J[a+4>>2],0,f,c);qa(J[d+8>>2],b,e<<2);zb(J[a+4>>2],1,c);b=jc(a,J[a+8>>2]);J[a+8>>2]=J[a+8>>2]-b;a=e-b|0}da=d+16|0;return a}function Vc(a,b){var c=0,d=0,e=0;C(+a);d=x(1)|0;e=x(0)|0;c=d>>>20&2047;if((c|0)!=2047){if(!c){if(a==0){c=0}else{a=Vc(a*0x10000000000000000,b);c=J[b>>2]+-64|0}J[b>>2]=c;return a}J[b>>2]=c-1022;z(0,e|0);z(1,d&-2146435073|1071644672);a=+B()}return a}function vd(a){var b=0,c=0,d=0,e=0,f=0;a:{if(!J[a+16>>2]){break a}d=J[a>>2];if(!d){break a}e=J[a+12>>2];f=J[a+4>>2];b=J[a+8>>2];a=Sa(b,(b+J[a+20>>2]|0)-1|0)<<2;while(1){b=c<<2;N[b+e>>2]=N[a+J[b+f>>2]>>2];c=c+1|0;if((d|0)!=(c|0)){continue}break}}}function Ma(a){var b=0;b=da-16|0;da=b;J[b+8>>2]=0;J[b+12>>2]=0;J[b>>2]=0;J[b+4>>2]=0;a:{if(!a){oa(293148,-2);a=-1;break a}ta(b);ma(b,28,1,1);ma(b,J[a+4>>2],J[a>>2],J[a+8>>2]);ma(b,J[a+4>>2],J[a>>2],J[a+8>>2]);a=J[b+12>>2]}da=b+16|0;return a}function gd(a,b){var c=0,d=0,e=0;d=da-32|0;da=d;e=da-32|0;da=e;c=e+8|0;a=J[J[a>>2]+504>>2];N[c+4>>2]=N[a+32>>2];N[c>>2]=N[a+40>>2];N[c+8>>2]=N[a+44>>2];J[c+20>>2]=1;J[c+12>>2]=1;J[c+16>>2]=1;a=d+8|0;Od(c,a);da=e+32|0;fd(a,b);da=d+32|0}function bb(a){var b=0,c=0,d=0;b=da-16|0;da=b;ta(b);ma(b,28,1,1);ma(b,4,J[a>>2],4);c=J[a>>2];if((c|0)>0){while(1){ma(b,4,J[a+4>>2],4);c=J[a>>2];d=d+1|0;if((c|0)>(d|0)){continue}break}}ma(b,4,c,4);da=b+16|0;return J[b+12>>2]}function Se(a,b,c,d){var e=0,f=0,g=0,h=0;f=b^d;g=f>>31;e=b>>31;a=a^e;h=a-e|0;e=(b^e)-((a>>>0<e>>>0)+e|0)|0;a=d>>31;b=c^a;f=f>>31;a=Ue(h,e,b-a|0,(a^d)-((a>>>0>b>>>0)+a|0)|0)^f;b=a-f|0;ga=(g^ga)-((a>>>0<f>>>0)+g|0)|0;return b}function dc(a){var b=0,c=0,d=0;if(!a){oa(293232,-2);return}if(J[a+12>>2]!=4){oa(293244,-2);return}b=J[a+16>>2];if(b>>>0<24){oa(293256,-2);return}c=J[a+24>>2];rb(4,c);d=J[a+8>>2];J[a+16>>2]=b-24;J[a+24>>2]=Sa(d,c+24|0)}function Re(a,b,c,d){var e=0,f=0,g=0,h=0,i=0,j=0;e=c>>>16|0;f=a>>>16|0;j=P(e,f);g=c&65535;h=a&65535;i=P(g,h);f=(i>>>16|0)+P(f,g)|0;e=(f&65535)+P(e,h)|0;ga=(P(b,c)+j|0)+P(a,d)+(f>>>16)+(e>>>16)|0;return i&65535|e<<16}function Rb(a,b){if(!(b?a:0)){oa(296804,-2);return 0}if(J[a+20>>2]){na(0,296816);return 0}N[b>>2]=N[a+128>>2];N[b+4>>2]=N[a+132>>2];N[b+8>>2]=N[a+136>>2];N[b+12>>2]=N[a+140>>2];N[b+16>>2]=N[a+144>>2];return 1}function va(a,b,c,d,e){var f=0;f=da-256|0;da=f;if(!(e&73728|(c|0)<=(d|0))){c=c-d|0;d=c>>>0<256;ra(f,b&255,d?c:256);if(!d){while(1){ua(a,f,256);c=c-256|0;if(c>>>0>255){continue}break}}ua(a,f,c)}da=f+256|0}function Ad(a){var b=0,c=0,d=0;b=_a(a);if(b+_a(305424)>>>0<256){c=_a(305424)+305424|0;a:{if(!b){break a}while(1){d=K[a|0];if(!d){break a}H[c|0]=d;c=c+1|0;a=a+1|0;b=b-1|0;if(b){continue}break}}H[c|0]=0}}function Ib(a){var b=0;b=da-16|0;da=b;a:{if(!a){oa(4974,-2);a=-1;break a}if(N[a+4>>2]<=Q(0)){oa(4986,-2);a=-1;break a}ta(b);ma(b,20,1,1);ma(b,4,Nc(N[a>>2],N[a+4>>2]),4);a=J[b+12>>2]}da=b+16|0;return a}function Te(a,b,c,d){var e=0,f=0,g=0;e=b>>31;a=a^e;f=a-e|0;g=(b^e)-((a>>>0<e>>>0)+e|0)|0;b=d>>31;a=b^c;b=Ve(f,g,a-b|0,(b^d)-((a>>>0<b>>>0)+b|0)|0)^e;a=b-e|0;ga=(e^ga)-((b>>>0<e>>>0)+e|0)|0;return a}function Da(a,b){var c=Q(0),d=Q(0);if(M[a+4>>2]<M[a+8>>2]){Dc(a,N[a>>2]);J[a+4>>2]=J[a+4>>2]+1;return}c=N[a>>2];d=N[a+12>>2];if(d>Q(1)){b=Q(c-Q(Q(c-b)/d))}J[a+20>>2]=1;N[a>>2]=b;J[a+24>>2]=Ha(c,b)}function Sc(a){var b=0,c=0,d=0;d=J[a>>2];while(1){c=H[d|0];if(kb(c)){d=d+1|0;J[a>>2]=d;if(b>>>0<=214748364){c=c-48|0;b=P(b,10);b=(c|0)>(2147483647-b|0)?-1:c+b|0}else{b=-1}continue}break}return b}function mc(a){var b=0,c=0,d=0;b=da-16|0;da=b;a:{if(!a){oa(292988,-2);break a}J[a+8>>2]=0;c=lc(J[a+4>>2]);d=c<<2;Wa(J[a+4>>2],0,d,b+8|0);if(c){ra(J[b+8>>2],0,d)}zb(J[a+4>>2],1,b+8|0)}da=b+16|0}function Ha(a,b){var c=0,d=0;b=Q(b*Q(1e4));a:{if(Q(R(b))<Q(2147483648)){c=~~b;break a}c=-2147483648}a=Q(a*Q(1e4));b:{if(Q(R(a))<Q(2147483648)){d=~~a;break b}d=-2147483648}return(d-c|0)+1>>>0<3}function hd(a){var b=Q(0),c=Q(0),d=0;c=Q(Q(1e3)/Q(a>>>0));d=$b();b=Q(Q(c+Q(-1.1920928955078125e-7))/Q(d>>>0));a:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break a}a=0}return P(!(c<=Q(0))+a|0,d)}function Ob(a){var b=0;b=J[a+72>>2];J[a+72>>2]=b-1|b;b=J[a>>2];if(b&8){J[a>>2]=b|32;return-1}J[a+4>>2]=0;J[a+8>>2]=0;b=J[a+44>>2];J[a+28>>2]=b;J[a+20>>2]=b;J[a+16>>2]=b+J[a+48>>2];return 0}function Ra(a,b){var c=0,d=0;c=K[a|0];d=K[b|0];a:{if(!c|(d|0)!=(c|0)){break a}while(1){d=K[b+1|0];c=K[a+1|0];if(!c){break a}b=b+1|0;a=a+1|0;if((c|0)==(d|0)){continue}break}}return c-d|0}function pd(a,b,c,d,e){var f=0;f=da-32|0;da=f;ab(f+16|0,b,c,d,e);b=J[f+28>>2];J[f+8>>2]=J[f+24>>2];J[f+12>>2]=b;b=J[f+20>>2];J[f>>2]=J[f+16>>2];J[f+4>>2]=b;Ub(a,f);da=f+32|0}function Ya(a){var b=0,c=0;b=J[75912];c=a+3&-4;a=b+c|0;a:{if(a>>>0<=b>>>0?c:0){break a}if(Jb()>>>0<a>>>0){if(!(aa(a|0)|0)){break a}}J[75912]=a;return b}J[78206]=48;return-1}function $d(a,b){var c=0,d=0;if(!a){return}if(!b){return}while(1){d=(c<<2)+a|0;N[d>>2]=Pb(Q(U(N[d>>2],Q(1.1754943508222875e-38))));c=c+1|0;if((c|0)!=(b|0)){continue}break}}function Md(a){var b=0;if(!a){return 0}a:{if((a|0)<0){na(0,4769);a=0;break a}b=J[77942];if(b){a=ha[b|0](J[77943],a)|0;J[77946]=J[77946]+1;break a}na(0,4806);a=0}return a}function ib(a,b){var c=Q(0);a:{b:{c:{switch(a|0){case 0:c=Q(1);if((b|0)!=5){break b}break a;case 1:break c;default:break b}}c=Q(1);if((b|0)==7){break a}}c=Q(0)}return c}function wc(a){var b=0;b=da-32|0;da=b;H[b+27|0]=0;H[b+25|0]=105;H[b+26|0]=102;O[b+8>>3]=Q(a/Q(1200));J[b>>2]=b+28;ca(304805,b+25|0,b|0)|0;da=b+32|0;return N[b+28>>2]}function sa(a,b,c){var d=0,e=0;d=da-272|0;da=d;a:{if(M[76216]>a>>>0){break a}a=J[76212];if(!a){break a}J[d+12>>2]=c;e=d+16|0;Kb(e,256,b,c);ha[a|0](e)}da=d+272|0}function Ba(a){var b=0,c=0;b=a*a;c=b*a;return Q(c*(b*b)*(b*2718311493989822e-21+-.00019839334836096632)+(c*(b*.008333329385889463+-.16666666641626524)+a))}function Yd(a){var b=0;if(!a){oa(293352,-2);return}J[a+8>>2]=0;if(J[a+4>>2]){while(1){J[J[a>>2]+(b<<2)>>2]=4;b=b+1|0;if(b>>>0<M[a+4>>2]){continue}break}}}function Mc(a,b){var c=0,d=0;if(a){c=J[a+12>>2];if(c){d=J[a>>2];a=0;while(1){N[(a<<2)+d>>2]=b;a=a+1|0;if((c|0)!=(a|0)){continue}break}}return}oa(5034,-2)}function jc(a,b){var c=0,d=0;c=da-16|0;da=c;J[c+12>>2]=0;ic(a,c+12|0);d=J[a+4>>2];b=kc(b,J[c+12>>2]);Wa(d,1,b<<2,c);zb(J[a+4>>2],0,c);da=c+16|0;return b}function fd(a,b){if(!(!a|!b)){N[b>>2]=N[a>>2];N[b+4>>2]=N[a+4>>2];N[b+8>>2]=N[a+8>>2];J[b+12>>2]=J[a+12>>2];J[b+16>>2]=J[a+16>>2];J[b+20>>2]=J[a+20>>2]}}function uc(a,b,c){N[a>>2]=gb(N[b>>2],N[c>>2]);N[a+4>>2]=gb(N[b+4>>2],N[c+4>>2]);N[a+8>>2]=gb(N[b+8>>2],N[c+8>>2]);N[a+12>>2]=gb(N[b+12>>2],N[c+12>>2])}function sd(a){var b=0,c=0;b=da-32|0;da=b;if(!a){J[b+8>>2]=100;J[b+12>>2]=1056964608;a=b+8|0}c=b+16|0;ta(c);ma(c,Xb(a),1,4);da=b+32|0;return J[c+12>>2]}function sc(a,b){var c=0,d=0;c=J[a+8>>2];d=J[a+4>>2];J[b>>2]=0;a=J[a>>2];J[b+16>>2]=293120;J[b+12>>2]=4;J[b+8>>2]=(c>>>0<d>>>0?d:c)<<2;J[b+4>>2]=a<<2}function Wc(a){var b=0,c=0;c=a>>>23&255;b=0;a:{if(c>>>0<127){break a}b=2;if(c>>>0>150){break a}c=1<<150-c;b=0;if(c-1&a){break a}b=a&c?1:2}return b}function ub(a){var b=0,c=0;b=da-16|0;da=b;J[b+12>>2]=0;a:{if(!a){oa(293024,-2);break a}ic(a,b+12|0);c=M[b+12>>2]>=M[a+24>>2]}da=b+16|0;return c}function fe(a,b){a=a|0;b=b|0;var c=0;a:{b:{c:{switch(b|0){case 1:a=a+16|0;break b;case 0:break c;default:break a}}a=a+20|0}c=J[a>>2]}return c|0}function cc(a){var b=0;if(!a){oa(293268,-2);return 0}b=J[a+8>>2];if(!b){oa(293280,-2);return 0}return J[a>>2]+rb(J[a+12>>2],Sa(b,J[a+24>>2]))|0}function ac(a){var b=0;b=da-16|0;da=b;a:{if(!a){oa(293304,-2);a=-1;break a}ta(b);ma(b,16,1,1);ma(b,4,J[a>>2],4);a=J[b+12>>2]}da=b+16|0;return a}function Qb(a,b,c){if(a>>>0<b>>>0){qa(a,b,c);return}if(c){a=a+c|0;b=b+c|0;while(1){a=a-1|0;b=b-1|0;H[a|0]=K[b|0];c=c-1|0;if(c){continue}break}}}function ce(){var a=0;if(!J[76213]){sa(4,1200,0);return}Nd(0,0);a=J[77939];if(a){Zb(a);J[77939]=0}H[311760]=0;J[76214]=0;J[76215]=0;J[76213]=0}function rd(a){var b=Q(0),c=0;b=Q(N[a+44>>2]*Q(J[a+32>>2]));a:{if(b<Q(4294967296)&b>=Q(0)){c=~~b>>>0;break a}c=0}if(c){ra(J[a+36>>2],0,c<<2)}}function Ca(a){var b=0;a=a*a;b=a*a;return Q(a*b*(a*2439044879627741e-20+-.001388676377460993)+(b*.04166662332373906+(a*-.499999997251031+1)))}function Ea(a,b,c){var d=Q(0);d=N[a+16>>2];b=Q(b-d);c=Q(b/c);a:{b:{if(c<Q(0)){if(b>c){break b}break a}if(!(b<c)){break a}}c=b}N[a+16>>2]=d+c}function Od(a,b){N[b>>2]=N[a>>2];N[b+4>>2]=N[a+4>>2];N[b+8>>2]=N[a+8>>2];J[b+12>>2]=J[a+12>>2];J[b+16>>2]=J[a+16>>2];J[b+20>>2]=J[a+20>>2]}function Va(a){var b=Q(0);b=Q(a*a);return Q(Q(Q(Q(b/Q(-6))*Q(Q(Q(b/Q(-20))*Q(Q(Q(b/Q(-42))*Q(Q(b/Q(-72))+Q(1)))+Q(1)))+Q(1)))+Q(1))*a)}function je(a){a=a|0;J[a+16>>2]=0;J[a+24>>2]=0;J[a+28>>2]=0;J[a+44>>2]=0;J[a+48>>2]=0;J[a+52>>2]=0;J[a+56>>2]=0;J[a+20>>2]=J[a+36>>2]}function Nd(a,b){a:{if(J[77946]){na(0,4625);break a}J[77943]=0;J[77942]=a}b:{if(J[77946]){na(0,4697);break b}J[77945]=0;J[77944]=b}}function sb(a){var b=0,c=0;b=jc(a,J[a+28>>2]);c=J[a+8>>2];b=J[a+28>>2]-b|0;if(c>>>0>(b^-1)>>>0){oa(293096,-2);return}J[a+8>>2]=b+c}function gc(a){var b=0;b=da-16|0;da=b;a:{if(!a){oa(293160,-2);a=-1;break a}ta(b);ma(b,Ma(a),1,4);a=J[b+12>>2]}da=b+16|0;return a}function Db(){var a=0;a=da-16|0;da=a;ta(a);ma(a,72,1,1);ma(a,Cb(),1,4);ma(a,Cb(),1,4);ma(a,Cb(),1,4);da=a+16|0;return J[a+12>>2]}function tb(a,b,c){J[c+12>>2]=b;J[b+4>>2]=a;c=J[a+8>>2];J[b+12>>2]=0;J[b+8>>2]=c;c=J[a+8>>2];if(c){J[c+4>>2]=b}J[a+8>>2]=b}function Qc(a,b){if(!a){return 0}a:{if(a){if(!((b&-128)==57216|b>>>0<=127)){J[78206]=25;a=-1;break a}H[a|0]=b}a=1}return a}function hb(a){a=Q(a*a);return Q(Q(Q(a*Q(-.5))*Q(Q(Q(a/Q(-12))*Q(Q(Q(a/Q(-30))*Q(Q(a/Q(-56))+Q(1)))+Q(1)))+Q(1)))+Q(1))}function Lc(a,b){var c=0;if(!a){oa(5046,-2);return}c=J[a+16>>2];N[J[a>>2]+(c<<2)>>2]=b;J[a+16>>2]=(c+1>>>0)%M[a+12>>2]}function Pc(a,b,c){var d=0,e=0;while(1){e=d<<2;N[e+b>>2]=U(N[a+e>>2],Q(0));d=d+1|0;if((d|0)!=(c|0)){continue}break}}function rc(a,b,c){b=Q(Q(Q(a>>>0)*c)/b);a:{if(b<Q(4294967296)&b>=Q(0)){a=~~b>>>0;break a}a=0}return((a^-1)&1)+a|0}function Nc(a,b){var c=0;a=Fa(a,b);a:{if(a<Q(4294967296)&a>=Q(0)){c=~~a>>>0;break a}c=0}return c+(a!=Q(c>>>0))|0}function pb(a){a=a|0;var b=0;b=-1;if(!(!a|!J[a>>2]|(!J[a+4>>2]|!J[a+12>>2]))){b=J[a+8>>2]?328:-1}return b|0}function vc(a,b){N[a>>2]=Y(N[b>>2]);N[a+4>>2]=Y(N[b+4>>2]);N[a+8>>2]=Y(N[b+8>>2]);N[a+12>>2]=Y(N[b+12>>2])}function db(a,b){var c=0;b=Q(W(b));a:{if(b<Q(4294967296)&b>=Q(0)){c=~~b>>>0;break a}c=0}return c-vb(a)|0}function Zb(a){var b=0;a:{b=J[77944];if(b){ha[b|0](J[77945],a);J[77946]=J[77946]-1;break a}na(0,4854)}}function ra(a,b,c){var d=0;if(c){d=a;while(1){H[d|0]=b;d=d+1|0;c=c-1|0;if(c){continue}break}}return a}function pa(a,b,c){var d=0;d=a;a=(J[a+4>>2]+c|0)-1|0;a=a-((a>>>0)%(c>>>0)|0)|0;J[d+4>>2]=a+b;return a}function Ec(a){J[a+68>>2]=4;Ab(J[a>>2],N[a+32>>2]);Ab(J[a+4>>2],N[a+40>>2]);Ab(J[a+8>>2],N[a+44>>2])}function Dc(a,b){var c=Q(0);c=b;b=N[a>>2];c=Q(Q(Q(c-b)*N[a+16>>2])+b);N[a>>2]=c;J[a+24>>2]=Ha(b,c)}function Sb(a){var b=0,c=0;b=J[a+400>>2];c=J[a+28>>2];if(c){b=Ld(c,b-J[a+420>>2]|0)+7&-8}return b}function Ld(a,b){var c=0;c=J[a+4>>2];if((c|0)!=4096){b=(J[a+8>>2]+P(b,c)|0)+32768>>>12|0}return b}function qa(a,b,c){if(c){while(1){H[a|0]=K[b|0];a=a+1|0;b=b+1|0;c=c-1|0;if(c){continue}break}}}function Sd(a,b){var c=Q(0);J[a>>2]=b;c=N[77917];J[a+8>>2]=1065353216;N[a+4>>2]=Q(1e3)/c}function yd(a){var b=0;b=da-16|0;da=b;ta(b);ma(b,bb(a),1,4);da=b+16|0;return J[b+12>>2]}function xb(a){var b=0;b=da-16|0;da=b;ta(b);ma(b,Ua(a),1,4);da=b+16|0;return J[b+12>>2]}function Ie(a,b,c){a=a|0;b=b|0;c=Q(c);if(M[a+284>>2]>b>>>0){N[J[a+288>>2]+(b<<2)>>2]=c}}function nc(a){if(!a){oa(292976,-2);return 0}a=J[a+4>>2];ha[J[J[a>>2]>>2]](a);return 1}function Me(a){a=a|0;if(!(J[76213]?a:0)){sa(4,2418,0);return 0}return Sb(J[a+28>>2])|0}function He(a,b){a=a|0;b=b|0;return Q(M[a+284>>2]>b>>>0?N[J[a+288>>2]+(b<<2)>>2]:Q(0))}function $b(){var a=Q(0);a=N[77917];if(a<Q(4294967296)&a>=Q(0)){return~~a>>>0}return 0}function De(a,b,c){a=a|0;b=b|0;c=Q(c);if(M[a+52>>2]>b>>>0){N[J[a+56>>2]+(b<<2)>>2]=c}}function Ce(a,b){a=a|0;b=b|0;return Q(M[a+52>>2]>b>>>0?N[J[a+56>>2]+(b<<2)>>2]:Q(0))}function tc(a){a=a-1|0;a=a>>>1|a;a=a>>>2|a;a=a>>>4|a;a=a>>>8|a;return(a>>>16|a)+1|0}function Cb(){var a=0;a=da-16|0;da=a;ta(a);ma(a,28,1,1);da=a+16|0;return J[a+12>>2]}function Oa(a,b){return((D(Q(a-b)),x(2))|0)<0?((D(Q(Q(10)-a)),x(2))|0)<0?a:Q(10):b}function zc(a){return J[a+12>>2]+((J[a+8>>2]+J[a+4>>2]|0)+(J[a>>2]==1?76:68)|0)|0}function bc(a){if(!a){oa(293292,-2);return}J[a+24>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0}function Ge(a,b,c){a=a|0;b=b|0;c=c|0;J[b>>2]=J[a+276>>2];J[c>>2]=J[a+276>>2]}function Bb(a,b){a=pa(a,28,4);N[a+16>>2]=b;J[a+8>>2]=0;J[a+12>>2]=0;return a}function vb(a){a=Q(V(a));if(a<Q(4294967296)&a>=Q(0)){return~~a>>>0}return 0}function We(a){var b=0;b=a&31;a=0-a&31;return(-1>>>b&-2)<<b|(-1<<a&-2)>>>a}function Be(a,b,c){a=a|0;b=b|0;c=c|0;J[b>>2]=J[a+16>>2];J[c>>2]=J[a+16>>2]}function ic(a,b){if(!a){oa(293012,-2);return}J[b>>2]=Ac(J[a+4>>2],1)>>>2}function ab(a,b,c,d,e){J[a+8>>2]=d;J[a+12>>2]=e;J[a>>2]=b;J[a+4>>2]=c}function _d(a){if(!a){oa(293108,-2);return}Cc(J[a+4>>2]);J[a+8>>2]=0}function Ab(a,b){J[a+20>>2]=1;J[a+24>>2]=1;J[a+4>>2]=0;N[a>>2]=b}function _c(a){var b=0;b=da-16|0;O[b+8>>3]=a;return O[b+8>>3]*a}function Yc(a){var b=0;b=da-16|0;N[b+12>>2]=a;return N[b+12>>2]}function ta(a){J[a+8>>2]=0;J[a+12>>2]=0;J[a>>2]=1;J[a+4>>2]=1}function ee(a,b){a=a|0;b=b|0;if(!b){return 0}return Za(b)|0}function se(a,b,c,d){a=a|0;b=b|0;c=c|0;d=d|0;ga=0;return 0}function id(a,b,c){b=nb(b);J[c+4>>2]=hd(a);J[c>>2]=Pa(b)}function Yb(a){J[a+8>>2]=0;ra(a+16|0,0,P(J[a+12>>2],36))}function td(a){J[a+24>>2]=0;J[a+16>>2]=0;J[a+20>>2]=0}function ya(a,b,c){J[c+8>>2]=b;J[c+4>>2]=a;J[c>>2]=a}function nb(a){if(!a){return 0}na(0,296882);return 2}function dd(a){return Zc(a,Q(1.5845632502852868e29))}function cd(a){return Zc(a,Q(2.524354896707238e-29))}function Xe(a){if(a){return 31-S(a-1^a)|0}return 32}
function Ac(a,b){return ha[J[J[a>>2]+20>>2]](a,b)|0}function qb(a){J[a>>2]=72;J[a+4>>2]=4;J[a+8>>2]=4}function Xc(a){return(a<<1)+16777216>>>0<16777217}function Xa(a,b){Dc(a,b);J[a+20>>2]=0;J[a+4>>2]=0}function Wa(a,b,c,d){ha[J[J[a>>2]+8>>2]](a,b,c,d)}function hc(a,b){return(a|0)<0?0:(a|0)<(b|0)?a:b}function Ve(a,b,c,d){Qe(a,b,c,d);ga=fa;return ea}function Vb(a){rd(a);qd(a);J[a>>2]=0;J[a+4>>2]=1}function Hb(a,b){return((a+b|0)-1>>>0)%(b>>>0)|0}function Gc(a){J[a+8>>2]=1;J[a>>2]=0;J[a+4>>2]=1}function xe(a){a=a|0;a=da-a&-16;da=a;return a|0}function ke(a){a=a|0;if(J[a+8>>2]){J[a+8>>2]=0}}function zb(a,b,c){ha[J[J[a>>2]+16>>2]](a,b,c)}function ua(a,b,c){if(!(K[a|0]&32)){Nb(b,c,a)}}function jd(a,b){a=hd(a);J[b>>2]=3;J[b+4>>2]=a}function Bc(a,b){ha[J[J[a>>2]+12>>2]](a,1,b)}function kd(a,b,c,d){a=Se(c,d,a,b);return a}function Ue(a,b,c,d){a=Qe(a,b,c,d);return a}function Zc(a,b){return Q(Yc(a?Q(-b):b)*b)}function Vd(a,b){Rd(a,b,J[77926],N[77925])}function Ud(a,b){Rd(a,b,J[77921],N[77920])}function Ic(a,b,c,d){Oc(a,b,c,d,128,9,512)}function jb(a,b){return Q(Fa(a,b)/Q(1e3))}function de(a,b){a=a|0;b=b|0;if(b){Ia(b)}}function Hc(a,b,c,d){Oc(a,b,c,d,32,7,128)}function ud(a,b,c){qa(b,J[a+12>>2],c<<2)}function Sa(a,b){return(b>>>0)%(a>>>0)|0}function Kc(a,b,c){N[a+4>>2]=c;N[a>>2]=b}function kc(a,b){return a>>>0<b>>>0?a:b}function Pa(a){return a?((a|0)==1)<<3:6}function Mb(a){return(D(a),x(2))>>>20|0}function bd(a){a=Q(a-a);return Q(a/a)}function Hd(a){a=a|0;ra(a+20|0,0,256)}function Cc(a){ha[J[J[a>>2]+4>>2]](a)}function ec(a){if(!a){oa(293184,-2)}}function we(a){a=a|0;return Za(a)|0}function lc(a){return Ac(a,0)>>>2|0}function Le(a){a=a|0;return 294628}function Fe(a){a=a|0;return 294692}function kb(a){return a-48>>>0<10}function ne(a){a=a|0;J[76212]=a}function rb(a,b){return P(a,b)}function nd(a,b){ab(a,b,0,1,0)}function Fa(a,b){return Q(a*b)}function wa(a){return a>=Q(0)}function te(a){a=a|0;return 0}function oe(){return J[76212]}function Pe(){return 83886084}function Ka(a,b){ra(a,0,b<<2)}function Jb(){return ia()<<16}function xa(a,b){return a<=b}function na(a,b){mb(a,b,0,0)}function Lb(a,b){mb(0,a,b,0)}function Fb(a,b){Pc(a,b,128)}function qd(a){J[a+56>>2]=0}function ld(){J[76348]=4176}function Eb(a,b){Pc(a,b,32)}function ve(a){a=a|0;Ia(a)}function Wb(a,b){ra(a,0,b)}function ze(){return da|0}function ye(a){a=a|0;da=a}function Ae(){return 1024}function Td(a){J[a>>2]=3}function Id(a){a=a|0}function be(){}
// EMSCRIPTEN_END_FUNCS
g=K;r(ka);var ha=e([null,le,ee,de,Le,pb,Kd,Id,Hd,Je,Ie,He,Jd,Ge,Fe,cb,Gd,Id,Ed,Ee,De,Ce,Fd,Be,ke,je,ie,he,ge,fe,re,qe,pe,te,ue,se]);function ia(){return G.byteLength/65536|0}return{"e":be,"f":Pe,"g":Ae,"h":oe,"i":ne,"j":me,"k":ce,"l":Oe,"m":Zd,"n":Ne,"o":Me,"p":Ke,"q":ha,"r":we,"s":ve,"t":ze,"u":ye,"v":xe}}return ja(la)}
// EMSCRIPTEN_END_ASM




)(B)}var ea=Error,WebAssembly={};z=[];"object"!=typeof WebAssembly&&C("no native wasm support detected");var D,fa=!1,ha="undefined"!=typeof TextDecoder?new TextDecoder("utf8"):void 0;
function ia(a,c,b){var f=c+b;for(b=c;a[b]&&!(b>=f);)++b;if(16<b-c&&a.buffer&&ha)return ha.decode(a.subarray(c,b));for(f="";c<b;){var e=a[c++];if(e&128){var h=a[c++]&63;if(192==(e&224))f+=String.fromCharCode((e&31)<<6|h);else{var g=a[c++]&63;e=224==(e&240)?(e&15)<<12|h<<6|g:(e&7)<<18|h<<12|g<<6|a[c++]&63;65536>e?f+=String.fromCharCode(e):(e-=65536,f+=String.fromCharCode(55296|e>>10,56320|e&1023))}}else f+=String.fromCharCode(e)}return f}function E(a,c){return a?ia(F,a,c):""}
function ja(a,c,b,f){if(!(0<f))return 0;var e=b;f=b+f-1;for(var h=0;h<a.length;++h){var g=a.charCodeAt(h);if(55296<=g&&57343>=g){var l=a.charCodeAt(++h);g=65536+((g&1023)<<10)|l&1023}if(127>=g){if(b>=f)break;c[b++]=g}else{if(2047>=g){if(b+1>=f)break;c[b++]=192|g>>6}else{if(65535>=g){if(b+2>=f)break;c[b++]=224|g>>12}else{if(b+3>=f)break;c[b++]=240|g>>18;c[b++]=128|g>>12&63}c[b++]=128|g>>6&63}c[b++]=128|g&63}}c[b]=0;return b-e}function ka(a,c,b){return ja(a,F,c,b)}function la(a,c){G.set(a,c)}
var H,G,F,I,J,K,L,M,A=d.INITIAL_MEMORY||16777216;d.wasmMemory?D=d.wasmMemory:D=new ba;D&&(H=D.buffer);A=H.byteLength;var N=H;H=N;d.HEAP8=G=new Int8Array(N);d.HEAP16=I=new Int16Array(N);d.HEAP32=J=new Int32Array(N);d.HEAPU8=F=new Uint8Array(N);d.HEAPU16=new Uint16Array(N);d.HEAPU32=K=new Uint32Array(N);d.HEAPF32=L=new Float32Array(N);d.HEAPF64=M=new Float64Array(N);var O,ma=[],na=[],oa=[];function pa(){var a=d.preRun.shift();ma.unshift(a)}var P=0,Q=null,R=null;d.preloadedImages={};
d.preloadedAudios={};function C(a){if(d.onAbort)d.onAbort(a);a="Aborted("+a+")";w(a);fa=!0;a=new ea(a+". Build with -s ASSERTIONS=1 for more info.");t(a);throw a;}function qa(a){return a.startsWith("data:application/octet-stream;base64,")}var S;S="<<< WASM_BINARY_FILE >>>";if(!qa(S)){var ra=S;S=d.locateFile?d.locateFile(ra,v):v+ra}
function sa(){var a=S;try{try{if(a==S&&z)new Uint8Array(z);else{if(qa(a)){try{var c=ta(a.slice(37)),b=new Uint8Array(c.length);for(a=0;a<c.length;++a)b[a]=c.charCodeAt(a);var f=b}catch(l){throw Error("Converting base64 string to bytes failed.");}var e=f}else e=void 0;if(!e)throw"sync fetching of the wasm failed: you can preload it to Module['wasmBinary'] manually, or emcc.py will do that for you when generating HTML (but not JS)";}}catch(l){C(l)}var h=new ca;var g=new da}catch(l){throw g=l.toString(),
w("failed to compile wasm module: "+g),(g.includes("imported Memory")||g.includes("memory import"))&&w("Memory size incompatibility issues may be due to changing INITIAL_MEMORY at runtime to something too large. Use ALLOW_MEMORY_GROWTH to allow any size memory (and also make sure not to set INITIAL_MEMORY at runtime to something smaller than it was at compile time)."),l;}return[g,h]}
var T,U,ua={303652:function(a,c,b){var f="";b=K[b>>2]>>2;a:for(var e="";;){var h=F[c++>>0];if(!h){c=e;break a}e+=String.fromCharCode(h)}for(var g=h=0,l=0,p=0,m=0,q=0,k,r=0;r<c.length;r++)if(e=c[r],"%"!=e)f+=e;else for(r++;;)if(e=c[r],"+"==e)h=1,++r;else if("-"==e)g=1,++r;else if("0"==e)l=1,++r;else if("."==e)m=parseInt(c[r+1]),r+=2;else if(isNaN(k=parseInt(e))){switch(e){case "l":q++;r++;continue;case "d":k=J[b];b+=1;break;case "u":k=K[b];b+=1;break;case "x":k=K[b].toString(16);b+=1;break;case "X":k=
K[b].toString(16).toUpperCase();b+=1;break;case "f":k=M[b>>1];b+=2;m&&(k=k.toFixed(m));break;case "s":k=E(K[b]);b+=1;break;case "c":case "%":k="%"}h&&0<=k&&(k="+"+k);g?k=(k+"         ").slice(p):p&&l?k=("0000000000"+k).slice(-p):p&&(k=("         "+k).slice(-p));f+=k;break}else p=k,++r;b=f;for(c=0;c<b.length;++c)G[a++>>0]=b.charCodeAt(c);G[a>>0]=0;return f.length},304696:function(a,c,b){L[a>>2]=Math.pow(c,b)},304735:function(a,c){L[a>>2]=Math.log(c)},304770:function(a,c){L[a>>2]=Math.exp(c)},304805:function(a,
c){L[a>>2]=Math.pow(2,c)}};function V(a){for(;0<a.length;){var c=a.shift();if("function"==typeof c)c(d);else{var b=c.B;"number"==typeof b?void 0===c.A?O.get(b)():O.get(b)(c.A):b(void 0===c.A?null:c.A)}}}
var W=[],va=[null,[],[]],ta="function"==typeof atob?atob:function(a){var c="",b=0;a=a.replace(/[^A-Za-z0-9\\+\\/=]/g,"");do{var f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));var h="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));var g="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(a.charAt(b++));
f=f<<2|e>>4;e=(e&15)<<4|h>>2;var l=(h&3)<<6|g;c+=String.fromCharCode(f);64!==h&&(c+=String.fromCharCode(e));64!==g&&(c+=String.fromCharCode(l))}while(b<a.length);return c},B={d:function(a,c,b){W.length=0;var f;for(b>>=2;f=F[c++];)(f=105>f)&&b&1&&b++,W.push(f?M[b++>>1]:J[b]),++b;return ua[a].apply(null,W)},b:function(){C("OOM")},c:function(a,c,b,f){for(var e=0,h=0;h<b;h++){var g=J[c>>2],l=J[c+4>>2];c+=8;for(var p=0;p<l;p++){var m=F[g+p],q=va[a];0===m||10===m?((1===a?aa:w)(ia(q,0)),q.length=0):q.push(m)}e+=
l}J[f>>2]=e;return 0},a:D},X=function(){function a(b){d.asm=b.exports;O=d.asm.q;na.unshift(d.asm.e);P--;d.monitorRunDependencies&&d.monitorRunDependencies(P);0==P&&(null!==Q&&(clearInterval(Q),Q=null),R&&(b=R,R=null,b()))}var c={a:B};P++;d.monitorRunDependencies&&d.monitorRunDependencies(P);if(d.instantiateWasm)try{return d.instantiateWasm(c,a)}catch(b){return w("Module.instantiateWasm callback failed with error: "+b),!1}c=sa();a(c[0]);return d.asm}();d.___wasm_call_ctors=X.e;
d._csmMotionSync_GetEngineVersion=X.f;d._csmMotionSync_GetEngineName=X.g;d._csmMotionSync_GetLogFunction=X.h;d._csmMotionSync_SetLogFunction=X.i;d._csmMotionSync_InitializeEngine=X.j;d._csmMotionSync_DisposeEngine=X.k;d._csmMotionSync_CreateContext=X.l;d._csmMotionSync_DeleteContext=X.m;d._csmMotionSync_ClearContext=X.n;d._csmMotionSync_GetRequireSampleCount=X.o;d._csmMotionSync_Analyze=X.p;d._csmMotionSync_Malloc=X.r;d._csmMotionSync_Free=X.s;
var wa=d.stackSave=X.t,xa=d.stackRestore=X.u,ya=d.stackAlloc=X.v;d.intArrayFromString=function(a,c,b){if(!(0<b)){for(var f=b=0;f<a.length;++f){var e=a.charCodeAt(f);55296<=e&&57343>=e&&(e=65536+((e&1023)<<10)|a.charCodeAt(++f)&1023);127>=e?++b:b=2047>=e?b+2:65535>=e?b+3:b+4}b+=1}b=Array(b);a=ja(a,b,0,b.length);c&&(b.length=a);return b};
d.ccall=function(a,c,b,f){var e={string:function(m){var q=0;if(null!==m&&void 0!==m&&0!==m){var k=(m.length<<2)+1;q=ya(k);ka(m,q,k)}return q},array:function(m){var q=ya(m.length);la(m,q);return q}};a=d["_"+a];var h=[],g=0;if(f)for(var l=0;l<f.length;l++){var p=e[b[l]];p?(0===g&&(g=wa()),h[l]=p(f[l])):h[l]=f[l]}b=a.apply(null,h);return b=function(m){0!==g&&xa(g);return"string"===c?E(m):"boolean"===c?!!m:m}(b)};
d.setValue=function(a,c,b="i8"){"*"===b.charAt(b.length-1)&&(b="i32");switch(b){case "i1":G[a>>0]=c;break;case "i8":G[a>>0]=c;break;case "i16":I[a>>1]=c;break;case "i32":J[a>>2]=c;break;case "i64":U=[c>>>0,(T=c,1<=+Math.abs(T)?0<T?(Math.min(+Math.floor(T/4294967296),4294967295)|0)>>>0:~~+Math.ceil((T-+(~~T>>>0))/4294967296)>>>0:0)];J[a>>2]=U[0];J[a+4>>2]=U[1];break;case "float":L[a>>2]=c;break;case "double":M[a>>3]=c;break;default:C("invalid type for setValue: "+b)}};
d.getValue=function(a,c="i8"){"*"===c.charAt(c.length-1)&&(c="i32");switch(c){case "i1":return G[a>>0];case "i8":return G[a>>0];case "i16":return I[a>>1];case "i32":return J[a>>2];case "i64":return J[a>>2];case "float":return L[a>>2];case "double":return Number(M[a>>3]);default:C("invalid type for getValue: "+c)}return null};d.UTF8ToString=E;d.stringToUTF8=ka;d.writeArrayToMemory=la;
d.addFunction=function(a){if(!y){y=new WeakMap;for(var c=O.length,b=0;b<0+c;b++){var f=O.get(b);f&&y.set(f,b)}}if(y.has(a))return y.get(a);if(x.length)c=x.pop();else{try{O.grow(1)}catch(e){if(!(e instanceof RangeError))throw e;throw"Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";}c=O.length-1}try{O.set(c,a)}catch(e){if(!(e instanceof TypeError))throw e;O.set(c,a)}y.set(a,c);return c};var Y;R=function za(){Y||Z();Y||(R=za)};
function Z(){function a(){if(!Y&&(Y=!0,d.calledRun=!0,!fa)){V(na);n(d);if(d.onRuntimeInitialized)d.onRuntimeInitialized();if(d.postRun)for("function"==typeof d.postRun&&(d.postRun=[d.postRun]);d.postRun.length;){var c=d.postRun.shift();oa.unshift(c)}V(oa)}}if(!(0<P)){if(d.preRun)for("function"==typeof d.preRun&&(d.preRun=[d.preRun]);d.preRun.length;)pa();V(ma);0<P||(d.setStatus?(d.setStatus("Running..."),setTimeout(function(){setTimeout(function(){d.setStatus("")},1);a()},1)):a())}}d.run=Z;
if(d.preInit)for("function"==typeof d.preInit&&(d.preInit=[d.preInit]);0<d.preInit.length;)d.preInit.pop()();Z();


  return _em_module
}
);
})();
var _em = _em_module();
})(Live2DCubismMotionSyncCore || (Live2DCubismMotionSyncCore = {}));
//# sourceMappingURL=live2dcubismmotionsynccore.js.map`;
function W9(r) {
  const v = document.createElement("script");
  v.type = "text/javascript", v.innerHTML = r, document.body.appendChild(v);
}
W9(M9);
class o {
  /**
   * 引数付きコンストラクタ
   * @param iniitalCapacity 初期化後のキャパシティ。データサイズは_capacity * sizeof(T)
   * @param zeroClear trueなら初期化時に確保した領域を0で埋める
   */
  constructor(v = 0) {
    v < 1 ? (this._ptr = [], this._capacity = 0, this._size = 0) : (this._ptr = new Array(v), this._capacity = v, this._size = 0);
  }
  /**
   * インデックスで指定した要素を返す
   */
  at(v) {
    return this._ptr[v];
  }
  /**
   * 要素をセット
   * @param index 要素をセットするインデックス
   * @param value セットする要素
   */
  set(v, P) {
    this._ptr[v] = P;
  }
  /**
   * コンテナを取得する
   */
  get(v = 0) {
    const P = new Array();
    for (let e = v; e < this._size; e++)
      P.push(this._ptr[e]);
    return P;
  }
  /**
   * pushBack処理、コンテナに新たな要素を追加する
   * @param value PushBack処理で追加する値
   */
  pushBack(v) {
    this._size >= this._capacity && this.prepareCapacity(this._capacity == 0 ? o.DefaultSize : this._capacity * 2), this._ptr[this._size++] = v;
  }
  /**
   * コンテナの全要素を解放する
   */
  clear() {
    this._ptr.length = 0, this._size = 0;
  }
  /**
   * コンテナの要素数を返す
   * @return コンテナの要素数
   */
  getSize() {
    return this._size;
  }
  /**
   * コンテナの全要素に対して代入処理を行う
   * @param newSize 代入処理後のサイズ
   * @param value 要素に代入する値
   */
  assign(v, P) {
    this._size < v && this.prepareCapacity(v);
    for (let a = 0; a < v; a++)
      this._ptr[a] = P;
    this._size = v;
  }
  /**
   * サイズ変更
   */
  resize(v, P = null) {
    this.updateSize(v, P, !0);
  }
  /**
   * サイズ変更
   */
  updateSize(v, P = null, e = !0) {
    if (this._size < v)
      if (this.prepareCapacity(v), e)
        for (let i = this._size; i < v; i++)
          typeof P == "function" ? this._ptr[i] = JSON.parse(JSON.stringify(new P())) : this._ptr[i] = P;
      else
        for (let i = this._size; i < v; i++)
          this._ptr[i] = P;
    else {
      const i = this._size - v;
      this._ptr.splice(this._size - i, i);
    }
    this._size = v;
  }
  /**
   * コンテナにコンテナ要素を挿入する
   * @param position 挿入する位置
   * @param begin 挿入するコンテナの開始位置
   * @param end 挿入するコンテナの終端位置
   */
  insert(v, P, e) {
    let a = v._index;
    const i = P._index, b = e._index, n = b - i;
    this.prepareCapacity(this._size + n);
    const c = this._size - a;
    if (c > 0)
      for (let g = 0; g < c; g++)
        this._ptr.splice(a + g, 0, null);
    for (let g = i; g < b; g++, a++)
      this._ptr[a] = P._vector._ptr[g];
    this._size = this._size + n;
  }
  /**
   * コンテナからインデックスで指定した要素を削除する
   * @param index インデックス値
   * @return true 削除実行
   * @return false 削除範囲外
   */
  remove(v) {
    return v < 0 || this._size <= v ? !1 : (this._ptr.splice(v, 1), --this._size, !0);
  }
  /**
   * コンテナから要素を削除して他の要素をシフトする
   * @param ite 削除する要素
   */
  erase(v) {
    const P = v._index;
    return P < 0 || this._size <= P ? v : (this._ptr.splice(P, 1), --this._size, new cv(this, P));
  }
  /**
   * コンテナのキャパシティを確保する
   * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない.
   */
  prepareCapacity(v) {
    v > this._capacity && (this._capacity == 0 ? (this._ptr = new Array(v), this._capacity = v) : (this._ptr.length = v, this._capacity = v));
  }
  /**
   * コンテナの先頭要素を返す
   */
  begin() {
    return this._size == 0 ? this.end() : new cv(this, 0);
  }
  /**
   * コンテナの終端要素を返す
   */
  end() {
    return new cv(this, this._size);
  }
  getOffset(v) {
    const P = new o();
    return P._ptr = this.get(v), P._size = this.get(v).length, P._capacity = this.get(v).length, P;
  }
}
o.DefaultSize = 10;
let cv = class Jv {
  /**
   * コンストラクタ
   */
  constructor(v, P) {
    this._vector = v ?? null, this._index = P ?? 0;
  }
  /**
   * 代入
   */
  set(v) {
    return this._index = v._index, this._vector = v._vector, this;
  }
  /**
   * 前置き++演算
   */
  preIncrement() {
    return ++this._index, this;
  }
  /**
   * 前置き--演算
   */
  preDecrement() {
    return --this._index, this;
  }
  /**
   * 後置き++演算子
   */
  increment() {
    return new Jv(this._vector, this._index++);
  }
  /**
   * 後置き--演算子
   */
  decrement() {
    return new Jv(this._vector, this._index--);
  }
  /**
   * ptr
   */
  ptr() {
    return this._vector._ptr[this._index];
  }
  /**
   * =演算子のオーバーロード
   */
  substitution(v) {
    return this._index = v._index, this._vector = v._vector, this;
  }
  /**
   * !=演算子のオーバーロード
   */
  notEqual(v) {
    return this._index != v._index || this._vector != v._vector;
  }
};
var Wv;
(function(r) {
  r.csmVector = o, r.iterator = cv;
})(Wv || (Wv = {}));
class Q {
  /**
   * 文字列を後方に追加する
   *
   * @param c 追加する文字列
   * @return 更新された文字列
   */
  append(v, P) {
    return this.s += P !== void 0 ? v.substr(0, P) : v, this;
  }
  /**
   * 文字サイズを拡張して文字を埋める
   * @param length    拡張する文字数
   * @param v         埋める文字
   * @return 更新された文字列
   */
  expansion(v, P) {
    for (let e = 0; e < v; e++)
      this.append(P);
    return this;
  }
  /**
   * 文字列の長さをバイト数で取得する
   */
  getBytes() {
    return encodeURIComponent(this.s).replace(/%../g, "x").length;
  }
  /**
   * 文字列の長さを返す
   */
  getLength() {
    return this.s.length;
  }
  /**
   * 文字列比較 <
   * @param s 比較する文字列
   * @return true:    比較する文字列より小さい
   * @return false:   比較する文字列より大きい
   */
  isLess(v) {
    return this.s < v.s;
  }
  /**
   * 文字列比較 >
   * @param s 比較する文字列
   * @return true:    比較する文字列より大きい
   * @return false:   比較する文字列より小さい
   */
  isGreat(v) {
    return this.s > v.s;
  }
  /**
   * 文字列比較 ==
   * @param s 比較する文字列
   * @return true:    比較する文字列と等しい
   * @return false:   比較する文字列と異なる
   */
  isEqual(v) {
    return this.s == v;
  }
  /**
   * 文字列が空かどうか
   * @return true: 空の文字列
   * @return false: 値が設定されている
   */
  isEmpty() {
    return this.s.length == 0;
  }
  /**
   * 引数付きコンストラクタ
   */
  constructor(v) {
    this.s = v;
  }
}
var Ov;
(function(r) {
  r.csmString = Q;
})(Ov || (Ov = {}));
class F {
  /**
   * 内部で使用するCubismIdクラス生成メソッド
   *
   * @param id ID文字列
   * @returns CubismId
   * @note 指定したID文字列からCubismIdを取得する際は
   *       CubismIdManager().getId(id)を使用してください
   */
  static createIdInternal(v) {
    return new F(v);
  }
  /**
   * ID名を取得する
   */
  getString() {
    return this._id;
  }
  /**
   * idを比較
   * @param c 比較するid
   * @return 同じならばtrue,異なっていればfalseを返す
   */
  isEqual(v) {
    return typeof v == "string" ? this._id.isEqual(v) : v instanceof Q ? this._id.isEqual(v.s) : v instanceof F ? this._id.isEqual(v._id.s) : !1;
  }
  /**
   * idを比較
   * @param c 比較するid
   * @return 同じならばtrue,異なっていればfalseを返す
   */
  isNotEqual(v) {
    return typeof v == "string" ? !this._id.isEqual(v) : v instanceof Q ? !this._id.isEqual(v.s) : v instanceof F ? !this._id.isEqual(v._id.s) : !1;
  }
  /**
   * プライベートコンストラクタ
   *
   * @note ユーザーによる生成は許可しません
   */
  constructor(v) {
    if (typeof v == "string") {
      this._id = new Q(v);
      return;
    }
    this._id = v;
  }
}
var pv;
(function(r) {
  r.CubismId = F;
})(pv || (pv = {}));
class A9 {
  /**
   * コンストラクタ
   */
  constructor() {
    this._ids = new o();
  }
  /**
   * デストラクタ相当の処理
   */
  release() {
    for (let v = 0; v < this._ids.getSize(); ++v)
      this._ids.set(v, void 0);
    this._ids = null;
  }
  /**
   * ID名をリストから登録
   *
   * @param ids ID名リスト
   * @param count IDの個数
   */
  registerIds(v) {
    for (let P = 0; P < v.length; P++)
      this.registerId(v[P]);
  }
  /**
   * ID名を登録
   *
   * @param id ID名
   */
  registerId(v) {
    let P = null;
    if (typeof v == "string") {
      if ((P = this.findId(v)) != null)
        return P;
      P = F.createIdInternal(v), this._ids.pushBack(P);
    } else
      return this.registerId(v.s);
    return P;
  }
  /**
   * ID名からIDを取得する
   *
   * @param id ID名
   */
  getId(v) {
    return this.registerId(v);
  }
  /**
   * ID名からIDの確認
   *
   * @return true 存在する
   * @return false 存在しない
   */
  isExist(v) {
    return typeof v == "string" ? this.findId(v) != null : this.isExist(v.s);
  }
  /**
   * ID名からIDを検索する。
   *
   * @param id ID名
   * @return 登録されているID。なければNULL。
   */
  findId(v) {
    for (let P = 0; P < this._ids.getSize(); ++P)
      if (this._ids.at(P).getString().isEqual(v))
        return this._ids.at(P);
    return null;
  }
}
var Yv;
(function(r) {
  r.CubismIdManager = A9;
})(Yv || (Yv = {}));
class Y {
  /**
   * コンストラクタ
   */
  constructor() {
    this._tr = new Float32Array(16), this.loadIdentity();
  }
  /**
   * 受け取った２つの行列の乗算を行う。
   *
   * @param a 行列a
   * @param b 行列b
   * @return 乗算結果の行列
   */
  static multiply(v, P, e) {
    const a = new Float32Array([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ]), i = 4;
    for (let b = 0; b < i; ++b)
      for (let n = 0; n < i; ++n)
        for (let c = 0; c < i; ++c)
          a[n + b * 4] += v[c + b * 4] * P[n + c * 4];
    for (let b = 0; b < 16; ++b)
      e[b] = a[b];
  }
  /**
   * 単位行列に初期化する
   */
  loadIdentity() {
    const v = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    this.setMatrix(v);
  }
  /**
   * 行列を設定
   *
   * @param tr 16個の浮動小数点数で表される4x4の行列
   */
  setMatrix(v) {
    for (let P = 0; P < 16; ++P)
      this._tr[P] = v[P];
  }
  /**
   * 行列を浮動小数点数の配列で取得
   *
   * @return 16個の浮動小数点数で表される4x4の行列
   */
  getArray() {
    return this._tr;
  }
  /**
   * X軸の拡大率を取得
   * @return X軸の拡大率
   */
  getScaleX() {
    return this._tr[0];
  }
  /**
   * Y軸の拡大率を取得する
   *
   * @return Y軸の拡大率
   */
  getScaleY() {
    return this._tr[5];
  }
  /**
   * X軸の移動量を取得
   * @return X軸の移動量
   */
  getTranslateX() {
    return this._tr[12];
  }
  /**
   * Y軸の移動量を取得
   * @return Y軸の移動量
   */
  getTranslateY() {
    return this._tr[13];
  }
  /**
   * X軸の値を現在の行列で計算
   *
   * @param src X軸の値
   * @return 現在の行列で計算されたX軸の値
   */
  transformX(v) {
    return this._tr[0] * v + this._tr[12];
  }
  /**
   * Y軸の値を現在の行列で計算
   *
   * @param src Y軸の値
   * @return 現在の行列で計算されたY軸の値
   */
  transformY(v) {
    return this._tr[5] * v + this._tr[13];
  }
  /**
   * X軸の値を現在の行列で逆計算
   */
  invertTransformX(v) {
    return (v - this._tr[12]) / this._tr[0];
  }
  /**
   * Y軸の値を現在の行列で逆計算
   */
  invertTransformY(v) {
    return (v - this._tr[13]) / this._tr[5];
  }
  /**
   * 現在の行列の位置を起点にして移動
   *
   * 現在の行列の位置を起点にして相対的に移動する。
   *
   * @param x X軸の移動量
   * @param y Y軸の移動量
   */
  translateRelative(v, P) {
    const e = new Float32Array([
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1,
      0,
      v,
      P,
      0,
      1
    ]);
    Y.multiply(e, this._tr, this._tr);
  }
  /**
   * 現在の行列の位置を移動
   *
   * 現在の行列の位置を指定した位置へ移動する
   *
   * @param x X軸の移動量
   * @param y y軸の移動量
   */
  translate(v, P) {
    this._tr[12] = v, this._tr[13] = P;
  }
  /**
   * 現在の行列のX軸の位置を指定した位置へ移動する
   *
   * @param x X軸の移動量
   */
  translateX(v) {
    this._tr[12] = v;
  }
  /**
   * 現在の行列のY軸の位置を指定した位置へ移動する
   *
   * @param y Y軸の移動量
   */
  translateY(v) {
    this._tr[13] = v;
  }
  /**
   * 現在の行列の拡大率を相対的に設定する
   *
   * @param x X軸の拡大率
   * @param y Y軸の拡大率
   */
  scaleRelative(v, P) {
    const e = new Float32Array([
      v,
      0,
      0,
      0,
      0,
      P,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      0,
      0,
      1
    ]);
    Y.multiply(e, this._tr, this._tr);
  }
  /**
   * 現在の行列の拡大率を指定した倍率に設定する
   *
   * @param x X軸の拡大率
   * @param y Y軸の拡大率
   */
  scale(v, P) {
    this._tr[0] = v, this._tr[5] = P;
  }
  /**
   * 引数で与えられた行列にこの行列を乗算する。
   * (引数で与えられた行列) * (この行列)
   *
   * @note 関数名と実際の計算内容に乖離があるため、今後計算順が修正される可能性があります。
   * @param m 行列
   */
  multiplyByMatrix(v) {
    Y.multiply(v.getArray(), this._tr, this._tr);
  }
  /**
   * オブジェクトのコピーを生成する
   */
  clone() {
    const v = new Y();
    for (let P = 0; P < this._tr.length; P++)
      v._tr[P] = this._tr[P];
    return v;
  }
}
var Ev;
(function(r) {
  r.CubismMatrix44 = Y;
})(Ev || (Ev = {}));
class O9 {
  /**
   * コンストラクタ
   * @param x 左端X座標
   * @param y 上端Y座標
   * @param w 幅
   * @param h 高さ
   */
  constructor(v, P, e, a) {
    this.x = v, this.y = P, this.width = e, this.height = a;
  }
  /**
   * 矩形中央のX座標を取得する
   */
  getCenterX() {
    return this.x + 0.5 * this.width;
  }
  /**
   * 矩形中央のY座標を取得する
   */
  getCenterY() {
    return this.y + 0.5 * this.height;
  }
  /**
   * 右側のX座標を取得する
   */
  getRight() {
    return this.x + this.width;
  }
  /**
   * 下端のY座標を取得する
   */
  getBottom() {
    return this.y + this.height;
  }
  /**
   * 矩形に値をセットする
   * @param r 矩形のインスタンス
   */
  setRect(v) {
    this.x = v.x, this.y = v.y, this.width = v.width, this.height = v.height;
  }
  /**
   * 矩形中央を軸にして縦横を拡縮する
   * @param w 幅方向に拡縮する量
   * @param h 高さ方向に拡縮する量
   */
  expand(v, P) {
    this.x -= v, this.y -= P, this.width += v * 2, this.height += P * 2;
  }
}
var Uv;
(function(r) {
  r.csmRect = O9;
})(Uv || (Uv = {}));
class f9 {
  /**
   * レンダラのインスタンスを生成して取得する
   *
   * @return レンダラのインスタンス
   */
  static create() {
    return null;
  }
  /**
   * レンダラのインスタンスを解放する
   */
  static delete(v) {
  }
  /**
   * レンダラの初期化処理を実行する
   * 引数に渡したモデルからレンダラの初期化処理に必要な情報を取り出すことができる
   * @param model モデルのインスタンス
   */
  initialize(v) {
    this._model = v;
  }
  /**
   * モデルを描画する
   */
  drawModel() {
    this.getModel() != null && (this.saveProfile(), this.doDrawModel(), this.restoreProfile());
  }
  /**
   * Model-View-Projection 行列をセットする
   * 配列は複製されるので、元の配列は外で破棄して良い
   * @param matrix44 Model-View-Projection 行列
   */
  setMvpMatrix(v) {
    this._mvpMatrix4x4.setMatrix(v.getArray());
  }
  /**
   * Model-View-Projection 行列を取得する
   * @return Model-View-Projection 行列
   */
  getMvpMatrix() {
    return this._mvpMatrix4x4;
  }
  /**
   * モデルの色をセットする
   * 各色0.0~1.0の間で指定する（1.0が標準の状態）
   * @param red 赤チャンネルの値
   * @param green 緑チャンネルの値
   * @param blue 青チャンネルの値
   * @param alpha αチャンネルの値
   */
  setModelColor(v, P, e, a) {
    v < 0 ? v = 0 : v > 1 && (v = 1), P < 0 ? P = 0 : P > 1 && (P = 1), e < 0 ? e = 0 : e > 1 && (e = 1), a < 0 ? a = 0 : a > 1 && (a = 1), this._modelColor.r = v, this._modelColor.g = P, this._modelColor.b = e, this._modelColor.a = a;
  }
  /**
   * モデルの色を取得する
   * 各色0.0~1.0の間で指定する(1.0が標準の状態)
   *
   * @return RGBAのカラー情報
   */
  getModelColor() {
    return JSON.parse(JSON.stringify(this._modelColor));
  }
  /**
   * 透明度を考慮したモデルの色を計算する。
   *
   * @param opacity 透明度
   *
   * @return RGBAのカラー情報
   */
  getModelColorWithOpacity(v) {
    const P = this.getModelColor();
    return P.a *= v, this.isPremultipliedAlpha() && (P.r *= P.a, P.g *= P.a, P.b *= P.a), P;
  }
  /**
   * 乗算済みαの有効・無効をセットする
   * 有効にするならtrue、無効にするならfalseをセットする
   */
  setIsPremultipliedAlpha(v) {
    this._isPremultipliedAlpha = v;
  }
  /**
   * 乗算済みαの有効・無効を取得する
   * @return true 乗算済みのα有効
   * @return false 乗算済みのα無効
   */
  isPremultipliedAlpha() {
    return this._isPremultipliedAlpha;
  }
  /**
   * カリング（片面描画）の有効・無効をセットする。
   * 有効にするならtrue、無効にするならfalseをセットする
   */
  setIsCulling(v) {
    this._isCulling = v;
  }
  /**
   * カリング（片面描画）の有効・無効を取得する。
   * @return true カリング有効
   * @return false カリング無効
   */
  isCulling() {
    return this._isCulling;
  }
  /**
   * テクスチャの異方性フィルタリングのパラメータをセットする
   * パラメータ値の影響度はレンダラの実装に依存する
   * @param n パラメータの値
   */
  setAnisotropy(v) {
    this._anisotropy = v;
  }
  /**
   * テクスチャの異方性フィルタリングのパラメータをセットする
   * @return 異方性フィルタリングのパラメータ
   */
  getAnisotropy() {
    return this._anisotropy;
  }
  /**
   * レンダリングするモデルを取得する
   * @return レンダリングするモデル
   */
  getModel() {
    return this._model;
  }
  /**
   * マスク描画の方式を変更する。
   * falseの場合、マスクを1枚のテクスチャに分割してレンダリングする（デフォルト）
   * 高速だが、マスク個数の上限が36に限定され、質も荒くなる
   * trueの場合、パーツ描画の前にその都度必要なマスクを描き直す
   * レンダリング品質は高いが描画処理負荷は増す
   * @param high 高精細マスクに切り替えるか？
   */
  useHighPrecisionMask(v) {
    this._useHighPrecisionMask = v;
  }
  /**
   * マスクの描画方式を取得する
   * @return true 高精細方式
   * @return false デフォルト
   */
  isUsingHighPrecisionMask() {
    return this._useHighPrecisionMask;
  }
  /**
   * コンストラクタ
   */
  constructor() {
    this._isCulling = !1, this._isPremultipliedAlpha = !1, this._anisotropy = 0, this._model = null, this._modelColor = new Q9(), this._useHighPrecisionMask = !1, this._mvpMatrix4x4 = new Y(), this._mvpMatrix4x4.loadIdentity();
  }
}
var Lv;
(function(r) {
  r[r.CubismBlendMode_Normal = 0] = "CubismBlendMode_Normal", r[r.CubismBlendMode_Additive = 1] = "CubismBlendMode_Additive", r[r.CubismBlendMode_Multiplicative = 2] = "CubismBlendMode_Multiplicative";
})(Lv || (Lv = {}));
class Q9 {
  /**
   * コンストラクタ
   */
  constructor(v = 1, P = 1, e = 1, a = 1) {
    this.r = v, this.g = P, this.b = e, this.a = a;
  }
}
var Gv;
(function(r) {
  r.CubismBlendMode = Lv, r.CubismRenderer = f9, r.CubismTextureColor = Q9;
})(Gv || (Gv = {}));
class j9 {
  /**
   * コンストラクタ
   * @param key Keyとしてセットする値
   * @param value Valueとしてセットする値
   */
  constructor(v, P) {
    this.first = v ?? null, this.second = P ?? null;
  }
}
class N {
  /**
   * 引数付きコンストラクタ
   * @param size 初期化時点で確保するサイズ
   */
  constructor(v) {
    v != null ? v < 1 ? (this._keyValues = [], this._dummyValue = null, this._size = 0) : (this._keyValues = new Array(v), this._size = v) : (this._keyValues = [], this._dummyValue = null, this._size = 0);
  }
  /**
   * デストラクタ
   */
  release() {
    this.clear();
  }
  /**
   * キーを追加する
   * @param key 新たに追加するキー
   */
  appendKey(v) {
    this.prepareCapacity(this._size + 1, !1), this._keyValues[this._size] = new j9(v), this._size += 1;
  }
  /**
   * 添字演算子[key]のオーバーロード(get)
   * @param key 添字から特定されるValue値
   */
  getValue(v) {
    let P = -1;
    for (let e = 0; e < this._size; e++)
      if (this._keyValues[e].first == v) {
        P = e;
        break;
      }
    return P >= 0 ? this._keyValues[P].second : (this.appendKey(v), this._keyValues[this._size - 1].second);
  }
  /**
   * 添字演算子[key]のオーバーロード(set)
   * @param key 添字から特定されるValue値
   * @param value 代入するValue値
   */
  setValue(v, P) {
    let e = -1;
    for (let a = 0; a < this._size; a++)
      if (this._keyValues[a].first == v) {
        e = a;
        break;
      }
    e >= 0 ? this._keyValues[e].second = P : (this.appendKey(v), this._keyValues[this._size - 1].second = P);
  }
  /**
   * 引数で渡したKeyを持つ要素が存在するか
   * @param key 存在を確認するkey
   * @return true 引数で渡したkeyを持つ要素が存在する
   * @return false 引数で渡したkeyを持つ要素が存在しない
   */
  isExist(v) {
    for (let P = 0; P < this._size; P++)
      if (this._keyValues[P].first == v)
        return !0;
    return !1;
  }
  /**
   * keyValueのポインタを全て解放する
   */
  clear() {
    this._keyValues = void 0, this._keyValues = null, this._keyValues = [], this._size = 0;
  }
  /**
   * コンテナのサイズを取得する
   *
   * @return コンテナのサイズ
   */
  getSize() {
    return this._size;
  }
  /**
   * コンテナのキャパシティを確保する
   * @param newSize 新たなキャパシティ。引数の値が現在のサイズ未満の場合は何もしない。
   * @param fitToSize trueなら指定したサイズに合わせる。falseならサイズを2倍確保しておく。
   */
  prepareCapacity(v, P) {
    v > this._keyValues.length && (this._keyValues.length == 0 ? (!P && v < N.DefaultSize && (v = N.DefaultSize), this._keyValues.length = v) : (!P && v < this._keyValues.length * 2 && (v = this._keyValues.length * 2), this._keyValues.length = v));
  }
  /**
   * コンテナの先頭要素を返す
   */
  begin() {
    return new U(this, 0);
  }
  /**
   * コンテナの終端要素を返す
   */
  end() {
    return new U(this, this._size);
  }
  /**
   * コンテナから要素を削除する
   *
   * @param ite 削除する要素
   */
  erase(v) {
    const P = v._index;
    return P < 0 || this._size <= P ? v : (this._keyValues.splice(P, 1), --this._size, new U(this, P));
  }
  /**
   * コンテナの値を32ビット符号付き整数型でダンプする
   */
  dumpAsInt() {
    for (let v = 0; v < this._size; v++)
      Iv("{0} ,", this._keyValues[v]), Iv(`
`);
  }
}
N.DefaultSize = 10;
class U {
  /**
   * コンストラクタ
   */
  constructor(v, P) {
    this._map = v ?? new N(), this._index = P ?? 0;
  }
  /**
   * =演算子のオーバーロード
   */
  set(v) {
    return this._index = v._index, this._map = v._map, this;
  }
  /**
   * 前置き++演算子のオーバーロード
   */
  preIncrement() {
    return ++this._index, this;
  }
  /**
   * 前置き--演算子のオーバーロード
   */
  preDecrement() {
    return --this._index, this;
  }
  /**
   * 後置き++演算子のオーバーロード
   */
  increment() {
    return new U(this._map, this._index++);
  }
  /**
   * 後置き--演算子のオーバーロード
   */
  decrement() {
    const v = new U(this._map, this._index);
    return this._map = v._map, this._index = v._index, this;
  }
  /**
   * *演算子のオーバーロード
   */
  ptr() {
    return this._map._keyValues[this._index];
  }
  /**
   * !=演算
   */
  notEqual(v) {
    return this._index != v._index || this._map != v._map;
  }
}
var xv;
(function(r) {
  r.csmMap = N, r.csmPair = j9, r.iterator = U;
})(xv || (xv = {}));
class sv {
  static parseJsonObject(v, P) {
    return Object.keys(v).forEach((e) => {
      if (typeof v[e] == "boolean") {
        const a = !!v[e];
        P.put(e, new J(a));
      } else if (typeof v[e] == "string") {
        const a = String(v[e]);
        P.put(e, new $(a));
      } else if (typeof v[e] == "number") {
        const a = Number(v[e]);
        P.put(e, new uv(a));
      } else v[e] instanceof Array ? P.put(e, sv.parseJsonArray(v[e])) : v[e] instanceof Object ? P.put(e, sv.parseJsonObject(v[e], new H())) : v[e] == null ? P.put(e, new X()) : P.put(e, v[e]);
    }), P;
  }
  static parseJsonArray(v) {
    const P = new yv();
    return Object.keys(v).forEach((e) => {
      if (typeof Number(e) == "number")
        if (typeof v[e] == "boolean") {
          const i = !!v[e];
          P.add(new J(i));
        } else if (typeof v[e] == "string") {
          const i = String(v[e]);
          P.add(new $(i));
        } else if (typeof v[e] == "number") {
          const i = Number(v[e]);
          P.add(new uv(i));
        } else v[e] instanceof Array ? P.add(this.parseJsonArray(v[e])) : v[e] instanceof Object ? P.add(this.parseJsonObject(v[e], new H())) : v[e] == null ? P.add(new X()) : P.add(v[e]);
      else if (v[e] instanceof Array)
        P.add(this.parseJsonArray(v[e]));
      else if (v[e] instanceof Object)
        P.add(this.parseJsonObject(v[e], new H()));
      else if (v[e] == null)
        P.add(new X());
      else {
        const i = Array(v[e]);
        for (let b = 0; b < i.length; b++)
          P.add(i[b]);
      }
    }), P;
  }
}
const ov = "Error: type mismatch", p9 = "Error: index out of bounds";
let z = class C {
  /**
   * コンストラクタ
   */
  constructor() {
  }
  /**
   * 要素を文字列型で返す(string)
   */
  getRawString(v, P) {
    return this.getString(v, P);
  }
  /**
   * 要素を数値型で返す(number)
   */
  toInt(v = 0) {
    return v;
  }
  /**
   * 要素を数値型で返す(number)
   */
  toFloat(v = 0) {
    return v;
  }
  /**
   * 要素を真偽値で返す(boolean)
   */
  toBoolean(v = !1) {
    return v;
  }
  /**
   * サイズを返す
   */
  getSize() {
    return 0;
  }
  /**
   * 要素を配列で返す(Value[])
   */
  getArray(v = null) {
    return v;
  }
  /**
   * 要素をコンテナで返す(array)
   */
  getVector(v = new o()) {
    return v;
  }
  /**
   * 要素をマップで返す(csmMap<csmString, Value>)
   */
  getMap(v) {
    return v;
  }
  /**
   * 添字演算子[index]
   */
  getValueByIndex(v) {
    return C.errorValue.setErrorNotForClientCall(ov);
  }
  /**
   * 添字演算子[string | csmString]
   */
  getValueByString(v) {
    return C.nullValue.setErrorNotForClientCall(ov);
  }
  /**
   * マップのキー一覧をコンテナで返す
   *
   * @return マップのキーの一覧
   */
  getKeys() {
    return C.dummyKeys;
  }
  /**
   * Valueの種類がエラー値ならtrue
   */
  isError() {
    return !1;
  }
  /**
   * Valueの種類がnullならtrue
   */
  isNull() {
    return !1;
  }
  /**
   * Valueの種類が真偽値ならtrue
   */
  isBool() {
    return !1;
  }
  /**
   * Valueの種類が数値型ならtrue
   */
  isFloat() {
    return !1;
  }
  /**
   * Valueの種類が文字列ならtrue
   */
  isString() {
    return !1;
  }
  /**
   * Valueの種類が配列ならtrue
   */
  isArray() {
    return !1;
  }
  /**
   * Valueの種類がマップ型ならtrue
   */
  isMap() {
    return !1;
  }
  equals(v) {
    return !1;
  }
  /**
   * Valueの値が静的ならtrue、静的なら解放しない
   */
  isStatic() {
    return !1;
  }
  /**
   * Valueにエラー値をセットする
   */
  setErrorNotForClientCall(v) {
    return Pv.errorValue;
  }
  /**
   * 初期化用メソッド
   */
  static staticInitializeNotForClientCall() {
    J.trueValue = new J(!0), J.falseValue = new J(!1), C.errorValue = new Pv("ERROR", !0), C.nullValue = new X(), C.dummyKeys = new o();
  }
  /**
   * リリース用メソッド
   */
  static staticReleaseNotForClientCall() {
    J.trueValue = null, J.falseValue = null, C.errorValue = null, C.nullValue = null, C.dummyKeys = null;
  }
};
class G {
  /**
   * コンストラクタ
   */
  constructor(v, P) {
    this._parseCallback = sv.parseJsonObject, this._error = null, this._lineCount = 0, this._root = null, v != null && this.parseBytes(v, P, this._parseCallback);
  }
  /**
   * バイトデータから直接ロードしてパースする
   *
   * @param buffer バッファ
   * @param size バッファサイズ
   * @return CubismJsonクラスのインスタンス。失敗したらNULL
   */
  static create(v, P) {
    const e = new G();
    return e.parseBytes(v, P, e._parseCallback) ? e : (G.delete(e), null);
  }
  /**
   * パースしたJSONオブジェクトの解放処理
   *
   * @param instance CubismJsonクラスのインスタンス
   */
  static delete(v) {
  }
  /**
   * パースしたJSONのルート要素を返す
   */
  getRoot() {
    return this._root;
  }
  /**
   *  UnicodeのバイナリをStringに変換
   *
   * @param buffer 変換するバイナリデータ
   * @return 変換後の文字列
   */
  static arrayBufferToString(v) {
    const P = new Uint8Array(v);
    let e = "";
    for (let a = 0, i = P.length; a < i; ++a)
      e += "%" + this.pad(P[a].toString(16));
    return e = decodeURIComponent(e), e;
  }
  /**
   * エンコード、パディング
   */
  static pad(v) {
    return v.length < 2 ? "0" + v : v;
  }
  /**
   * JSONのパースを実行する
   * @param buffer    パース対象のデータバイト
   * @param size      データバイトのサイズ
   * return true : 成功
   * return false: 失敗
   */
  parseBytes(v, P, e) {
    const a = new Array(1), i = G.arrayBufferToString(v);
    if (e == null ? this._root = this.parseValue(i, P, 0, a) : this._root = e(JSON.parse(i), new H()), this._error) {
      let b = "\0";
      return b = "Json parse error : @line " + (this._lineCount + 1) + `
`, this._root = new $(b), f("{0}", this._root.getRawString()), !1;
    } else if (this._root == null)
      return this._root = new Pv(new Q(this._error), !1), !1;
    return !0;
  }
  /**
   * パース時のエラー値を返す
   */
  getParseError() {
    return this._error;
  }
  /**
   * ルート要素の次の要素がファイルの終端だったらtrueを返す
   */
  checkEndOfFile() {
    return this._root.getArray()[1].equals("EOF");
  }
  /**
   * JSONエレメントからValue(float,String,Value*,Array,null,true,false)をパースする
   * エレメントの書式に応じて内部でParseString(), ParseObject(), ParseArray()を呼ぶ
   *
   * @param   buffer      JSONエレメントのバッファ
   * @param   length      パースする長さ
   * @param   begin       パースを開始する位置
   * @param   outEndPos   パース終了時の位置
   * @return      パースから取得したValueオブジェクト
   */
  parseValue(v, P, e, a) {
    if (this._error)
      return null;
    let i = null, b = e, n;
    for (; b < P; b++)
      switch (v[b]) {
        case "-":
        case ".":
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9": {
          const g = new Array(1);
          return n = Y9(v.slice(b), g), a[0] = v.indexOf(g[0]), new uv(n);
        }
        case '"':
          return new $(this.parseString(v, P, b + 1, a));
        case "[":
          return i = this.parseArray(v, P, b + 1, a), i;
        case "{":
          return i = this.parseObject(v, P, b + 1, a), i;
        case "n":
          return b + 3 < P ? (i = new X(), a[0] = b + 4) : this._error = "parse null", i;
        case "t":
          return b + 3 < P ? (i = J.trueValue, a[0] = b + 4) : this._error = "parse true", i;
        case "f":
          return b + 4 < P ? (i = J.falseValue, a[0] = b + 5) : this._error = "illegal ',' position", i;
        case ",":
          return this._error = "illegal ',' position", null;
        case "]":
          return a[0] = b, null;
        case `
`:
          this._lineCount++;
      }
    return this._error = "illegal end of value", null;
  }
  /**
   * 次の「"」までの文字列をパースする。
   *
   * @param   string  ->  パース対象の文字列
   * @param   length  ->  パースする長さ
   * @param   begin   ->  パースを開始する位置
   * @param  outEndPos   ->  パース終了時の位置
   * @return      パースした文F字列要素
   */
  parseString(v, P, e, a) {
    if (this._error)
      return null;
    if (!v)
      return this._error = "string is null", null;
    let i = e, b, n;
    const c = new Q("");
    let g = e;
    for (; i < P; i++)
      switch (b = v[i], b) {
        case '"':
          return a[0] = i + 1, c.append(v.slice(g), i - g), c.s;
        case "//":
          if (i++, i - 1 > g && c.append(v.slice(g), i - g), g = i + 1, i < P)
            switch (n = v[i], n) {
              case "\\":
                c.expansion(1, "\\");
                break;
              case '"':
                c.expansion(1, '"');
                break;
              case "/":
                c.expansion(1, "/");
                break;
              case "b":
                c.expansion(1, "\b");
                break;
              case "f":
                c.expansion(1, "\f");
                break;
              case "n":
                c.expansion(1, `
`);
                break;
              case "r":
                c.expansion(1, "\r");
                break;
              case "t":
                c.expansion(1, "	");
                break;
              case "u":
                this._error = "parse string/unicord escape not supported";
                break;
            }
          else
            this._error = "parse string/escape error";
      }
    return this._error = "parse string/illegal end", null;
  }
  /**
   * JSONのオブジェクトエレメントをパースしてValueオブジェクトを返す
   *
   * @param buffer    JSONエレメントのバッファ
   * @param length    パースする長さ
   * @param begin     パースを開始する位置
   * @param outEndPos パース終了時の位置
   * @return パースから取得したValueオブジェクト
   */
  parseObject(v, P, e, a) {
    if (this._error)
      return null;
    if (!v)
      return this._error = "buffer is null", null;
    const i = new H();
    let b = "", n = e, c = "";
    const g = Array(1);
    let s = !1;
    for (; n < P; n++) {
      v: for (; n < P; n++)
        switch (c = v[n], c) {
          case '"':
            if (b = this.parseString(v, P, n + 1, g), this._error)
              return null;
            n = g[0], s = !0;
            break v;
          case "}":
            return a[0] = n + 1, i;
          case ":":
            this._error = "illegal ':' position";
            break;
          case `
`:
            this._lineCount++;
        }
      if (!s)
        return this._error = "key not found", null;
      s = !1;
      v: for (; n < P; n++)
        switch (c = v[n], c) {
          case ":":
            s = !0, n++;
            break v;
          case "}":
            this._error = "illegal '}' position";
            break;
          case `
`:
            this._lineCount++;
        }
      if (!s)
        return this._error = "':' not found", null;
      const A = this.parseValue(v, P, n, g);
      if (this._error)
        return null;
      n = g[0], i.put(b, A);
      v: for (; n < P; n++)
        switch (c = v[n], c) {
          case ",":
            break v;
          case "}":
            return a[0] = n + 1, i;
          case `
`:
            this._lineCount++;
        }
    }
    return this._error = "illegal end of perseObject", null;
  }
  /**
   * 次の「"」までの文字列をパースする。
   * @param buffer    JSONエレメントのバッファ
   * @param length    パースする長さ
   * @param begin     パースを開始する位置
   * @param outEndPos パース終了時の位置
   * @return パースから取得したValueオブジェクト
   */
  parseArray(v, P, e, a) {
    if (this._error)
      return null;
    if (!v)
      return this._error = "buffer is null", null;
    let i = new yv(), b = e, n;
    const c = new Array(1);
    for (; b < P; b++) {
      const g = this.parseValue(v, P, b, c);
      if (this._error)
        return null;
      b = c[0], g && i.add(g);
      v: for (; b < P; b++)
        switch (n = v[b], n) {
          case ",":
            break v;
          case "]":
            return a[0] = b + 1, i;
          case `
`:
            ++this._lineCount;
        }
    }
    return i = void 0, this._error = "illegal end of parseObject", null;
  }
}
class uv extends z {
  /**
   * コンストラクタ
   */
  constructor(v) {
    super(), this._value = v;
  }
  /**
   * Valueの種類が数値型ならtrue
   */
  isFloat() {
    return !0;
  }
  /**
   * 要素を文字列で返す(csmString型)
   */
  getString(v, P) {
    const e = "\0";
    return this._value = parseFloat(e), this._stringBuffer = e, this._stringBuffer;
  }
  /**
   * 要素を数値型で返す(number)
   */
  toInt(v = 0) {
    return parseInt(this._value.toString());
  }
  /**
   * 要素を数値型で返す(number)
   */
  toFloat(v = 0) {
    return this._value;
  }
  equals(v) {
    return typeof v == "number" ? Math.round(v) ? !1 : v == this._value : !1;
  }
}
class J extends z {
  /**
   * Valueの種類が真偽値ならtrue
   */
  isBool() {
    return !0;
  }
  /**
   * 要素を真偽値で返す(boolean)
   */
  toBoolean(v = !1) {
    return this._boolValue;
  }
  /**
   * 要素を文字列で返す(csmString型)
   */
  getString(v, P) {
    return this._stringBuffer = this._boolValue ? "true" : "false", this._stringBuffer;
  }
  equals(v) {
    return typeof v == "boolean" ? v == this._boolValue : !1;
  }
  /**
   * Valueの値が静的ならtrue, 静的なら解放しない
   */
  isStatic() {
    return !0;
  }
  /**
   * 引数付きコンストラクタ
   */
  constructor(v) {
    super(), this._boolValue = v;
  }
}
class $ extends z {
  constructor(v) {
    super(), typeof v == "string" && (this._stringBuffer = v), v instanceof Q && (this._stringBuffer = v.s);
  }
  /**
   * Valueの種類が文字列ならtrue
   */
  isString() {
    return !0;
  }
  /**
   * 要素を文字列で返す(csmString型)
   */
  getString(v, P) {
    return this._stringBuffer;
  }
  equals(v) {
    return typeof v == "string" ? this._stringBuffer == v : v instanceof Q ? this._stringBuffer == v.s : !1;
  }
}
class Pv extends $ {
  /**
   * Valueの値が静的ならtrue、静的なら解放しない
   */
  isStatic() {
    return this._isStatic;
  }
  /**
   * エラー情報をセットする
   */
  setErrorNotForClientCall(v) {
    return this._stringBuffer = v, this;
  }
  /**
   * 引数付きコンストラクタ
   */
  constructor(v, P) {
    typeof v == "string" ? super(v) : super(v), this._isStatic = P;
  }
  /**
   * Valueの種類がエラー値ならtrue
   */
  isError() {
    return !0;
  }
}
class X extends z {
  /**
   * Valueの種類がNULL値ならtrue
   */
  isNull() {
    return !0;
  }
  /**
   * 要素を文字列で返す(csmString型)
   */
  getString(v, P) {
    return this._stringBuffer;
  }
  /**
   * Valueの値が静的ならtrue, 静的なら解放しない
   */
  isStatic() {
    return !0;
  }
  /**
   * Valueにエラー値をセットする
   */
  setErrorNotForClientCall(v) {
    return this._stringBuffer = v, Pv.nullValue;
  }
  /**
   * コンストラクタ
   */
  constructor() {
    super(), this._stringBuffer = "NullValue";
  }
}
class yv extends z {
  /**
   * コンストラクタ
   */
  constructor() {
    super(), this._array = new o();
  }
  /**
   * デストラクタ相当の処理
   */
  release() {
    for (let v = this._array.begin(); v.notEqual(this._array.end()); v.preIncrement()) {
      let P = v.ptr();
      P && !P.isStatic() && (P = void 0, P = null);
    }
  }
  /**
   * Valueの種類が配列ならtrue
   */
  isArray() {
    return !0;
  }
  /**
   * 添字演算子[index]
   */
  getValueByIndex(v) {
    if (v < 0 || this._array.getSize() <= v)
      return z.errorValue.setErrorNotForClientCall(p9);
    const P = this._array.at(v);
    return P ?? z.nullValue;
  }
  /**
   * 添字演算子[string | csmString]
   */
  getValueByString(v) {
    return z.errorValue.setErrorNotForClientCall(ov);
  }
  /**
   * 要素を文字列で返す(csmString型)
   */
  getString(v, P) {
    const e = P + `[
`;
    for (let a = this._array.begin(); a.notEqual(this._array.end()); a.increment()) {
      const i = a.ptr();
      this._stringBuffer += P + "" + i.getString(P + " ") + `
`;
    }
    return this._stringBuffer = e + P + `]
`, this._stringBuffer;
  }
  /**
   * 配列要素を追加する
   * @param v 追加する要素
   */
  add(v) {
    this._array.pushBack(v);
  }
  /**
   * 要素をコンテナで返す(csmVector<Value>)
   */
  getVector(v = null) {
    return this._array;
  }
  /**
   * 要素の数を返す
   */
  getSize() {
    return this._array.getSize();
  }
}
class H extends z {
  /**
   * コンストラクタ
   */
  constructor() {
    super(), this._map = new N();
  }
  /**
   * デストラクタ相当の処理
   */
  release() {
    const v = this._map.begin();
    for (; v.notEqual(this._map.end()); ) {
      let P = v.ptr().second;
      P && !P.isStatic() && (P = void 0, P = null), v.preIncrement();
    }
  }
  /**
   * Valueの値がMap型ならtrue
   */
  isMap() {
    return !0;
  }
  /**
   * 添字演算子[string | csmString]
   */
  getValueByString(v) {
    if (v instanceof Q) {
      const P = this._map.getValue(v.s);
      return P ?? z.nullValue;
    }
    for (let P = this._map.begin(); P.notEqual(this._map.end()); P.preIncrement())
      if (P.ptr().first == v)
        return P.ptr().second == null ? z.nullValue : P.ptr().second;
    return z.nullValue;
  }
  /**
   * 添字演算子[index]
   */
  getValueByIndex(v) {
    return z.errorValue.setErrorNotForClientCall(ov);
  }
  /**
   * 要素を文字列で返す(csmString型)
   */
  getString(v, P) {
    this._stringBuffer = P + `{
`;
    const e = this._map.begin();
    for (; e.notEqual(this._map.end()); ) {
      const a = e.ptr().first, i = e.ptr().second;
      this._stringBuffer += P + " " + a + " : " + i.getString(P + "   ") + ` 
`, e.preIncrement();
    }
    return this._stringBuffer += P + `}
`, this._stringBuffer;
  }
  /**
   * 要素をMap型で返す
   */
  getMap(v) {
    return this._map;
  }
  /**
   * Mapに要素を追加する
   */
  put(v, P) {
    this._map.setValue(v, P);
  }
  /**
   * Mapからキーのリストを取得する
   */
  getKeys() {
    if (!this._keys) {
      this._keys = new o();
      const v = this._map.begin();
      for (; v.notEqual(this._map.end()); ) {
        const P = v.ptr().first;
        this._keys.pushBack(P), v.preIncrement();
      }
    }
    return this._keys;
  }
  /**
   * Mapの要素数を取得する
   */
  getSize() {
    return this._keys.getSize();
  }
}
var qv;
(function(r) {
  r.CubismJson = G, r.JsonArray = yv, r.JsonBoolean = J, r.JsonError = Pv, r.JsonFloat = uv, r.JsonMap = H, r.JsonNullvalue = X, r.JsonString = $, r.Value = z;
})(qv || (qv = {}));
function Y9(r, v) {
  let P = 0;
  for (let a = 1; ; a++) {
    const i = r.slice(a - 1, a);
    if (i == "e" || i == "-" || i == "E")
      continue;
    const b = r.substring(0, a), n = Number(b);
    if (isNaN(n))
      break;
    P = a;
  }
  let e = parseFloat(r);
  return isNaN(e) && (e = NaN), v[0] = r.slice(P), e;
}
let l = !1, q = !1, B = null, vv = null;
const E9 = Object.freeze({
  vertexOffset: 0,
  // メッシュ頂点のオフセット値
  vertexStep: 2
  // メッシュ頂点のステップ値
});
function U9(r) {
  r && (r = void 0);
}
class hv {
  /**
   * Cubism FrameworkのAPIを使用可能にする。
   *  APIを実行する前に必ずこの関数を実行すること。
   *  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
   *
   * @param    option      Optionクラスのインスタンス
   *
   * @return   準備処理が完了したらtrueが返ります。
   */
  static startUp(v = null) {
    if (l)
      return f("CubismFramework.startUp() is already done."), l;
    if (B = v, B != null && Live2DCubismCore.Logging.csmSetLogFunction(B.logFunction), l = !0, l) {
      const P = Live2DCubismCore.Version.csmGetVersion(), e = (P & 4278190080) >> 24, a = (P & 16711680) >> 16, i = P & 65535, b = P;
      f("Live2D Cubism Core version: {0}.{1}.{2} ({3})", ("00" + e).slice(-2), ("00" + a).slice(-2), ("0000" + i).slice(-4), b);
    }
    return f("CubismFramework.startUp() is complete."), l;
  }
  /**
   * StartUp()で初期化したCubismFrameworkの各パラメータをクリアします。
   * Dispose()したCubismFrameworkを再利用する際に利用してください。
   */
  static cleanUp() {
    l = !1, q = !1, B = null, vv = null;
  }
  /**
   * Cubism Framework内のリソースを初期化してモデルを表示可能な状態にします。<br>
   *     再度Initialize()するには先にDispose()を実行する必要があります。
   *
   * @param memorySize 初期化時メモリ量 [byte(s)]
   *    複数モデル表示時などにモデルが更新されない際に使用してください。
   *    指定する際は必ず1024*1024*16 byte(16MB)以上の値を指定してください。
   *    それ以外はすべて1024*1024*16 byteに丸めます。
   */
  static initialize(v = 0) {
    if (Av(l), !l) {
      j("CubismFramework is not started.");
      return;
    }
    if (q) {
      j("CubismFramework.initialize() skipped, already initialized.");
      return;
    }
    z.staticInitializeNotForClientCall(), vv = new A9(), Live2DCubismCore.Memory.initializeAmountOfMemory(v), q = !0, f("CubismFramework.initialize() is complete.");
  }
  /**
   * Cubism Framework内の全てのリソースを解放します。
   *      ただし、外部で確保されたリソースについては解放しません。
   *      外部で適切に破棄する必要があります。
   */
  static dispose() {
    if (Av(l), !l) {
      j("CubismFramework is not started.");
      return;
    }
    if (!q) {
      j("CubismFramework.dispose() skipped, not initialized.");
      return;
    }
    z.staticReleaseNotForClientCall(), vv.release(), vv = null, f9.staticRelease(), q = !1, f("CubismFramework.dispose() is complete.");
  }
  /**
   * Cubism FrameworkのAPIを使用する準備が完了したかどうか
   * @return APIを使用する準備が完了していればtrueが返ります。
   */
  static isStarted() {
    return l;
  }
  /**
   * Cubism Frameworkのリソース初期化がすでに行われているかどうか
   * @return リソース確保が完了していればtrueが返ります
   */
  static isInitialized() {
    return q;
  }
  /**
   * Core APIにバインドしたログ関数を実行する
   *
   * @praram message ログメッセージ
   */
  static coreLogFunction(v) {
    Live2DCubismCore.Logging.csmGetLogFunction() && Live2DCubismCore.Logging.csmGetLogFunction()(v);
  }
  /**
   * 現在のログ出力レベル設定の値を返す。
   *
   * @return  現在のログ出力レベル設定の値
   */
  static getLoggingLevel() {
    return B != null ? B.loggingLevel : E.LogLevel_Off;
  }
  /**
   * IDマネージャのインスタンスを取得する
   * @return CubismManagerクラスのインスタンス
   */
  static getIdManager() {
    return vv;
  }
  /**
   * 静的クラスとして使用する
   * インスタンス化させない
   */
  constructor() {
  }
}
var E;
(function(r) {
  r[r.LogLevel_Verbose = 0] = "LogLevel_Verbose", r[r.LogLevel_Debug = 1] = "LogLevel_Debug", r[r.LogLevel_Info = 2] = "LogLevel_Info", r[r.LogLevel_Warning = 3] = "LogLevel_Warning", r[r.LogLevel_Error = 4] = "LogLevel_Error", r[r.LogLevel_Off = 5] = "LogLevel_Off";
})(E || (E = {}));
var Bv;
(function(r) {
  r.Constant = E9, r.csmDelete = U9, r.CubismFramework = hv;
})(Bv || (Bv = {}));
const G9 = (r, v, P) => {
  z9.print(r, "[CSM]" + v, P);
}, tv = (r, v, P) => {
  G9(r, v + `
`, P);
}, Av = (r) => {
  console.assert(r);
};
let Iv, f, j, D;
Iv = (r, ...v) => {
  tv(E.LogLevel_Debug, "[D]" + r, v);
}, f = (r, ...v) => {
  tv(E.LogLevel_Info, "[I]" + r, v);
}, j = (r, ...v) => {
  tv(E.LogLevel_Warning, "[W]" + r, v);
}, D = (r, ...v) => {
  tv(E.LogLevel_Error, "[E]" + r, v);
};
class z9 {
  /**
   * ログを出力する。第一引数にログレベルを設定する。
   * CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
   *
   * @param logLevel ログレベルの設定
   * @param format 書式付き文字列
   * @param args 可変長引数
   */
  static print(v, P, e) {
    if (v < hv.getLoggingLevel())
      return;
    const a = hv.coreLogFunction;
    if (!a)
      return;
    const i = P.replace(/\{(\d+)\}/g, (b, n) => e[n]);
    a(i);
  }
  /**
   * データから指定した長さだけダンプ出力する。
   * CubismFramework.initialize()時にオプションで設定されたログ出力レベルを下回る場合はログに出さない。
   *
   * @param logLevel ログレベルの設定
   * @param data ダンプするデータ
   * @param length ダンプする長さ
   */
  static dumpBytes(v, P, e) {
    for (let a = 0; a < e; a++)
      a % 16 == 0 && a > 0 ? this.print(v, `
`) : a % 8 == 0 && a > 0 && this.print(v, "  "), this.print(v, "{0} ", [P[a] & 255]);
    this.print(v, `
`);
  }
  /**
   * private コンストラクタ
   */
  constructor() {
  }
}
var Kv;
(function(r) {
  r.CubismDebug = z9;
})(Kv || (Kv = {}));
class w {
  /**
   * コンストラクタ
   */
  constructor(v, P) {
    this.x = v, this.y = P, this.x = v ?? 0, this.y = P ?? 0;
  }
  /**
   * ベクトルの加算
   *
   * @param vector2 加算するベクトル値
   * @return 加算結果 ベクトル値
   */
  add(v) {
    const P = new w(0, 0);
    return P.x = this.x + v.x, P.y = this.y + v.y, P;
  }
  /**
   * ベクトルの減算
   *
   * @param vector2 減算するベクトル値
   * @return 減算結果 ベクトル値
   */
  substract(v) {
    const P = new w(0, 0);
    return P.x = this.x - v.x, P.y = this.y - v.y, P;
  }
  /**
   * ベクトルの乗算
   *
   * @param vector2 乗算するベクトル値
   * @return 乗算結果 ベクトル値
   */
  multiply(v) {
    const P = new w(0, 0);
    return P.x = this.x * v.x, P.y = this.y * v.y, P;
  }
  /**
   * ベクトルの乗算(スカラー)
   *
   * @param scalar 乗算するスカラー値
   * @return 乗算結果 ベクトル値
   */
  multiplyByScaler(v) {
    return this.multiply(new w(v, v));
  }
  /**
   * ベクトルの除算
   *
   * @param vector2 除算するベクトル値
   * @return 除算結果 ベクトル値
   */
  division(v) {
    const P = new w(0, 0);
    return P.x = this.x / v.x, P.y = this.y / v.y, P;
  }
  /**
   * ベクトルの除算(スカラー)
   *
   * @param scalar 除算するスカラー値
   * @return 除算結果 ベクトル値
   */
  divisionByScalar(v) {
    return this.division(new w(v, v));
  }
  /**
   * ベクトルの長さを取得する
   *
   * @return ベクトルの長さ
   */
  getLength() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  /**
   * ベクトルの距離の取得
   *
   * @param a 点
   * @return ベクトルの距離
   */
  getDistanceWith(v) {
    return Math.sqrt((this.x - v.x) * (this.x - v.x) + (this.y - v.y) * (this.y - v.y));
  }
  /**
   * ドット積の計算
   *
   * @param a 値
   * @return 結果
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  /**
   * 正規化の適用
   */
  normalize() {
    const v = Math.pow(this.x * this.x + this.y * this.y, 0.5);
    this.x = this.x / v, this.y = this.y / v;
  }
  /**
   * 等しさの確認（等しいか？）
   *
   * 値が等しいか？
   *
   * @param rhs 確認する値
   * @return true 値は等しい
   * @return false 値は等しくない
   */
  isEqual(v) {
    return this.x == v.x && this.y == v.y;
  }
  /**
   * 等しさの確認（等しくないか？）
   *
   * 値が等しくないか？
   *
   * @param rhs 確認する値
   * @return true 値は等しくない
   * @return false 値は等しい
   */
  isNotEqual(v) {
    return !this.isEqual(v);
  }
}
var Rv;
(function(r) {
  r.CubismVector2 = w;
})(Rv || (Rv = {}));
class x {
  /**
   * 第一引数の値を最小値と最大値の範囲に収めた値を返す
   *
   * @param value 収められる値
   * @param min   範囲の最小値
   * @param max   範囲の最大値
   * @return 最小値と最大値の範囲に収めた値
   */
  static range(v, P, e) {
    return v < P ? v = P : v > e && (v = e), v;
  }
  /**
   * サイン関数の値を求める
   *
   * @param x 角度値（ラジアン）
   * @return サイン関数sin(x)の値
   */
  static sin(v) {
    return Math.sin(v);
  }
  /**
   * コサイン関数の値を求める
   *
   * @param x 角度値(ラジアン)
   * @return コサイン関数cos(x)の値
   */
  static cos(v) {
    return Math.cos(v);
  }
  /**
   * 値の絶対値を求める
   *
   * @param x 絶対値を求める値
   * @return 値の絶対値
   */
  static abs(v) {
    return Math.abs(v);
  }
  /**
   * 平方根(ルート)を求める
   * @param x -> 平方根を求める値
   * @return 値の平方根
   */
  static sqrt(v) {
    return Math.sqrt(v);
  }
  /**
   * 立方根を求める
   * @param x -> 立方根を求める値
   * @return 値の立方根
   */
  static cbrt(v) {
    if (v === 0)
      return v;
    let P = v;
    const e = P < 0;
    e && (P = -P);
    let a;
    return P === 1 / 0 ? a = 1 / 0 : (a = Math.exp(Math.log(P) / 3), a = (P / (a * a) + 2 * a) / 3), e ? -a : a;
  }
  /**
   * イージング処理されたサインを求める
   * フェードイン・アウト時のイージングに利用できる
   *
   * @param value イージングを行う値
   * @return イージング処理されたサイン値
   */
  static getEasingSine(v) {
    return v < 0 ? 0 : v > 1 ? 1 : 0.5 - 0.5 * this.cos(v * Math.PI);
  }
  /**
   * 大きい方の値を返す
   *
   * @param left 左辺の値
   * @param right 右辺の値
   * @return 大きい方の値
   */
  static max(v, P) {
    return v > P ? v : P;
  }
  /**
   * 小さい方の値を返す
   *
   * @param left  左辺の値
   * @param right 右辺の値
   * @return 小さい方の値
   */
  static min(v, P) {
    return v > P ? P : v;
  }
  /**
   * 角度値をラジアン値に変換する
   *
   * @param degrees   角度値
   * @return 角度値から変換したラジアン値
   */
  static degreesToRadian(v) {
    return v / 180 * Math.PI;
  }
  /**
   * ラジアン値を角度値に変換する
   *
   * @param radian    ラジアン値
   * @return ラジアン値から変換した角度値
   */
  static radianToDegrees(v) {
    return v * 180 / Math.PI;
  }
  /**
   * ２つのベクトルからラジアン値を求める
   *
   * @param from  始点ベクトル
   * @param to    終点ベクトル
   * @return ラジアン値から求めた方向ベクトル
   */
  static directionToRadian(v, P) {
    const e = Math.atan2(P.y, P.x), a = Math.atan2(v.y, v.x);
    let i = e - a;
    for (; i < -Math.PI; )
      i += Math.PI * 2;
    for (; i > Math.PI; )
      i -= Math.PI * 2;
    return i;
  }
  /**
   * ２つのベクトルから角度値を求める
   *
   * @param from  始点ベクトル
   * @param to    終点ベクトル
   * @return 角度値から求めた方向ベクトル
   */
  static directionToDegrees(v, P) {
    const e = this.directionToRadian(v, P);
    let a = this.radianToDegrees(e);
    return P.x - v.x > 0 && (a = -a), a;
  }
  /**
   * ラジアン値を方向ベクトルに変換する。
   *
   * @param totalAngle    ラジアン値
   * @return ラジアン値から変換した方向ベクトル
   */
  static radianToDirection(v) {
    const P = new w();
    return P.x = this.sin(v), P.y = this.cos(v), P;
  }
  /**
   * 三次方程式の三次項の係数が0になったときに補欠的に二次方程式の解をもとめる。
   * a * x^2 + b * x + c = 0
   *
   * @param   a -> 二次項の係数値
   * @param   b -> 一次項の係数値
   * @param   c -> 定数項の値
   * @return  二次方程式の解
   */
  static quadraticEquation(v, P, e) {
    return this.abs(v) < x.Epsilon ? this.abs(P) < x.Epsilon ? -e : -e / P : -(P + this.sqrt(P * P - 4 * v * e)) / (2 * v);
  }
  /**
   * カルダノの公式によってベジェのt値に該当する３次方程式の解を求める。
   * 重解になったときには0.0～1.0の値になる解を返す。
   *
   * a * x^3 + b * x^2 + c * x + d = 0
   *
   * @param   a -> 三次項の係数値
   * @param   b -> 二次項の係数値
   * @param   c -> 一次項の係数値
   * @param   d -> 定数項の値
   * @return  0.0～1.0の間にある解
   */
  static cardanoAlgorithmForBezier(v, P, e, a) {
    if (this.sqrt(v) < x.Epsilon)
      return this.range(this.quadraticEquation(P, e, a), 0, 1);
    const i = P / v, b = e / v, n = a / v, c = (3 * b - i * i) / 3, g = c / 3, s = (2 * i * i * i - 9 * i * b + 27 * n) / 27, A = s / 2, L = A * A + g * g * g, M = 0.5, T = M + 0.01;
    if (L < 0) {
      const S = -c / 3, iv = S * S * S, bv = this.sqrt(iv), m9 = -s / (2 * bv), w9 = this.range(m9, -1, 1), Qv = Math.acos(w9), jv = 2 * this.cbrt(bv), Nv = jv * this.cos(Qv / 3) - i / 3;
      if (this.abs(Nv - M) < T)
        return this.range(Nv, 0, 1);
      const Mv = jv * this.cos((Qv + 2 * Math.PI) / 3) - i / 3;
      if (this.abs(Mv - M) < T)
        return this.range(Mv, 0, 1);
      const y9 = jv * this.cos((Qv + 4 * Math.PI) / 3) - i / 3;
      return this.range(y9, 0, 1);
    }
    if (L == 0) {
      let S;
      A < 0 ? S = this.cbrt(-A) : S = -this.cbrt(A);
      const iv = 2 * S - i / 3;
      if (this.abs(iv - M) < T)
        return this.range(iv, 0, 1);
      const bv = -S - i / 3;
      return this.range(bv, 0, 1);
    }
    const h = this.sqrt(L), rv = this.cbrt(h - A), fv = this.cbrt(h + A), C9 = rv - fv - i / 3;
    return this.range(C9, 0, 1);
  }
  /**
   * 浮動小数点の余りを求める。
   *
   * @param dividend 被除数（割られる値）
   * @param divisor 除数（割る値）
   * @returns 余り
   */
  static mod(v, P) {
    if (!isFinite(v) || P === 0 || isNaN(v) || isNaN(P))
      return console.warn(`divided: ${v}, divisor: ${P} mod() returns 'NaN'.`), NaN;
    const e = Math.abs(v), a = Math.abs(P);
    let i = e - Math.floor(e / a) * a;
    return i *= Math.sign(v), i;
  }
  /**
   * コンストラクタ
   */
  constructor() {
  }
}
x.Epsilon = 1e-5;
var Vv;
(function(r) {
  r.CubismMath = x;
})(Vv || (Vv = {}));
const K = Live2DCubismMotionSyncCore.ToPointer, kv = 6;
class d9 {
  constructor(v, P, e, a, i) {
    t(this, "_audioParameterId");
    t(this, "_modelParameterIds");
    t(this, "_modelParameterValues");
    t(this, "_scale");
    t(this, "_enabled");
    t(this, "_nativeArray");
    t(this, "_nativeArrayPtr");
    v.getLength() == 0 && D("The audio parameter ID is null."), P.getSize() == 0 && D(
      "The array length of IDs differs from the array length of parameter values. Please make them the same"
    ), e.getSize() == 0 && D(
      "The model parameter ID array or the model parameter value array length is 0."
    ), 0.1 <= a && a <= 10 || D(
      "The value of scale is incorrect. The value is limited to between 0.1 and 10.0."
    ), this._audioParameterId = v, this._modelParameterIds = P, this._modelParameterValues = e, this._scale = a, this._enabled = Number(i);
  }
  toNativeArray(v) {
    if (!v && this._nativeArray)
      return this._nativeArray;
    this._nativeArray && this.releaseNativeArray(), this._nativeArray = new Float32Array(kv), this._nativeArrayPtr = K.Malloc(
      this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT
    );
    const P = new Array(), e = new Array();
    for (let a = 0; a < this._modelParameterIds.getSize(); a++)
      P.push(
        this._modelParameterIds.at(a).s
      ), e.push(
        this._modelParameterValues.at(a)
      );
    return this._nativeArray = K.ConvertMappingInfoCriToFloat32Array(
      this._nativeArray,
      this._nativeArrayPtr,
      this._audioParameterId.s,
      P,
      e,
      this._modelParameterIds.getSize(),
      this._scale,
      this._enabled
    ), this._nativeArray;
  }
  releaseNativeArray() {
    this.deallocNativeArrayPtr(), this._nativeArray = void 0;
  }
  getAudioParameterId() {
    return this._audioParameterId;
  }
  getModelParameterIds() {
    return this._modelParameterIds;
  }
  getModelParameterValues() {
    return this._modelParameterValues;
  }
  getScale() {
    return this._scale;
  }
  getEnabled() {
    return this._enabled;
  }
  deallocNativeArrayPtr() {
    K.Free(this._nativeArray[0]), K.Free(this._nativeArray[1]), K.Free(this._nativeArray[2]), K.Free(this._nativeArrayPtr), this._nativeArrayPtr = 0;
  }
}
var Zv;
((r) => {
  r.CubismMotionSyncEngineMappingInfo = d9;
})(Zv || (Zv = {}));
const zv = Live2DCubismMotionSyncCore.ToPointer;
var y = /* @__PURE__ */ ((r) => (r[r.EngineType_Cri = 0] = "EngineType_Cri", r[r.EngineType_Unknown = 1] = "EngineType_Unknown", r))(y || {});
class x9 {
  /**
   * @deprecated 非推奨になりました。代わりにCubismMath.fmodを使用してください。
   *
   * 浮動小数点の余りを求める。
   *
   * @param x 被除数（割られる値）
   * @param y 除数（割る値）
   * @returns 余り
   */
  static fmod(v, P) {
    return Number((v - Math.floor(v / P) * P).toPrecision(8));
  }
}
class T9 {
  constructor() {
    t(this, "_infoBufferList");
    t(this, "_mappingInfoListFirstPtr");
  }
  // デストラクタ
  release() {
    this.deleteMappingInfoList();
  }
  setJObject(v) {
    this.deleteMappingInfoList(), this._infoBufferList = new o(), this.ConvertObjectToNative(v);
  }
  ConvertObjectToNative(v) {
    const P = v.getSize();
    for (let a = 0; a < P; a++)
      this._infoBufferList.pushBack(v.at(a).toNativeArray(!0));
    let e = zv.Malloc(
      this._infoBufferList.at(0).length * P * this._infoBufferList.at(0).BYTES_PER_ELEMENT
    );
    this._mappingInfoListFirstPtr = e;
    for (let a = 0; a < P; a++) {
      for (let i = 0; i < kv; i++)
        i == 4 ? zv.AddValuePtrFloat(
          e,
          i * Float32Array.BYTES_PER_ELEMENT,
          this._infoBufferList.at(a)[i]
        ) : zv.AddValuePtrInt32(
          e,
          i * Float32Array.BYTES_PER_ELEMENT,
          this._infoBufferList.at(a)[i]
        );
      e += kv * Float32Array.BYTES_PER_ELEMENT;
    }
  }
  deleteMappingInfoList() {
    this._infoBufferList && (this._infoBufferList.clear(), this._infoBufferList = void 0, this._infoBufferList = null);
  }
  getMappingInfoListPtr() {
    return this._mappingInfoListFirstPtr;
  }
}
class D9 {
  constructor(v, P, e) {
    t(this, "_context");
    t(this, "_mapper");
    t(this, "_cubismParameterCount");
    this._context = v, this._mapper = P, this._cubismParameterCount = e;
  }
  release() {
    var v, P;
    (v = this._context) == null || v.csmMotionSyncDelete(), this._context = void 0, this._context = null, (P = this._mapper) == null || P.release(), this._mapper = void 0, this._mapper = null, this._cubismParameterCount = 0;
  }
  getContext() {
    return this._context;
  }
  getMapper() {
    return this._mapper;
  }
  getCubismParameterCount() {
    return this._cubismParameterCount;
  }
}
var Fv;
((r) => {
  r.MotionSyncUtil = x9, r.MotionSyncContext = D9, r.MappingInfoListMapper = T9;
})(Fv || (Fv = {}));
const q9 = "Version", dv = "Meta", B9 = "SettingCount", Xv = "Dictionary", R = "Id", Tv = "Name", u = "Settings", K9 = "AnalysisType", R9 = "UseCase", W = "CubismParameters", Hv = "Min", _v = "Max", V9 = "Damper", Z9 = "Smooth", O = "AudioParameters", F9 = "Scale", X9 = "Enabled", nv = "Mappings", H9 = "Type", $v = "Targets", _9 = "Value", Dv = "PostProcessing", $9 = "BlendRatio", vP = "Smoothing", PP = "SampleRate";
class l9 {
  /**
   * コンストラクタ
   * @param buffer motionsync3.jsonが読み込まれているバッファ
   * @param size バッファのサイズ
   */
  constructor(v, P) {
    t(this, "_json");
    this._json = G.create(v, P);
  }
  /**
   * デストラクタ相当の処理
   */
  release() {
    G.delete(this._json);
  }
  /**
   * バージョン情報を取得する
   * @return バージョン数
   */
  getVersion() {
    return this._json.getRoot().getValueByString(q9).toInt();
  }
  // --- Meta ---
  /**
   * モーションシンク設定のメタ情報を取得する
   * @return ーションシンク設定のメタ情報
   */
  getMeta() {
    let v = null;
    v = new aP(), v.settingCount = this.getSettingCount(), v.dictionary = new o();
    for (let P = 0; P < v.settingCount; P++)
      v.dictionary.pushBack(this.getMetaDictionaryItem(P));
    return v;
  }
  /**
   * Metaのモーションシンク設定リストのアイテムを取得する
   * @param index アイテムのインデックス
   * @return モーションシンク設定リストのアイテム
   */
  getMetaDictionaryItem(v) {
    const P = new eP();
    return P.id = new Q(this.getIdFromMeta(v)), P.name = new Q(this.getName(v)), P;
  }
  /**
   * モーションシンク設定の数を取得する
   * @return モーションシンク設定の数
   */
  getSettingCount() {
    return this._json.getRoot().getValueByString(dv).getValueByString(B9).toInt();
  }
  /**
   * Metaからモーションシンク設定のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定のId
   */
  getIdFromMeta(v) {
    return this._json.getRoot().getValueByString(dv).getValueByString(Xv).getValueByIndex(v).getValueByString(R).getString();
  }
  /**
   * モーションシンク設定の名前を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定の名前
   */
  getName(v) {
    return this._json.getRoot().getValueByString(dv).getValueByString(Xv).getValueByIndex(v).getValueByString(Tv).getString();
  }
  // --- Settings ---
  /**
   * Settingsからモーションシンク設定を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定
   */
  getSetting(v) {
    const P = new nP();
    switch (P.id = new Q(this.getIdFromSettings(v)), this.getAnalysisType(v)) {
      case "CRI":
        P.analysisType = y.EngineType_Cri;
        break;
      default:
        j("Unknown Settings.AnalysisType."), P.analysisType = y.EngineType_Unknown;
        break;
    }
    switch (this.getUseCase(v)) {
      case "Mouth":
        P.useCase = Cv.UseCase_Mouth;
        break;
      default:
        j("Unknown Settings.UseCase."), P.useCase = Cv.UseCase_Unknown;
        break;
    }
    const i = this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getSize();
    P.cubismParameterList = new o();
    for (let n = 0; n < i; n++)
      P.cubismParameterList.pushBack(
        this.getCubismParametarsElement(v, n)
      );
    const b = this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getSize();
    P.audioParameterList = new o();
    for (let n = 0; n < b; n++)
      P.audioParameterList.pushBack(
        this.getAudioParametersElement(v, n)
      );
    P.mappingList = new o();
    for (let n = 0; n < b; n++)
      P.mappingList.pushBack(
        this.getMappingsElement(v, n, i)
      );
    return P.blendRatio = this.getBlendRatio(v), P.smoothing = this.getSmoothingFromPostProcessing(v), P.sampleRate = this.getSampleRate(v), P;
  }
  /**
   * Settingsからモーションシンク設定のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return モーションシンク設定のId
   */
  getIdFromSettings(v) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(R).getString();
  }
  /**
   * モーションシンク設定の音声解析タイプを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return 音声解析タイプ
   */
  getAnalysisType(v) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(K9).getString();
  }
  /**
   * モーションシンク設定のユースケースを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return ユースケース
   */
  getUseCase(v) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(R9).getString();
  }
  // --- CubismParametars ---
  /**
   * CubismParametarsに登録されているCubismParametarアイテムを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarアイテム
   */
  getCubismParametarsElement(v, P) {
    const e = new rP();
    return e.name = new Q(
      this.getNameFromCubismParameters(v, P)
    ), e.id = new Q(
      this.getIdFromCubismParameters(v, P)
    ), e.min = this.getMinFromCubismParameters(
      v,
      P
    ), e.max = this.getMaxFromCubismParameters(
      v,
      P
    ), e.damper = this.getDamperFromCubismParameters(
      v,
      P
    ), e.smooth = this.getSmoothFromCubismParameters(
      v,
      P
    ), e;
  }
  /**
   * CubismParametarsに登録されているCubismParametarの名称を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの名称
   */
  getNameFromCubismParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getValueByIndex(P).getValueByString(Tv).getString();
  }
  /**
   * CubismParametarsに登録されているCubismParametarのIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarのId
   */
  getIdFromCubismParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getValueByIndex(P).getValueByString(R).getString();
  }
  /**
   * CubismParametarsに登録されているCubismParametarの最小値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの最小値
   */
  getMinFromCubismParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getValueByIndex(P).getValueByString(Hv).toFloat();
  }
  /**
   * CubismParametarsに登録されているCubismParametarの最大値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの最大値
   */
  getMaxFromCubismParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getValueByIndex(P).getValueByString(_v).toFloat();
  }
  /**
   * CubismParametarsに登録されているCubismParametarの減衰値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarの減衰値
   */
  getDamperFromCubismParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getValueByIndex(P).getValueByString(V9).toFloat();
  }
  /**
   * CubismParametarsに登録されているCubismParametarのスムージング値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex CubismParametarsから取得したい要素のインデックス
   * @return CubismParametarのスムージング値
   */
  getSmoothFromCubismParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(W).getValueByIndex(P).getValueByString(Z9).toFloat();
  }
  // --- AudioParameters ---
  /**
   * AudioParametersに登録されている音声の要素を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素
   */
  getAudioParametersElement(v, P) {
    const e = new iP();
    return e.name = new Q(
      this.getNameFromAudioParameters(v, P)
    ), e.id = new Q(
      this.getIdFromAudioParameters(v, P)
    ), e.min = this.getMinFromAudioParameters(
      v,
      P
    ), e.max = this.getMaxFromAudioParameters(
      v,
      P
    ), e.scale = this.getScaleFromAudioParameters(
      v,
      P
    ), e.enabled = this.getEnabledFromAudioParameters(
      v,
      P
    ), e;
  }
  /**
   * AudioParametersに登録されている音声の要素の名称を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の名称
   */
  getNameFromAudioParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getValueByIndex(P).getValueByString(Tv).getString();
  }
  /**
   * AudioParametersに登録されている音声の要素のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素のId
   */
  getIdFromAudioParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getValueByIndex(P).getValueByString(R).getString();
  }
  /**
   * AudioParametersに登録されている音声の要素の最小値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の最小値
   */
  getMinFromAudioParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getValueByIndex(P).getValueByString(Hv).toFloat();
  }
  /**
   * AudioParametersに登録されている音声の要素の最大値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の最大値
   */
  getMaxFromAudioParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getValueByIndex(P).getValueByString(_v).toFloat();
  }
  /**
   * AudioParametersに登録されている音声の要素のスケール値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素のスケール値
   */
  getScaleFromAudioParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getValueByIndex(P).getValueByString(F9).toFloat();
  }
  /**
   * AudioParametersに登録されている音声の要素の有効フラグを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex AudioParametersから取得したい要素のインデックス
   * @return 音声の要素の有効フラグ
   */
  getEnabledFromAudioParameters(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(O).getValueByIndex(P).getValueByString(X9).toBoolean();
  }
  // --- Mappings ---
  /**
   * Mappingsに登録されているマッピングデータを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex Mappingsから取得したい要素のインデックス
   * @return マッピングデータ
   */
  getMappingsElement(v, P, e) {
    const a = new tP();
    switch (this.getMappingType(v, P)) {
      case "Shape":
        a.type = mv.MappingType_Shape;
        break;
      default:
        j("Unknown Mappings.Type."), a.type = mv.MappingType_Unknown;
        break;
    }
    a.audioId = new Q(
      this.getAudioParamIdFromMappings(v, P)
    ), a.targetList = new o();
    for (let b = 0; b < e; b++)
      a.targetList.pushBack(
        this.getMappingTargetsElement(v, P, b)
      );
    return a;
  }
  /**
   * Mappingsに登録されているTargetsの要素を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param mappingIndex Mappingsから取得したい要素のインデックス
   * @param TargetsIndex Targetsから取得したい要素のインデックス
   * @return Targetsの要素
   */
  getMappingTargetsElement(v, P, e) {
    const a = new bP();
    return a.id = new Q(
      this.getCubismIdFromMappingTarget(v, P, e)
    ), a.value = this.getValueFromMappingTarget(
      v,
      P,
      e
    ), a;
  }
  /**
   * マッピングのタイプを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex Mappingsから取得したい要素のインデックス
   * @return マッピングのタイプ
   */
  getMappingType(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(nv).getValueByIndex(P).getValueByString(H9).getString();
  }
  /**
   * Mappingsに登録されている音声の要素のIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param elementIndex Mappingsから取得したい要素のインデックス
   * @return 音声の要素のId
   */
  getAudioParamIdFromMappings(v, P) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(nv).getValueByIndex(P).getValueByString(R).getString();
  }
  /**
   * Targetsに登録されているCubismParameterのIdを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param mappingIndex Mappingsから取得したい要素のインデックス
   * @param TargetsIndex Targetsから取得したい要素のインデックス
   * @return CubismParameterのId
   */
  getCubismIdFromMappingTarget(v, P, e) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(nv).getValueByIndex(P).getValueByString($v).getValueByIndex(e).getValueByString(R).getString();
  }
  /**
   * Targetsに登録されているCubismParameterの値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @param mappingIndex Mappingsから取得したい要素のインデックス
   * @param TargetsIndex Targetsから取得したい要素のインデックス
   * @return CubismParameterの値
   */
  getValueFromMappingTarget(v, P, e) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(nv).getValueByIndex(P).getValueByString($v).getValueByIndex(e).getValueByString(_9).toFloat();
  }
  // --- PostProcessing ---
  /**
   * ブレンド率を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return ブレンド率
   */
  getBlendRatio(v) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(Dv).getValueByString($9).toFloat();
  }
  /**
   * スムージング値を取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return スムージング値
   */
  getSmoothingFromPostProcessing(v) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(Dv).getValueByString(vP).toInt();
  }
  /**
   * 設定フレームレートを取得する
   * @param settingIndex モーションシンク設定のインデックス
   * @return 設定フレームレート
   */
  getSampleRate(v) {
    return this._json.getRoot().getValueByString(u).getValueByIndex(v).getValueByString(Dv).getValueByString(PP).toFloat();
  }
  // motionsync3.jsonのデータ
}
var v9;
((r) => {
  r.CubismMotionSyncDataJson = l9;
})(v9 || (v9 = {}));
class ev {
  /**
   * コンストラクタ
   */
  constructor() {
    t(this, "_version");
    t(this, "_meta");
    t(this, "_settings");
    t(this, "_settingCount");
    this._version = 0, this._meta = null, this._settings = null;
  }
  /**
   * インスタンスの作成
   * @param buffer    physics3.jsonが読み込まれているバッファ
   * @param size      バッファのサイズ
   * @return 作成されたインスタンス
   */
  static create(v, P, e) {
    const a = new ev();
    return a.parse(v, P, e), a;
  }
  /**
   * インスタンスを破棄する
   * @param motionSyncData 破棄するインスタンス
   */
  static delete(v) {
    v != null && (v.release(), v = null);
  }
  /**
   * motionsync3.jsonをパースする。
   *
   * @param motionSyncJson  motionsync3.jsonが読み込まれているバッファ
   * @param size        バッファのサイズ
   */
  parse(v, P, e) {
    let a = new l9(
      P,
      e
    );
    if (a._json == null || v == null) {
      j("Failed to parse .motionsync3.json.");
      return;
    }
    this._version = a.getVersion(), this._meta = a.getMeta(), this._settings = new o();
    for (let i = 0; i < this._meta.settingCount; i++)
      this._settings.pushBack(a.getSetting(i));
    this._settingCount = this._settings.getSize();
    for (let i = 0; i < this._settings.getSize(); i++) {
      const b = this._settings.at(i).cubismParameterList, n = b.getSize();
      for (let c = 0; c < n; c++) {
        let g = n;
        console.log(v);
        for (let s = 0; s < v.getParameterCount(); s++)
          if (
            // model
            //   .getParameterId(modelParameterIndex)
            //   .isEqual(cubismParameterList.at(cubismParameterIndex).id)
            v._parameterIds[s] === b.at(c).id.s
          ) {
            g = s;
            break;
          }
        b.at(c).parameterIndex = g;
      }
    }
    a.release(), a = void 0, a = null;
  }
  /**
   * デストラクタ相当の処理
   */
  release() {
    this._version = void 0, this._meta = void 0, this._meta = null, this._settings = void 0, this._settings = null, this._settingCount = 0;
  }
  getVersion() {
    return this._version;
  }
  getMeta() {
    return this._meta;
  }
  getSetting(v) {
    return this._settings.at(v);
  }
  getSettingCount() {
    return this._settingCount;
  }
  getMappingInfoList(v) {
    if (this._settings.getSize() <= v)
      return null;
    const P = new o(), e = this.getSetting(v);
    for (let a = 0; a < e.audioParameterList.getSize(); a++) {
      const i = e.audioParameterList.at(a).id, b = new o(), n = new o();
      for (let s = 0; s < e.audioParameterList.getSize(); s++)
        if (i.isEqual(e.mappingList.at(s).audioId.s)) {
          for (let A = 0; A < e.cubismParameterList.getSize(); A++) {
            const L = e.mappingList.at(s).targetList.at(A);
            b.pushBack(L.id), n.pushBack(L.value);
          }
          break;
        }
      const c = e.audioParameterList.at(a).scale, g = e.audioParameterList.at(a).enabled;
      P.pushBack(
        new d9(
          i,
          b,
          n,
          c,
          g
        )
      );
    }
    return P;
  }
}
var Cv = /* @__PURE__ */ ((r) => (r[r.UseCase_Mouth = 0] = "UseCase_Mouth", r[r.UseCase_Unknown = 1] = "UseCase_Unknown", r))(Cv || {}), mv = /* @__PURE__ */ ((r) => (r[r.MappingType_Shape = 0] = "MappingType_Shape", r[r.MappingType_Unknown = 1] = "MappingType_Unknown", r))(mv || {});
class eP {
  constructor() {
    t(this, "id");
    t(this, "name");
  }
}
class aP {
  constructor() {
    t(this, "settingCount");
    t(this, "dictionary");
  }
}
class rP {
  constructor() {
    t(this, "name");
    t(this, "id");
    t(this, "min");
    t(this, "max");
    t(this, "damper");
    t(this, "smooth");
    t(this, "parameterIndex");
  }
}
class iP {
  constructor() {
    t(this, "name");
    t(this, "id");
    t(this, "min");
    t(this, "max");
    t(this, "scale");
    t(this, "enabled");
  }
}
class bP {
  constructor() {
    t(this, "id");
    t(this, "value");
  }
}
class tP {
  constructor() {
    t(this, "type");
    t(this, "audioId");
    t(this, "targetList");
  }
}
class nP {
  constructor() {
    t(this, "id");
    t(this, "analysisType");
    t(this, "useCase");
    t(this, "cubismParameterList");
    t(this, "audioParameterList");
    t(this, "mappingList");
    t(this, "blendRatio");
    t(this, "smoothing");
    t(this, "sampleRate");
  }
}
var P9;
((r) => {
  r.CubismMotionSyncData = ev;
})(P9 || (P9 = {}));
const V = Live2DCubismMotionSyncCore.ToPointer;
class wv {
  constructor(v) {
    t(this, "_values");
    t(this, "_valuesCount");
    t(this, "_processedSampleCount");
    t(this, "_resultArray");
    t(this, "_resultArrayPtr");
    this._values = new Array(v), this._valuesCount = v, this._processedSampleCount = 0;
  }
  copy(v) {
    this._values = new Array();
    for (let P = 0; P < v.getValues().length; P++)
      this._values.push(v.getValues()[P]);
    this._valuesCount = v.getValuesCount(), this._processedSampleCount = 0;
  }
  toNativeArray(v) {
    return !v && this._resultArray ? this._resultArray : (this._resultArray && this.releaseNativeArray(), this._resultArray = new Int32Array(this._valuesCount), this._resultArrayPtr = V.Malloc(
      this._resultArray.length * this._resultArray.BYTES_PER_ELEMENT
    ), this._resultArray = V.ConvertAnalysisResultToInt32Array(
      this._resultArray,
      this._resultArrayPtr,
      this._valuesCount
    ), this._resultArray);
  }
  releaseNativeArray() {
    this.deallocNativeArrayPtr(), this._resultArray = void 0;
  }
  release() {
    this._values = void 0, this._values = null, this._valuesCount = 0, this._processedSampleCount = 0;
  }
  getValues() {
    return this._values;
  }
  getValuesCount() {
    return this._valuesCount;
  }
  getProcessedSampleCount() {
    return this._processedSampleCount;
  }
  setProcessedSampleCount(v) {
    this._processedSampleCount = v;
  }
  ConvertNativeAnalysisResult(v) {
    this.ConvertFromNativeResultValues(), this.ConvertFromNativeProcessedSampleCount(v);
  }
  ConvertFromNativeResultValues() {
    this._values = V.GetValuesFromAnalysisResult(
      this._resultArray[0],
      this._valuesCount
    );
  }
  ConvertFromNativeProcessedSampleCount(v) {
    this._processedSampleCount = V.GetProcessedSampleCountFromAnalysisResult(v + 8);
  }
  deallocNativeArrayPtr() {
    V.Free(this._resultArray[0]), V.Free(this._resultArrayPtr), this._resultArrayPtr = 0;
  }
}
var e9;
((r) => {
  r.CubismMotionSyncEngineAnalysisResult = wv;
})(e9 || (e9 = {}));
class J9 {
  constructor(v, P, e) {
    t(this, "_engine");
    t(this, "_contextHandle");
    t(this, "_mappingInfoArray");
    this._engine = v, this._contextHandle = P, this._mappingInfoArray = e;
  }
  /**
   * createAnalysisResult
   */
  createAnalysisResult() {
    return this.isClosed() || this._mappingInfoArray.getSize() < 1 ? new wv(0) : new wv(
      this._mappingInfoArray.at(0).getModelParameterValues().getSize()
    );
  }
  /**
   * isClosed
   */
  isClosed() {
    return this._contextHandle == null;
  }
  Close() {
    this.isClosed() || (this._contextHandle.release(), this._contextHandle = void 0, this._contextHandle = null, this._engine.DeleteAssociation(this));
  }
  getContextHandle() {
    return this._contextHandle;
  }
  getEngine() {
    return this._engine;
  }
  getType() {
    return this._engine.getType();
  }
  getRequireSampleCount() {
    var v, P;
    return !((v = this.getEngine()) != null && v.getEngineHandle()) || !((P = this.getContextHandle()) != null && P.getContext()) ? 0 : this.getEngine().getEngineHandle().getRequireSampleCount(this.getContextHandle().getContext());
  }
}
var a9;
((r) => {
  r.ICubismMotionSyncProcessor = J9;
})(a9 || (a9 = {}));
const _ = Live2DCubismMotionSyncCore.ToPointer, cP = 2, gP = 3;
class Sv {
  constructor(v = 0, P = 0) {
    t(this, "SampleRate");
    t(this, "BitDepth");
    t(this, "_nativeArray");
    t(this, "_nativeArrayPtr");
    this.SampleRate = v, this.BitDepth = P;
  }
  toNativeArray(v) {
    !v && this._nativeArray || (this._nativeArray && this.releaseNativeArray(), this._nativeArray = new Int32Array(cP), this._nativeArrayPtr = _.Malloc(
      this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT
    ), this._nativeArray = _.ConvertContextConfigCriToInt32Array(
      this._nativeArray,
      this._nativeArrayPtr,
      this.SampleRate,
      this.BitDepth
    ));
  }
  getNativePtr() {
    return this._nativeArrayPtr;
  }
  releaseNativeArray() {
    this.deallocNativeArrayPtr(), this._nativeArray = void 0;
  }
  deallocNativeArrayPtr() {
    _.Free(this._nativeArrayPtr), this._nativeArrayPtr = 0;
  }
}
class sP {
  constructor(v = 0, P = 0, e = 0) {
    t(this, "BlendRatio");
    t(this, "Smoothing");
    t(this, "AudioLevelEffectRatio");
    // Unused
    t(this, "_nativeArray");
    t(this, "_nativeArrayPtr");
    this.BlendRatio = v, this.Smoothing = P, this.AudioLevelEffectRatio = e;
  }
  toNativeArray(v) {
    return !v && this._nativeArray ? this._nativeArray : (this._nativeArray && this.releaseNativeArray(), this._nativeArray = new Float32Array(gP), this._nativeArrayPtr = _.Malloc(
      this._nativeArray.length * this._nativeArray.BYTES_PER_ELEMENT
    ), this._nativeArray = _.ConvertAnalysisConfigToFloat32Array(
      this._nativeArray,
      this._nativeArrayPtr,
      this.BlendRatio,
      this.Smoothing,
      this.AudioLevelEffectRatio
    ), this._nativeArray);
  }
  releaseNativeArray() {
    this.deallocNativePtr(), this._nativeArray = void 0;
  }
  deallocNativePtr() {
    _.Free(this._nativeArrayPtr), this._nativeArrayPtr = 0;
  }
}
var r9;
((r) => {
  r.MotionSyncContextConfig_CRI = Sv;
})(r9 || (r9 = {}));
const I = Live2DCubismMotionSyncCore.ToPointer;
class L9 extends J9 {
  constructor(P, e, a, i, b) {
    super(P, e, a);
    t(this, "_sampleRate");
    t(this, "_bitDepth");
    t(this, "_analysisConfigNativePtr");
    t(this, "_analysisResultNativePtr");
    this._sampleRate = i, this._bitDepth = b;
  }
  getSampleRate() {
    return this._sampleRate;
  }
  getBitDepth() {
    return this._bitDepth;
  }
  Analyze(P, e, a, i, b, n) {
    const c = P.getSize();
    if (c < this.getEngine().getEngineHandle().getRequireSampleCount(this.getContextHandle().getContext()))
      return D(
        "The argument is invalid. Please check that the samples is the correct value."
      ), null;
    if (!(0 <= e && e < P.getSize()))
      return D(
        "The value of beginIndex is incorrect. It should be less than the length of samples."
      ), null;
    if (!(0 <= a && a <= 1))
      return D(
        "The value of blend ratio is incorrect. The value is limited to between 0.0 and 1.0."
      ), null;
    if (!(1 <= i && i <= 100))
      return D(
        "The value of smoothing is incorrect. The value is limited to between 1 and 100."
      ), null;
    if (!(0 <= b && b <= 1))
      return D(
        "The value of audio level effect ratio is incorrect. The value is limited to between 0.0 and 1.0."
      ), null;
    if (!n)
      return D("The result instance is null."), null;
    const s = new sP(
      a,
      i,
      b
    ).toNativeArray(!1);
    (!this._analysisConfigNativePtr || this._analysisConfigNativePtr == 0) && (this._analysisConfigNativePtr = I.Malloc(
      s.length
    )), I.AddValuePtrFloat(
      this._analysisConfigNativePtr,
      0,
      s[0]
    ), I.AddValuePtrInt32(
      this._analysisConfigNativePtr,
      4,
      s[1]
    ), I.AddValuePtrFloat(
      this._analysisConfigNativePtr,
      8,
      s[2]
    );
    const A = n.toNativeArray(!1);
    return (!this._analysisResultNativePtr || this._analysisResultNativePtr == 0) && (this._analysisResultNativePtr = I.Malloc(
      A.length * A.BYTES_PER_ELEMENT
    )), I.AddValuePtrInt32(
      this._analysisResultNativePtr,
      0,
      A[0]
    ), I.AddValuePtrInt32(
      this._analysisResultNativePtr,
      4,
      A[1]
    ), I.AddValuePtrInt32(
      this._analysisResultNativePtr,
      8,
      A[2]
    ), this.getEngine().getEngineHandle().analyze(
      this.getContextHandle().getContext(),
      P._ptr,
      e,
      c - e,
      this._analysisResultNativePtr,
      this._analysisConfigNativePtr
    ) ? (n.ConvertNativeAnalysisResult(this._analysisResultNativePtr), n) : (D("Failed to analyze."), null);
  }
  release() {
    I.Free(this._analysisConfigNativePtr), this._analysisConfigNativePtr = 0, I.Free(this._analysisResultNativePtr), this._analysisResultNativePtr = 0;
  }
}
var i9;
((r) => {
  r.CubismMotionSyncProcessorCRI = L9;
})(i9 || (i9 = {}));
const b9 = 32;
class h9 {
  constructor(v, P, e, a) {
    t(this, "_processors");
    t(this, "_engineHandle");
    t(this, "_type");
    t(this, "_name");
    t(this, "_version");
    this._engineHandle = v, this._type = P, this._name = e, this._version = a;
  }
  getType() {
    return this._type;
  }
  getName() {
    return this._name;
  }
  getVersion() {
    return this._version;
  }
  getEngineHandle() {
    return this._engineHandle;
  }
  getProcessors() {
    return this._processors;
  }
  isClosed() {
    return this.getEngineHandle() == null;
  }
  releaseAllProcessor() {
    if (!this.isClosed())
      for (let v = 0; v < this._processors.getSize(); v++)
        this._processors.at(v).Close();
  }
  close(v) {
    if (!this.isClosed()) {
      if (0 < this._processors.getSize())
        if (v)
          this.releaseAllProcessor();
        else
          return;
      this.getEngineHandle().disposeEngine(), this._engineHandle = void 0, this._engineHandle = null, av.deleteAssociation(this);
    }
  }
  DeleteAssociation(v) {
    for (let P = 0; P < this._processors.getSize(); P++)
      if (this._processors.at(P) == v) {
        this._processors.at(P).Close(), this._processors.remove(P);
        break;
      }
  }
}
var t9;
((r) => {
  r.ICubismMotionSyncEngine = h9;
})(t9 || (t9 = {}));
const oP = 16e3, uP = 128e3;
class AP extends h9 {
  constructor(P, e, a, i) {
    super(P, e, a, i);
    // @ts-ignore
    t(this, "_processors");
    this._processors = new o();
  }
  CreateProcessor(P, e, a) {
    if (this.isClosed())
      return j(
        "[CubismMotionSyncEngineCri.CreateProcessor] Cubism MotionSync Engine is not started.'"
      ), null;
    if (e.getSize() < 1)
      return j(
        "[CubismMotionSyncEngineCri.CreateProcessor] mappingInfoList size is invalid.'"
      ), null;
    if (!(oP <= a && a <= uP))
      return j(
        "[CubismMotionSyncEngineCri.CreateProcessor] sampleRate is invalid.'"
      ), null;
    const i = new Sv(a, b9), b = new T9();
    b.setJObject(e);
    const n = this.getEngineHandle().createContext(
      this.getType(),
      i,
      b,
      e.getSize()
    ), c = new D9(
      n,
      b,
      P
    ), g = new L9(
      this,
      c,
      e,
      a,
      b9
    );
    return this._processors.pushBack(g), g;
  }
}
var n9;
((r) => {
  r.MotionSyncContextConfig_CRI = Sv;
})(n9 || (n9 = {}));
const c9 = Live2DCubismMotionSyncCore.ToPointer;
class I9 {
  constructor() {
    t(this, "_isEngineInitialized");
    t(this, "_analyzeSamplesPtr");
  }
  getEngineVersion() {
    return Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncGetEngineVersion();
  }
  getEngineName() {
    return new Q(
      Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncGetEngineName()
    );
  }
  initializeEngine(v) {
    return this.isInitialized() ? (f("Cubism MotionSync Core already initialized."), !0) : (this._isEngineInitialized = !1, Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncInitializeEngine(
      v
    ) == Live2DCubismMotionSyncCore.csmMotionSyncFalse ? (j("Cubism MotionSync Core Initializing failed."), !1) : (this._isEngineInitialized = !0, !0));
  }
  disposeEngine() {
    if (!this.isInitialized()) {
      f("Cubism MotionSync Core initialized yet.");
      return;
    }
    Live2DCubismMotionSyncCore.CubismMotionSyncEngine.csmMotionSyncDisposeEngine(), this._isEngineInitialized = !1;
  }
  createContext(v, P, e, a) {
    if (!this.isInitialized())
      return f("Cubism MotionSync Core initialized yet."), null;
    const i = new Live2DCubismMotionSyncCore.Context();
    let b;
    switch (v) {
      case y.EngineType_Cri:
        {
          const n = P;
          n == null || n.toNativeArray(!0), b = n == null ? void 0 : n.getNativePtr();
        }
        break;
      default:
        return null;
    }
    return i.csmMotionSyncCreate(
      b,
      e.getMappingInfoListPtr(),
      a
    ), i;
  }
  clearContext(v) {
    if (!this.isInitialized()) {
      f("Cubism MotionSync Core initialized yet.");
      return;
    }
    v == null || v.csmMotionSyncClear();
  }
  deleteContext(v) {
    if (!this.isInitialized()) {
      f("Cubism MotionSync Core initialized yet.");
      return;
    }
    v == null || v.csmMotionSyncDelete();
  }
  getRequireSampleCount(v) {
    return this.isInitialized() ? v == null ? (f("context is null."), 0) : v.csmMotionSyncGetRequireSampleCount() : (f("Cubism MotionSync Core initialized yet."), 0);
  }
  analyze(v, P, e, a, i, b) {
    if (!this.isInitialized())
      return f("Cubism MotionSync Core initialized yet."), !1;
    if (v == null)
      return f("context is null."), !1;
    const n = new Array(a);
    for (let g = 0; g < a; g++)
      n[g] = P[g + e];
    return c9.Free(this._analyzeSamplesPtr), this._analyzeSamplesPtr = c9.ConvertNumberArrayToFloatArrayPtr(n), v.csmMotionSyncAnalyze(
      this._analyzeSamplesPtr,
      a,
      i,
      b
    ) == Live2DCubismMotionSyncCore.csmMotionSyncTrue;
  }
  isInitialized() {
    return this._isEngineInitialized;
  }
}
var g9;
((r) => {
  r.CubismMotionSyncEngineLib = I9;
})(g9 || (g9 = {}));
class k9 {
  constructor(v) {
    t(this, "_versionNumber");
    t(this, "_major");
    t(this, "_minor");
    t(this, "_patch");
    this._versionNumber = v, this._major = (this._versionNumber & 4278190080) >> 24, this._minor = (this._versionNumber & 16711680) >> 16, this._patch = this._versionNumber & 65535;
  }
  getMajor() {
    return this._major;
  }
  getMinor() {
    return this._minor;
  }
  getPatch() {
    return this._patch;
  }
  toString() {
    return this._major + "." + this._minor + "." + this._patch + "(" + this._versionNumber + ")";
  }
}
var s9;
((r) => {
  r.CubismMotionSyncEngineVersion = k9;
})(s9 || (s9 = {}));
class av {
  static initializeEngine(v) {
    let P = new I9();
    const e = P.getEngineName(), a = this.ToEngineType(e), i = P.getEngineVersion(), b = new k9(i);
    if (this._engineMap || (this._engineMap = new N()), this._engineMap.isExist(a) || (f(e.s + " " + b.toString()), !P.initializeEngine(v)))
      return P = void 0, P = null, null;
    let c = null;
    switch (a) {
      case y.EngineType_Cri:
        c = new AP(
          P,
          a,
          e,
          b
        );
        break;
      default:
        return P.disposeEngine(), P = void 0, P = null, null;
    }
    return this._engineMap.appendKey(a), this._engineMap.setValue(a, c), c;
  }
  static getEngine(v) {
    return this._engineMap && this._engineMap.isExist(v) ? this._engineMap.getValue(v) : null;
  }
  static getEngines() {
    const v = new o();
    for (let P = this._engineMap.begin(); P != this._engineMap.end(); P.increment())
      v.pushBack(P.ptr().second);
    return v;
  }
  static releaseEngineNotForce(v) {
    this.releaseEngine(v, !1);
  }
  static releaseEngine(v, P) {
    v.close(P);
  }
  static deleteAllEngine() {
    const v = this.getEngines();
    for (let P = 0; P < v.getSize(); P++)
      v.at(P).close(!0);
    this._engineMap.clear();
  }
  static ToEngineType(v) {
    let P = y.EngineType_Unknown;
    return v.s == "Live2DCubismMotionSyncEngine_CRI" && (P = y.EngineType_Cri), P;
  }
  static deleteAssociation(v) {
    for (let P = this._engineMap.begin(); P != this._engineMap.end(); P.increment())
      if (P.ptr().first == v.getType()) {
        v = void 0, this._engineMap.erase(P);
        break;
      }
  }
}
t(av, "_engineMap");
var o9;
((r) => {
  r.CubismMotionSyncEngineController = av;
})(o9 || (o9 = {}));
let k = !1, Z = !1, p = null, m = null;
const fP = 2;
class d {
  constructor(v, P, e) {
    t(this, "_processorInfoList");
    t(this, "_data");
    this._data = P, this._processorInfoList = new o();
    for (let a = 0; a < (e == null ? void 0 : e.getSize()); a++)
      this._processorInfoList.pushBack(
        new zP(
          e.at(a),
          v,
          P.getSetting(a)
        )
      ), this._processorInfoList.at(a).init(P.getSetting(a));
  }
  /**
   * Cubism MotionSync FrameworkのAPIを使用可能にする。
   *  APIを実行する前に必ずこの関数を実行すること。
   *  一度準備が完了して以降は、再び実行しても内部処理がスキップされます。
   *
   * @param    option      MotionSyncLogOptionクラスのインスタンス
   *
   * @return   準備処理が完了したらtrueが返ります。
   */
  static startUp(v = null) {
    return k ? (f("CubismMotionSyncFramework.startUp() is already done."), k) : (p = v, p != null && Live2DCubismMotionSyncCore.Logging.csmMotionSyncSetLogFunction(
      p.logFunction
    ), k = !0, f("CubismMotionSyncFramework.startUp() is complete."), k);
  }
  /**
   * StartUp()で初期化したCubism MotionSync Frameworkの各パラメータをクリアします。
   * Dispose()したCubism MotionSync Frameworkを再利用する際に利用してください。
   */
  static cleanUp() {
    k = !1, Z = !1, p = null;
  }
  /**
   * Cubism MotionSync Framework内のリソースを初期化してモデルを表示可能な状態にします。
   *     再度Initialize()するには先にDispose()を実行する必要があります。
   */
  static initialize() {
    if (Av(k), !k) {
      j("CubismMotionSyncFramework is not started.");
      return;
    }
    if (Z) {
      j(
        "CubismMotionSyncFramework.initialize() skipped, already initialized."
      );
      return;
    }
    Z = !0, f("CubismMotionSyncFramework.initialize() is complete.");
  }
  /**
   * Cubism MotionSync Framework内の全てのリソースを解放します。
   *      ただし、外部で確保されたリソースについては解放しません。
   *      外部で適切に破棄する必要があります。
   */
  static dispose() {
    if (Av(k), !k) {
      j("CubismMotionSyncFramework is not started.");
      return;
    }
    if (!Z) {
      j(
        "CubismMotionSyncFramework.dispose() skipped, not initialized."
      );
      return;
    }
    Z = !1, f("CubismMotionSyncFramework.dispose() is complete.");
  }
  /**
   * Cubism MotionSync FrameworkのAPIを使用する準備が完了したかどうか
   * @return APIを使用する準備が完了していればtrueが返ります。
   */
  static isStarted() {
    return k;
  }
  /**
   * Cubism MotionSync Frameworkのリソース初期化がすでに行われているかどうか
   * @return リソース確保が完了していればtrueが返ります
   */
  static isInitialized() {
    return Z;
  }
  static create(v, P, e, a) {
    if (!d.isInitialized())
      return;
    const i = ev.create(
      v,
      P,
      e
    );
    if (!i)
      return null;
    const b = new o();
    for (let n = 0; n < i.getSettingCount(); n++) {
      let c = null;
      const g = i.getSetting(n).analysisType;
      switch (g) {
        case y.EngineType_Cri:
          c = this.InitializeEngineCri(
            g,
            i,
            n,
            a
          );
          break;
        default:
          j(
            "[CubismMotionSync.Create] Index{0}: Can not create processor because `AnalysisType` is unknown.",
            n
          );
          break;
      }
      c != null && b.pushBack(c);
    }
    return new d(v, i, b);
  }
  static InitializeEngineCri(v, P, e, a) {
    let i = av.getEngine(v);
    p.engineConfig != null && (m = new jP(), m.engineConfigBuffer = new Int32Array(
      fP
    ), m.engineConfigPtr = Live2DCubismMotionSyncCore.ToPointer.Malloc(
      m.engineConfigBuffer.length * m.engineConfigBuffer.BYTES_PER_ELEMENT
    ), Live2DCubismMotionSyncCore.ToPointer.ConvertEngineConfigCriToInt32Array(
      m.engineConfigBuffer,
      m.engineConfigPtr,
      p.engineConfig.Allocator,
      p.engineConfig.Deallocator
    ));
    const b = m != null ? m.engineConfigPtr : 0;
    i || (i = av.initializeEngine(b));
    let n = null;
    return i && (n = i.CreateProcessor(
      P.getSetting(e).cubismParameterList.getSize(),
      P.getMappingInfoList(e),
      a
    )), n;
  }
  static delete(v) {
    d.isInitialized();
  }
  setSoundBuffer(v, P, e) {
    d.isInitialized() && v < this._processorInfoList.getSize() && (this._processorInfoList.at(v)._sampleBuffer = P, this._processorInfoList.at(v)._sampleBufferIndex = e);
  }
  release() {
    var v;
    if (d.isInitialized()) {
      ev.delete(this._data);
      for (let P = 0; P < this._processorInfoList.getSize(); P++)
        (v = this._processorInfoList.at(P)._processor) == null || v.Close();
    }
  }
  updateParameters(v, P) {
    if (d.isInitialized()) {
      P < 0 && (P = 0);
      for (let e = 0; e < this._processorInfoList.getSize(); e++) {
        this._processorInfoList.at(e)._currentRemainTime += P;
        const i = 1 / this._processorInfoList.at(e)._sampleRate;
        if (this._processorInfoList.at(e)._lastTotalProcessedCount = 0, this._processorInfoList.at(e)._currentRemainTime < i) {
          for (let b = 0; b < this._data.getSetting(e).cubismParameterList.getSize(); b++)
            isNaN(
              this._processorInfoList.at(e)._analysisResult.getValues()[b]
            ) || v.setParameterValueByIndex(
              this._data.getSetting(e).cubismParameterList.at(b).parameterIndex,
              this._processorInfoList.at(e)._lastDampedList.at(b)
            );
          continue;
        }
        this.analyze(v, e), this._processorInfoList.at(e)._currentRemainTime = x.mod(
          this._processorInfoList.at(e)._currentRemainTime,
          i
        );
        for (let b = 0; b < this._data.getSetting(e).cubismParameterList.getSize(); b++)
          isNaN(
            this._processorInfoList.at(e)._analysisResult.getValues()[b]
          ) || v.setParameterValueByIndex(
            this._data.getSetting(e).cubismParameterList.at(b).parameterIndex,
            this._processorInfoList.at(e)._lastDampedList.at(b)
          );
      }
    }
  }
  analyze(v, P) {
    if (!d.isInitialized())
      return;
    const e = this._processorInfoList.at(P)._processor, a = this._processorInfoList.at(P)._sampleBuffer;
    let i = this._processorInfoList.at(P)._sampleBufferIndex;
    if (e == null || this._processorInfoList.at(P)._sampleBuffer == null)
      return;
    let b = null;
    const n = this._processorInfoList.at(P)._blendRatio, c = this._processorInfoList.at(P)._smoothing, g = this._processorInfoList.at(P)._audioLevelEffectRatio, s = a.getSize();
    let A = e.getRequireSampleCount();
    for (let L = 0; L < s && !(s == 0 || s <= i || s - i < e.getRequireSampleCount()); L += A) {
      switch (e.getType()) {
        case y.EngineType_Cri:
          b = e.Analyze(
            a,
            i,
            n,
            c,
            g,
            this._processorInfoList.at(P)._analysisResult
          );
          break;
      }
      if (!b)
        break;
      const M = b.getProcessedSampleCount();
      i += M, this._processorInfoList.at(P)._lastTotalProcessedCount += M;
      for (let T = 0; T < this._data.getSetting(P).cubismParameterList.getSize(); T++) {
        let h = b.getValues()[T];
        if (isNaN(h))
          continue;
        const rv = this._data.getSetting(P).cubismParameterList.at(T).smooth, fv = this._data.getSetting(P).cubismParameterList.at(T).damper;
        h = ((100 - rv) * h + this._processorInfoList.at(P)._lastSmoothedList.at(T) * rv) / 100, this._processorInfoList.at(P)._lastSmoothedList.set(T, h), Math.abs(
          h - this._processorInfoList.at(P)._lastDampedList.at(T)
        ) < fv && (h = this._processorInfoList.at(P)._lastDampedList.at(T)), this._processorInfoList.at(P)._lastDampedList.set(T, h);
      }
      A = e.getRequireSampleCount();
    }
  }
  setBlendRatio(v, P) {
    d.isInitialized() && v < this._processorInfoList.getSize() && (this._processorInfoList.at(v)._blendRatio = P);
  }
  SetSmoothing(v, P) {
    d.isInitialized() && v < this._processorInfoList.getSize() && (this._processorInfoList.at(v)._smoothing = P);
  }
  SetSampleRate(v, P) {
    d.isInitialized() && v < this._processorInfoList.getSize() && (this._processorInfoList.at(v)._sampleRate = P);
  }
  getData() {
    return this._data;
  }
  getLastTotalProcessedCount(v) {
    return this._processorInfoList.at(v)._lastTotalProcessedCount;
  }
}
class QP {
  constructor() {
    t(this, "engineConfig");
    t(this, "logFunction");
    // ログ出力の関数オブジェクト
    t(this, "loggingLevel");
  }
  // ログ出力レベルの設定
}
class jP {
  constructor() {
    t(this, "engineConfigBuffer");
    t(this, "engineConfigPtr");
  }
}
class zP {
  constructor(v, P, e) {
    t(this, "_processor");
    t(this, "_blendRatio");
    t(this, "_smoothing");
    t(this, "_sampleRate");
    t(this, "_audioLevelEffectRatio");
    // Unused
    t(this, "_sampleBuffer");
    t(this, "_sampleBufferIndex");
    t(this, "_model");
    t(this, "_analysisResult");
    t(this, "_currentRemainTime");
    t(this, "_lastSmoothedList");
    t(this, "_lastDampedList");
    t(this, "_lastTotalProcessedCount");
    this._processor = v, this._blendRatio = 0, this._smoothing = 1, this._sampleRate = 30, this._audioLevelEffectRatio = 0, this._sampleBuffer = null, this._sampleBufferIndex = 0, this._model = P, this._currentRemainTime = 0, this._lastTotalProcessedCount = 0, this.init(e), this._analysisResult = this._processor.createAnalysisResult();
  }
  init(v) {
    this._currentRemainTime = 0, this._lastSmoothedList = new o(), this._lastDampedList = new o();
    for (let P = 0; P < v.cubismParameterList.getSize(); P++) {
      const e = this._model.getParameterValueByIndex(
        v.cubismParameterList.at(P).parameterIndex
      );
      this._lastSmoothedList.pushBack(e), this._lastDampedList.pushBack(e);
    }
    this._blendRatio = v.blendRatio, this._smoothing = v.smoothing, this._sampleRate = v.sampleRate, this._lastTotalProcessedCount = 0;
  }
}
var u9;
((r) => {
  r.CubismMotionSync = d;
})(u9 || (u9 = {}));
let gv;
function dP() {
  const r = ["click", "keydown", "touchstart", "mousedown", "pointerdown"];
  gv = new AudioContext();
  const v = () => {
    gv.state === "suspended" && gv.resume().then(() => {
      console.log("Audio context resumed");
    });
  };
  r.forEach((P) => {
    window.addEventListener(P, v, { capture: !0 });
  });
}
function TP() {
  return gv;
}
dP();
const lv = 48e3;
class JP {
  constructor(v) {
    t(this, "audioBuffer", null);
    t(this, "audioSource", null);
    t(this, "previousSamplePosition", 0);
    t(this, "audioElapsedTime", 0);
    t(this, "audioContextPreviousTime", 0);
    t(this, "_motionSync", null);
    t(this, "_internalModel");
    t(this, "_model");
    t(this, "soundBuffer", new o());
    this._internalModel = v, this._model = v.coreModel, d.startUp(new QP()), d.initialize();
  }
  get audioContext() {
    return TP();
  }
  async loadAudio(v) {
    const e = await (await fetch(v)).arrayBuffer();
    this.reset(), this.audioBuffer = await this.audioContext.decodeAudioData(e);
  }
  async loadAudioBuffer(v) {
    this.reset(), this.audioBuffer = v;
  }
  resetMouthStatus() {
    try {
      if (!this._motionSync) return;
      const v = this._motionSync.getData().getSetting(0);
      if (!v) return;
      const P = v.cubismParameterList;
      if (!P) return;
      const e = P._ptr.map(
        (a) => a.parameterIndex
      );
      for (const a of e)
        this._model.setParameterValueByIndex(a, 0);
    } catch (v) {
      console.error(v);
    }
  }
  reset() {
    this.resetMouthStatus(), this.audioSource && (this.audioSource.stop(), this.audioSource.disconnect(), this.audioSource = null), this.audioContextPreviousTime = 0, this.previousSamplePosition = 0, this.audioElapsedTime = 0, this.soundBuffer.clear(), this.soundBuffer = new o();
  }
  async play(v) {
    return new Promise(async (P, e) => {
      typeof v == "string" ? await this.loadAudio(v) : await this.loadAudioBuffer(v), this.audioBuffer ? (this.audioSource = this.audioContext.createBufferSource(), this.audioSource.buffer = this.audioBuffer, this.audioSource.connect(this.audioContext.destination), this.audioSource.start(0), this.audioSource.onended = () => {
        P();
      }, this.audioContextPreviousTime = this.audioContext.currentTime) : e(new Error("audioBuffer is null"));
    });
  }
  updateMotionSync() {
    if (!this.audioBuffer || !this.audioSource)
      return;
    const v = this.audioContext.currentTime;
    v <= this.audioContextPreviousTime && (this.audioContextPreviousTime = v);
    const P = v - this.audioContextPreviousTime;
    this.audioElapsedTime += P;
    const e = Math.floor(
      this.audioElapsedTime * this.audioBuffer.sampleRate
    );
    if (this.previousSamplePosition <= this.audioBuffer.length) {
      const a = this.audioBuffer.getChannelData(0).slice(this.previousSamplePosition, e);
      for (let b = 0; b < a.length; b++)
        this.soundBuffer.pushBack(a[b]);
      if (!this._motionSync) return;
      this._motionSync.setSoundBuffer(0, this.soundBuffer, 0), this._motionSync.updateParameters(this._model, P);
      const i = this._motionSync.getLastTotalProcessedCount(0);
      this.removeProcessedData(i), this.audioContextPreviousTime = v, this.previousSamplePosition = e;
    }
  }
  modelUpdateWithMotionSync() {
    if (!this._motionSync) return;
    const P = this._internalModel, e = P.motionManager.update;
    P.motionManager.update = (...a) => {
      e.apply(this._internalModel.motionManager, a), this.updateMotionSync();
    };
  }
  removeProcessedData(v) {
    const P = this.soundBuffer;
    if (v < P.getSize())
      return !(P != null && P.begin()) || (P == null ? void 0 : P._size) <= v || (P._ptr.splice(0, v), P._size -= v), P;
  }
  loadMotionSync(v, P = lv) {
    if (v == null || v.byteLength == 0) {
      console.warn("Failed to loadMotionSync().");
      return;
    }
    this._motionSync = d.create(
      this._model,
      v,
      v.byteLength,
      P
    ), this.modelUpdateWithMotionSync();
  }
  async loadDefaultMotionSync(v = lv) {
    const P = new URL("data:application/json;base64,ewogICJWZXJzaW9uIjogMSwKICAiTWV0YSI6IHsKICAgICJTZXR0aW5nQ291bnQiOiAxLAogICAgIkRpY3Rpb25hcnkiOiBbCiAgICAgIHsKICAgICAgICAiSWQiOiAiTW90aW9uU3luY1NldHRpbmczIiwKICAgICAgICAiTmFtZSI6ICJWb3dlbHNfQ1JJIgogICAgICB9CiAgICBdCiAgfSwKICAiU2V0dGluZ3MiOiBbCiAgICB7CiAgICAgICJJZCI6ICJNb3Rpb25TeW5jU2V0dGluZzMiLAogICAgICAiQW5hbHlzaXNUeXBlIjogIkNSSSIsCiAgICAgICJVc2VDYXNlIjogIk1vdXRoIiwKICAgICAgIkN1YmlzbVBhcmFtZXRlcnMiOiBbCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiTW91dGhfT3BlbiIsCiAgICAgICAgICAiSWQiOiAiUGFyYW1Nb3V0aE9wZW5ZIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIkRhbXBlciI6IDAuMCwKICAgICAgICAgICJTbW9vdGgiOiAyNQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiQSIsCiAgICAgICAgICAiSWQiOiAiUGFyYW1BIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIkRhbXBlciI6IDAuMCwKICAgICAgICAgICJTbW9vdGgiOiAyNQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiSSIsCiAgICAgICAgICAiSWQiOiAiUGFyYW1JIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIkRhbXBlciI6IDAuMCwKICAgICAgICAgICJTbW9vdGgiOiAyNQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiVSIsCiAgICAgICAgICAiSWQiOiAiUGFyYW1VIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIkRhbXBlciI6IDAuMCwKICAgICAgICAgICJTbW9vdGgiOiAyNQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiRSIsCiAgICAgICAgICAiSWQiOiAiUGFyYW1FIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIkRhbXBlciI6IDAuMCwKICAgICAgICAgICJTbW9vdGgiOiAyNQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiTyIsCiAgICAgICAgICAiSWQiOiAiUGFyYW1PIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIkRhbXBlciI6IDAuMCwKICAgICAgICAgICJTbW9vdGgiOiAyNQogICAgICAgIH0KICAgICAgXSwKICAgICAgIkF1ZGlvUGFyYW1ldGVycyI6IFsKICAgICAgICB7CiAgICAgICAgICAiTmFtZSI6ICJTaWxlbmNlIiwKICAgICAgICAgICJJZCI6ICJTaWxlbmNlIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIlNjYWxlIjogMS4wLAogICAgICAgICAgIkVuYWJsZWQiOiB0cnVlCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiTmFtZSI6ICJBIiwKICAgICAgICAgICJJZCI6ICJBIiwKICAgICAgICAgICJNaW4iOiAwLjAsCiAgICAgICAgICAiTWF4IjogMS4wLAogICAgICAgICAgIlNjYWxlIjogMC4zMDAwMDAwMTE5MjA5Mjg5NiwKICAgICAgICAgICJFbmFibGVkIjogdHJ1ZQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiSSIsCiAgICAgICAgICAiSWQiOiAiSSIsCiAgICAgICAgICAiTWluIjogMC4wLAogICAgICAgICAgIk1heCI6IDEuMCwKICAgICAgICAgICJTY2FsZSI6IDEuMCwKICAgICAgICAgICJFbmFibGVkIjogdHJ1ZQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiVSIsCiAgICAgICAgICAiSWQiOiAiVSIsCiAgICAgICAgICAiTWluIjogMC4wLAogICAgICAgICAgIk1heCI6IDEuMCwKICAgICAgICAgICJTY2FsZSI6IDEuNSwKICAgICAgICAgICJFbmFibGVkIjogdHJ1ZQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiRSIsCiAgICAgICAgICAiSWQiOiAiRSIsCiAgICAgICAgICAiTWluIjogMC4wLAogICAgICAgICAgIk1heCI6IDEuMCwKICAgICAgICAgICJTY2FsZSI6IDYuMCwKICAgICAgICAgICJFbmFibGVkIjogdHJ1ZQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIk5hbWUiOiAiTyIsCiAgICAgICAgICAiSWQiOiAiTyIsCiAgICAgICAgICAiTWluIjogMC4wLAogICAgICAgICAgIk1heCI6IDEuMCwKICAgICAgICAgICJTY2FsZSI6IDguMCwKICAgICAgICAgICJFbmFibGVkIjogdHJ1ZQogICAgICAgIH0KICAgICAgXSwKICAgICAgIk1hcHBpbmdzIjogWwogICAgICAgIHsKICAgICAgICAgICJUeXBlIjogIlNoYXBlIiwKICAgICAgICAgICJJZCI6ICJTaWxlbmNlIiwKICAgICAgICAgICJUYXJnZXRzIjogWwogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtTW91dGhPcGVuWSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMC4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1BIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbUkiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtVSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMC4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1FIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbU8iLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9CiAgICAgICAgICBdCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiVHlwZSI6ICJTaGFwZSIsCiAgICAgICAgICAiSWQiOiAiQSIsCiAgICAgICAgICAiVGFyZ2V0cyI6IFsKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbU1vdXRoT3BlblkiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDEuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtQSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMS4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1JIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbVUiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtRSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMC4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1PIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfQogICAgICAgICAgXQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIlR5cGUiOiAiU2hhcGUiLAogICAgICAgICAgIklkIjogIkkiLAogICAgICAgICAgIlRhcmdldHMiOiBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1Nb3V0aE9wZW5ZIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAxLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbUEiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtSSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMS4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1VIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbUUiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtTyIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMC4wCiAgICAgICAgICAgIH0KICAgICAgICAgIF0KICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJUeXBlIjogIlNoYXBlIiwKICAgICAgICAgICJJZCI6ICJVIiwKICAgICAgICAgICJUYXJnZXRzIjogWwogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtTW91dGhPcGVuWSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMS4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1BIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbUkiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtVSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMS4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1FIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbU8iLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9CiAgICAgICAgICBdCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAiVHlwZSI6ICJTaGFwZSIsCiAgICAgICAgICAiSWQiOiAiRSIsCiAgICAgICAgICAiVGFyZ2V0cyI6IFsKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbU1vdXRoT3BlblkiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDEuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtQSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMC4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1JIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbVUiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtRSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMS4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1PIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfQogICAgICAgICAgXQogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIlR5cGUiOiAiU2hhcGUiLAogICAgICAgICAgIklkIjogIk8iLAogICAgICAgICAgIlRhcmdldHMiOiBbCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1Nb3V0aE9wZW5ZIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAxLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbUEiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtSSIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMC4wCiAgICAgICAgICAgIH0sCiAgICAgICAgICAgIHsKICAgICAgICAgICAgICAiSWQiOiAiUGFyYW1VIiwKICAgICAgICAgICAgICAiVmFsdWUiOiAwLjAKICAgICAgICAgICAgfSwKICAgICAgICAgICAgewogICAgICAgICAgICAgICJJZCI6ICJQYXJhbUUiLAogICAgICAgICAgICAgICJWYWx1ZSI6IDAuMAogICAgICAgICAgICB9LAogICAgICAgICAgICB7CiAgICAgICAgICAgICAgIklkIjogIlBhcmFtTyIsCiAgICAgICAgICAgICAgIlZhbHVlIjogMS4wCiAgICAgICAgICAgIH0KICAgICAgICAgIF0KICAgICAgICB9CiAgICAgIF0sCiAgICAgICJQb3N0UHJvY2Vzc2luZyI6IHsKICAgICAgICAiQmxlbmRSYXRpbyI6IDEsCiAgICAgICAgIlNtb290aGluZyI6IDkwLAogICAgICAgICJTYW1wbGVSYXRlIjogNjAuMAogICAgICB9CiAgICB9CiAgXQp9", import.meta.url), a = await (await fetch(P)).arrayBuffer();
    this.loadMotionSync(a, v);
  }
  async loadMotionSyncFromUrl(v, P = lv) {
    try {
      const a = await (await fetch(v)).arrayBuffer();
      this.loadMotionSync(a, P);
    } catch {
      console.warn("Failed to loadMotionSync(). Use default fallback."), await this.loadDefaultMotionSync(P);
    }
  }
}
export {
  JP as MotionSync,
  TP as getAudioContext,
  dP as initAudioContext
};
