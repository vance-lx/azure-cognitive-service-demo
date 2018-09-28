function init_vision_text_translator() {
    return {
        template: `
        <div style="width:100%" >
            <v-container grid-list-xl>
                <v-layout wrap column>            
                    <v-flex xs12 sm6>
                        <v-flex xs12 sm6 d-flex>
                        <audio controls autoplay></audio> 
                        <input type="button" value="开始录音" @click="startRecording()"/>  
                        <input type="button" value="停止录音" @click="stopRecord()"/>  
                        <input type="button" value="播放录音" @click="playRecord()"/>
                        <input type="button" value="上传录音" @click="uploadAudio()"/>
                        </v-flex>
                        
                        <v-flex xs12 sm6 d-flex>
                        <input type="file" id="audioFile" accept="audio/*.wav" capture>
                        <input type="submit" value="上传文件" @click="loadFile()">
                        </v-flex>

                        <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>

                        <v-flex xs12 sm6 d-flex>
                        <v-subheader v-text="'Translate from '"></v-subheader>

                        <v-select
                        v-model="selectFrom"
                        :items="items"
                        item-text="language"
                        item-value="tag"
                        ></v-select>

                        <v-subheader v-text="' To '"></v-subheader>
                        
                        <v-select 
                        v-model="selectTo"
                        :items="items"
                        item-text="language"
                        item-value="tag"
                        ></v-select>
                        </v-flex>
                    
                        <v-flex xs12>

                        <v-flex xs12 sm6 d-flex>
                        <v-text-field type="text" label="Speech Recongnize Result" clearable id="txt-speech"
                            :value = "recognizeResult"
                            >
                        </v-text-field>
                        <input type="button" value="翻译文本" @click="startTranslate()"/>
                        <input type="button" value="语音阅读" @click="uploadText()"/>
                        </v-flex>

                        <v-text-field type="text" label="Translate Result" 
                        :value="translateResult"
                            >
                        </v-text-field>
                        </v-flex>
                    </v-flex>  
                </v-layout>
            </v-container>
        </div>
`
        ,
        data() {
            return {
                recognizeResult: '',
                translateResult: '',
                languageOutput: 'China',
                languageInput: 'English',
                progressing: false,
                selectFrom: { language: 'English', tag: 'en-US' },
                selectTo: { language: 'Chinese', tag: 'zh-CN' },
                items: [
                    { language: 'English', tag: 'en-US' },
                    { language: 'Arabic', tag: 'ar-EG' },
                    { language: 'Chinese', tag: 'zh-CN' },
                    { language: 'French', tag: 'fr-FR' },
                    { language: 'German', tag: 'de-DE' },
                    { language: 'Italian', tag: 'It-IT' },
                    { language: 'Japanese', tag: 'ja-JP' },
                    { language: 'Portuguese', tag: 'pt-BR' },
                    { language: 'Russian', tag: 'ru-RU' },
                    { language: 'Spanish', tag: 'es-ES' },
                ]
            }
        },
        mounted: function () {
            this.init_audio()
        },
        methods: {
            init_audio() {
                var audio = document.querySelector('audio');
                if (audio.style.display == "none") {
                    audio.style.display = "";
                } else {
                    audio.style.display = "none";
                }
            },
            startRecording() {
                var that = this;
                HZRecorder.get(function (rec) {
                    that.recorder = rec;
                    that.recorder.start();
                });
            },
            stopRecord() {
                var that = this;
                that.recorder.stop();
            },
            playRecord() {
                var that = this;
                var audio = document.querySelector('audio');
                that.recorder.play(audio);
            },
            uploadAudio() {
                var that = this;
                that.progressing = true;
                var record = that.recorder.getBlob();
                axios({
                    method: 'POST',
                    url: '/api/recognizeSpeech',
                    headers: {
                        "Content-Type": "application/octet-stream"
                    },
                    data: record
                }).then(function (response) {
                    const data = response.data;
                    that.recognizeResult = data.DisplayText;
                    that.progressing = false
                }).catch(function (e) {
                    that.progressing = false
                    alert("Server Error!")
                });
            },
            loadFile() {
                var that = this;
                var selectedFile = document.getElementById("audioFile").files[0];
                var name = selectedFile.name;
                var size = selectedFile.size;

                var reader = new FileReader();
                reader.readAsArrayBuffer(selectedFile);
                reader.onload = function () {
                    that.progressing = true
                    axios({
                        method: 'POST',
                        url: '/api/recognizeSpeech',
                        headers: {
                            "Content-Type": "application/octet-stream"
                        },
                        data: this.result
                    }).then(function (response) {
                        const data = response.data;
                        that.recognizeResult = data.DisplayText;
                        that.progressing = false
                    }).catch(function (e) {
                        that.progressing = false
                        alert("Server Error!")
                    });
                };
            },
            startTranslate() {
                var that = this;
                var txt = document.getElementById('txt-speech');
                that.progressing = true
                axios({
                    method: 'GET',
                    url: `/api/textTranslate?keyword=${txt.value}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: null
                }).then(function (response) {
                    const data = response.data;
                    that.translateResult = data[0].translations[0].text;
                    that.progressing = false
                }).catch(function (e) {
                    that.progressing = false
                    alert("Server Error!")
                });
            },
            uploadText() {
                var txt = document.getElementById('txt-speech');
                if (isNull(txt.value))
                    alert("The content is invalid!");
                else {
                    var that = this;
                    that.progressing = true
                    axios({
                        method: 'GET',
                        url: `/api/textToSpeech?keyword=${txt.value}`,
                        headers: {
                            "Content-Type": "application/json"
                        },
                        data: null
                    }).then(function (response) {
                        const data = response.data;
                        var sound = new Audio();
                        sound.src = data;
                        sound.play();
                        that.progressing = false
                    }).catch(function (e) {
                        that.progressing = false
                        alert("Server Error!")
                    });
                }
            }
        }
    }
}

function isNull(str) {
    if (str == "") return true;
    var regu = "^[ ]+$";
    var re = new RegExp(regu);
    return re.test(str);
}