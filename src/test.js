
const util = require('./util.js');

const fs = require('fs');


function test_createGroup(groupId, groupName, groupUserData) {
    console.log("createGroup Id: " + groupId);
    util.createPersonGroup(groupId, groupName, groupUserData, (response) => {
        console.log(response);
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_createGroupPerson(groupId, personName, personData) {
    console.log("createGroupPerson Id: " + groupId);
    util.createPersonInGroupPerson(groupId, personName, personData, (response) => {
        console.log(response);

    }, (error) => {
        console.error(error);
    })
}

function test_AddFacesToPersonGroup(name, groudId, personId, targetFace) {
    var dir = "./src/testimgs";
    var files = fs.readdirSync(dir);
    console.log(files.length);
    files.forEach(function (filename) {
        console.log("detecting: " + filename)
        if (filename.indexOf(name) != -1) {
            fs.readFile('./src/testimgs/' + filename, function (err, data) {
                if (err) throw err;
                util.addFaceToPersonGroup(groudId, personId, data, targetFace, (response) => {
                    console.log("detected: " + filename)
                    console.log(response);
                    //console.log(JSON.stringify(response, null, 2));

                }, (error) => {
                    console.error(error);
                });
            });
        }
    })
}

function test_TrainPersonGroup(groupId) {
    util.trainPersonGroup(groupId, (response) => {
        console.log(response);
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_getTrainingStatusOfPersonGroup(groupId) {
    util.getTrainingStutasOfPersonGroup(groupId, (response) => {
        console.log(response);
        console.log(JSON.stringify(response, null, 2));
    }, (error) => {
        console.error(error);
    })
}

function test_DetectFace(filePath, filename) {
    var name = filename.substring(0, filename.indexOf(' '));
    fs.readFile(filePath + filename, function (err, data) {
        if (err) throw err;
        util.detectface(data, (response) => {
            console.log("detected: " + filename)
            console.log(JSON.stringify(response, null, 2));
            for (var item of response) {
                console.log("faceId:" + item.faceId);
            }
        }, (error) => {
            console.error(error);
        })
    });
}

function test_VerifyFace(faceId, personGroupId, largePersongroupId, personId) {
    util.VerifyFace(faceId, personGroupId, largePersongroupId, personId, (response) => {
        console.log(response)

    }, (error) => {
        console.error(error);
    })
}

function test_DeletePersonGroup(personGroupId) {
    util.deletePersonGroup(personGroupId, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_DeletePersonOfPersonGroup(personGroupId, personId) {
    util.deletePersonOfGroupPerson(personGroupId, personId, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}

function test_DeleteFaceOfPersonGroupPerson(personGroupId, personId, persistedFaceId) {
    util.deleteFaceOfPersonGroupPerson(personGroupId, personId, persistedFaceId, (response) => {
        console.log(response)
        console.log(JSON.stringify(response, null, 2));

    }, (error) => {
        console.error(error);
    })
}
//test_createGroup("test_pg_01","Test Person Group","group user data");
//test_createGroupPerson("test_pg_01","Ronaldo","user data");
//test_AddFacesToPersonGroup("Ronaldo", "test_pg_01", "1b0c44c5-dce1-4845-8ca0-575c085c6cf7", null);
//test_TrainPersonGroup("test_pg_01");
//test_getTrainingStatusOfPersonGroup("test_pg_01");
//test_DetectFace('./src/verifyImgs/',"Ronaldo 06.jpg");
//test_VerifyFace("184a541b-1980-4862-9626-0a9f187a16e6", "test_pg_01", null, "2a93b29b-af58-4a8a-b094-39169aa7a820");

//test_DeletePersonGroup("test_pg_01");
//test_DeleteFaceOfPersonGroupPerson("test_pg_01","1b0c44c5-dce1-4845-8ca0-575c085c6cf7","e0ecb138-0a22-4ae4-bdb7-ed6d8802a855");
//test_DeletePersonOfPersonGroup("test_pg_01","1b0c44c5-dce1-4845-8ca0-575c085c6cf7");
