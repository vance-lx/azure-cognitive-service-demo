(function (window) {  
    window.URL = window.URL || window.webkitURL;  
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;  

    var HZRecorder = function (stream, config) {  
        config = config || {};  
        config.sampleBits = config.sampleBits || 16;    
        config.sampleRate = config.sampleRate || (16000);  
        // config.sampleBits = config.sampleBits || 8;    
        // config.sampleRate = config.sampleRate || (44100 / 6);  


        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var context = new AudioContext();

        var audioInput = context.createMediaStreamSource(stream);  

        var volume = context.createGain();  
        audioInput.connect(volume);  

        var bufferSize = 4096;  

        // var recorder = context.createScriptProcessor(bufferSize, 2, 2);  
        var recorder = context.createScriptProcessor(bufferSize, 1, 1);  

        var audioData = {  
            size: 0         
            , buffer: []    
            , inputSampleRate: context.sampleRate    
            , inputSampleBits: config.sampleBits      
            , outputSampleRate: config.sampleRate   
            , outputSampleBits: config.sampleBits     
            , input: function (data) {  
                this.buffer.push(new Float32Array(data));  
                this.size += data.length;  
            }  
            , compress: function () { 
                var data = new Float32Array(this.size);  
                var offset = 0;  
                for (var i = 0; i < this.buffer.length; i++) {  
                    data.set(this.buffer[i], offset);  
                    offset += this.buffer[i].length;  
                }  
                 
                var compression = parseInt(this.inputSampleRate / this.outputSampleRate);  
                var length = data.length / compression;  
                var result = new Float32Array(length);  
                var index = 0, j = 0;  
                while (index < length) {  
                    result[index] = data[j];  
                    j += compression;  
                    index++;  
                }  
                return result;  
            }  
            , encodeWAV: function () {  
                var sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);  
                var sampleBits = Math.min(this.inputSampleBits, this.outputSampleBits);  
                var bytes = this.compress();  
                var dataLength = bytes.length * (sampleBits / 8);  
                var buffer = new ArrayBuffer(44 + dataLength);  
                var data = new DataView(buffer);  

                var channelCount = 1;
                var offset = 0;  

                var writeString = function (str) {  
                    for (var i = 0; i < str.length; i++) {  
                        data.setUint8(offset + i, str.charCodeAt(i));  
                    }  
                };  

                writeString('RIFF'); offset += 4;  
                data.setUint32(offset, 36 + dataLength, true); offset += 4;  
                writeString('WAVE'); offset += 4;  
                writeString('fmt '); offset += 4;  
                data.setUint32(offset, 16, true); offset += 4;  
                data.setUint16(offset, 1, true); offset += 2;  
                data.setUint16(offset, channelCount, true); offset += 2;  
                data.setUint32(offset, sampleRate, true); offset += 4;  
                data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true); offset += 4;  
                data.setUint16(offset, channelCount * (sampleBits / 8), true); offset += 2;  
                data.setUint16(offset, sampleBits, true); offset += 2;  
                writeString('data'); offset += 4;  
                data.setUint32(offset, dataLength, true); offset += 4;  
                if (sampleBits === 8) {  
                    for (var i = 0; i < bytes.length; i++, offset++) {  
                        var s = Math.max(-1, Math.min(1, bytes[i]));  
                        var val = s < 0 ? s * 0x8000 : s * 0x7FFF;  
                        val = parseInt(255 / (65535 / (val + 32768)));  
                        data.setInt8(offset, val, true);  
                    }  
                } else {  
                    for (var i = 0; i < bytes.length; i++, offset += 2) {  
                        var s = Math.max(-1, Math.min(1, bytes[i]));  
                        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);  
                    }  
                }  

                return new Blob([data], { type: 'audio/wav' });  
            }  
        };  

        this.start = function () {  
            audioInput.connect(recorder);  
            recorder.connect(context.destination);  
        };  

        this.stop = function () {  
            recorder.disconnect();  
        };  

        this.getBlob = function () {  
            this.stop();  
            return audioData.encodeWAV();  
        };  

        this.play = function (audio) {  
            audio.src = window.URL.createObjectURL(this.getBlob());  
        };  

        this.upload = function (url, callback) {  
            var fd = new FormData();  
            fd.append('audioData', this.getBlob());  
            var xhr = new XMLHttpRequest();  
            if (callback) {  
                xhr.upload.addEventListener('progress', function (e) {  
                    callback('uploading', e);  
                }, false);  
                xhr.addEventListener('load', function (e) {  
                    callback('ok', e);  
                }, false);  
                xhr.addEventListener('error', function (e) {  
                    callback('error', e);  
                }, false);  
                xhr.addEventListener('abort', function (e) {  
                    callback('cancel', e);  
                }, false);  
            }  
            
            xhr.open('POST', url);  
            xhr.setRequestHeader("Content-Type","application/octet-stream");
            // xhr.send(fd);  
            xhr.send(this.getBlob());  
        };  

        
        recorder.onaudioprocess = function (e) {  
            audioData.input(e.inputBuffer.getChannelData(0));  
        };  

    };  
    
    HZRecorder.throwError = function (message) {  
        throw new function () { this.toString = function () { return message; };};  
    };  
    
    HZRecorder.canRecording = (navigator.getUserMedia != null);  
     
    HZRecorder.get = function (callback, config) {  
        if (callback) {  
            if (navigator.getUserMedia) {  
                navigator.getUserMedia(  
                    { audio: true } 
                    , function (stream) {  
                        var rec = new HZRecorder(stream, config);  
                        callback(rec);  
                    }  
                    , function (error) {  
                        switch (error.code || error.name) {  
                            case 'PERMISSION_DENIED':  
                            case 'PermissionDeniedError':  
                                HZRecorder.throwError('Denied by user.');  
                                break;  
                            case 'NOT_SUPPORTED_ERROR':  
                            case 'NotSupportedError':  
                                HZRecorder.throwError('The browser does not support hardware devices.');  
                                break;  
                            case 'MANDATORY_UNSATISFIED_ERROR':  
                            case 'MandatoryUnsatisfiedError':  
                                HZRecorder.throwError('The designated hardware device cannot be found.');  
                                break;  
                            default:  
                                HZRecorder.throwError('Unable to open microphone. Abnormal information:' + (error.code || error.name));  
                                break;  
                        }  
                    });  
            } else {  
                HZRecorder.throwErr('Recording is not supported in the current browser.'); return;  
            }  
        }  
    };  
    window.HZRecorder = HZRecorder;  

})(window);  