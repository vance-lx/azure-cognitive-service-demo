
const axios = require('axios');
require('dotenv').config()
const querystring = require("querystring");

const detectface = function (image, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = image;
    const params = {
        "returnFaceId": true,
        "returnFaceLandmarks": false,
        "returnFaceAttributes":
            "age,gender,smile,facialHair,headPose,glasses,emotion,hair,makeup,accessories,blur,exposure,noise"
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/detect?${paramstr}`;

    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const createPersonGroup = function (personGroupId, groupName, groupUserData, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = {
        "name": groupName,
        "userData": groupUserData
    };

    const url = `${endpoint}/persongroups/${personGroupId}`;
    httprequest('put', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const deletePersonGroup = function (personGroupId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}`;

    console.log(url);
    httprequest('delete', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const createPersonInGroupPerson = function (groupId, personName, personData, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = {
        "name": personName,
        "userData": personData
    };

    const url = `${endpoint}/persongroups/${groupId}/persons`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const deletePersonOfGroupPerson = function (personGroupId, personId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/persons/${personId}`;

    console.log(url);
    httprequest('delete', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const addFaceToPersonGroupPerson = function (groupId, personId, image, targetFace, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = image;
    const params = {
        "userData": "User-specified data about the target face to add for any purpose. The maximum length is 1KB.   ",
        //"targetFace":"A face rectangle to specify the target face to be added to a person. E.g. "targetFace=10,10,100,100"."
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/persongroups/${groupId}/persons/${personId}/persistedFaces?${paramstr}`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const deleteFaceOfPersonGroupPerson = function (personGroupId, personId, persistedFaceId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/persons/${personId}/persistedFaces/${persistedFaceId}`;

    console.log(url);
    httprequest('delete', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const trainPersonGroup = function (personGroupId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/train `;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const getTrainingStutasOfPersonGroup = function (personGroupId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const url = `${endpoint}/persongroups/${personGroupId}/training`;

    httprequest('get', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const verifyFace = function (faceId, personGroupId, largePersonGroupId, personId, cb, err) {
    const subscriptionKey = process.env.coginitive_service_face_key;
    const endpoint = process.env.coginitive_service_face_endpoint;
    const data = {
        "faceId": faceId,
        "personGroupId": personGroupId,
        "largePersonGroupId": largePersonGroupId,
        "personId": personId

    };

    const url = `${endpoint}/verify`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}


const recognizeText = function (image, cb, err) {
    const subscriptionKey = process.env.coginitive_service_vision_key;
    const endpoint = process.env.coginitive_service_vision_endpoint;
    const data = image;
    const params = {
        "mode": "Handwritten",
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/recognizeText?${paramstr}`;

    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        let resultUrl = response.headers["operation-location"]
        setTimeout(() => {
            httprequest('get', resultUrl, {
                "Ocp-Apim-Subscription-Key": subscriptionKey
            }, data).then(function (response) {
                cb(response.data)
            }).catch(function (e) {
                err(e)
            });
        }, 10000);

    }).catch(function (e) {
        err(e)
    });
}

const ocr = function (image, cb, err) {
    const subscriptionKey = process.env.coginitive_service_vision_key;
    const endpoint = process.env.coginitive_service_vision_endpoint;
    const data = image;
    const params = {
        "language": "unk",
        "detectOrientation": true,
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}/ocr?${paramstr}`;
    console.log(url);

    httprequest('post', url, {
        "Content-Type": "application/octet-stream",
        "Ocp-Apim-Subscription-Key": subscriptionKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textAnalyticsInLanguages = function (documents, cb, err) {
    const textAnalyticsKey = process.env.coginitive_service_text_analytics_key;
    const textAnalyticsEndpoint = process.env.coginitive_service_text_analytics_endpoint;

    const data = {
        "documents": documents
    };
    const url = `${textAnalyticsEndpoint}/languages`;
    console.log(JSON.stringify(data));
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": textAnalyticsKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textAnalyticsInKeyPhrases = function (documents, cb, err) {
    const textAnalyticsKey = process.env.coginitive_service_text_analytics_key;
    const textAnalyticsEndpoint = process.env.coginitive_service_text_analytics_endpoint;

    const data = {
        "documents": documents
    };
    const url = `${textAnalyticsEndpoint}/keyPhrases`;
    console.log(JSON.stringify(data));
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": textAnalyticsKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textAnalyticsInSentiment = function (documents, cb, err) {
    const textAnalyticsKey = process.env.coginitive_service_text_analytics_key;
    const textAnalyticsEndpoint = process.env.coginitive_service_text_analytics_endpoint;
    console.log("textAnalyticsInSentiment");
    const data = {
        "documents": documents
    };
    const url = `${textAnalyticsEndpoint}/sentiment`;
    console.log(JSON.stringify(data));
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": textAnalyticsKey
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const bingSearchNews = function (strSearch, cb, err) {
    const bingSearchKey = process.env.coginitive_service_bing_search_key;
    const bingSearchEndpoint = process.env.coginitive_service_bing_search_endpoint;

    const params = {
        "q": strSearch,
        "count": 10,
        "offset": 0,
        "mkt": "en-us",// "zh-cn",
        //"safeSearch":"Moderate",
        //"freshness":"month"
    };

    const paramstr = querystring.stringify(params);
    const url = `${bingSearchEndpoint}/news/search?${paramstr}`;
    console.log(url);
    httprequest('get', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": bingSearchKey
    }, null).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const textTranslate = function (strArr, cb, err) {
    const key = process.env.coginitive_service_text_translator_key;
    const endpoint = process.env.coginitive_service_text_translator_endpoint2;

    const data = strArr;
    const params = {
        "api-version": "3.0",
        "to": "en",
        "to": "zh"
    };

    const paramstr = querystring.stringify(params);
    const url = `${endpoint}?${paramstr}`;
    console.log(url);
    httprequest('post', url, {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": key
    }, data).then(function (response) {
        cb(response.data)
    }).catch(function (e) {
        err(e)
    });
}

const recognizeSpeech = function (recData, cb, err) {
    var request = require('request');

    console.log("speech to text is running!");
    var speechKey = process.env.coginitive_service_speech_key;
    var tokenpoint = process.env.coginitive_service_speech_token_endpoint;
    var ttspoint = process.env.coginitive_service_speech_tts_endpoint;
    var sttpoint = process.env.coginitive_service_speech_stt_endpoint;
    var data = recData;
    const params = {
        "language": "en-US",
    };

    const paramstr = querystring.stringify(params);
    const url2 = `${sttpoint}/?${paramstr}`;

    httprequest('post', url2, {
        'Ocp-Apim-Subscription-Key': speechKey,
        'Content-Type': "audio/wav; codec=audio/pcm; samplerate=16000",
        'Accept': "application/json"
        // 'Transfer-Encoding': "chunked",
        // 'Expect': "100-continue"
    }, data).then(function (response) {
        console.log("stt respose:" + response);
        if (response.status == 200)
            cb(response.data);
        console.log(response.data.DisplayText);

    }).catch(function (e) {
        err(e);
    });
}

const textToSpeech = function (strSpeech, cb, err) {
    console.log("speech to text -- " + strSpeech);
    var request = require('request');
    var xmlbuilder = require('xmlbuilder');
    var fs = require('fs');
    var wav = require('wav');
    var Speaker = require('speak');

    var apiKey = process.env.coginitive_service_speech_key;
    var ep = "https://westus.tts.speech.microsoft.com/cognitiveservices/v1";
    var ssml_doc = xmlbuilder.create('speak')
        .att('version', '1.0')
        .att('xml:lang', 'en-us')
        .ele('voice')
        .att('xml:lang', 'en-us')
        .att('xml:gender', 'Male')
        .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, Guy24KRUS)')
        .txt(strSpeech)
        .end();
    var post_speak_data = ssml_doc.toString();
    var sttPath = '/sttTemp.wav';
    var sttPort = 5001;

    try {
        request.post({

            url: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken',
            headers: {
                'Ocp-Apim-Subscription-Key': apiKey,
                'Content-Type': "application/x-www-form-urlencoded"
            }

        }, function (err, resp, access_token) {
            if (err || resp.statusCode != 200) {
                console.log(err, resp.body);
            } else {
                console.log("step 3");

                var server = require('http').createServer(function (req, res) {
                    res.writeHead(200, { 'Content-Type': 'video/mp4' });
                    var rs = fs.createReadStream('.' + sttPath);

                    rs.on('data', function (chunk) {
                        res.write(chunk);
                    });
                    //rs.pipe(res);
                    rs.on('end', function () {
                        res.end();
                    });
                }).listen(sttPort);

                server.on('error', function (err) {
                    console.log(err);
                });

                os = require('os');

                console.log(os.hostname());

                request.post({
                    url: ep,
                    body: post_speak_data,
                    headers: {
                        'content-type': 'application/ssml+xml',
                        'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
                        'Authorization': 'Bearer ' + access_token,
                        'User-Agent': 'Test TTS APP',
                    },
                    encoding: null
                }, function (err, resp, speak_data) {
                    console.log("step 4");
                    if (resp.statusCode == 200) {
                        fs.writeFileSync('.' + sttPath, speak_data);
                        var os = require('os');
                        var interfaces = os.networkInterfaces();
                        var IPv4 = '127.0.0.1';
                        for (var key in interfaces) {
                            var alias = 0;
                            interfaces[key].forEach(function (details) {
                                if (details.family == 'IPv4' && key == 'en0') {
                                    IPv4 = details.address;
                                }
                            });
                        }
                        var rp = 'http://' + IPv4 + ':' + sttPort + sttPath;
                        console.log(rp);
                        cb(rp);
                    }
                });
            }
        });
    } catch (e) {
        console.log(e.message);
        err(e);
    }
}


const httprequest = function (method, url, headers, data) {

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    })
}


module.exports = {
    detectface: detectface,
    recognizeText: recognizeText,
    ocr: ocr,

    createPersonGroup: createPersonGroup,
    deletePersonGroup: deletePersonGroup,
    createPersonInGroupPerson: createPersonInGroupPerson,
    deletePersonOfGroupPerson: deletePersonOfGroupPerson,
    addFaceToPersonGroupPerson: addFaceToPersonGroupPerson,
    deleteFaceOfPersonGroupPerson: deleteFaceOfPersonGroupPerson,
    trainPersonGroup: trainPersonGroup,
    getTrainingStutasOfPersonGroup: getTrainingStutasOfPersonGroup,
    verifyFace: verifyFace,

    textAnalyticsInLanguages: textAnalyticsInLanguages,
    textAnalyticsInKeyPhrases: textAnalyticsInKeyPhrases,
    textAnalyticsInSentiment: textAnalyticsInSentiment,
    bingSearchNews: bingSearchNews,
    textTranslate: textTranslate,
    recognizeSpeech: recognizeSpeech,
    textToSpeech: textToSpeech
}