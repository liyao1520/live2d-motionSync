/**
 * Copyright(c) Live2D Inc. All rights reserved.
 *
 * Use of this source code is governed by the Live2D Open Software license
 * that can be found at https://www.live2d.com/eula/live2d-open-software-license-agreement_en.html.
 */

class LAppAudioWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.useChannel = 0;
  }

  process(inputs, outputs, parameters) {
    const channel = this.useChannel % inputs[0].length;
    const input = inputs[0][channel];
    if (input == undefined || input == null) {
      return true;
    }

    // 後ろに追加する
    const audioBuffer = Float32Array.from([...input]);

    this.port.postMessage({
      eventType: "data",
      audioBuffer: audioBuffer,
    });

    let inputArray = inputs[0];
    let output = outputs[0];
    for (let currentChannel = 0; currentChannel < inputArray.length; ++currentChannel) {
      let inputChannel = inputArray[currentChannel];
      let outputChannel = output[currentChannel];
      for (let i = 0; i < inputChannel.length; ++i){
        outputChannel[i] = inputChannel[i];
      }
    }

    return true;
  }
}

registerProcessor('lappaudioworkletprocessor', LAppAudioWorkletProcessor);
