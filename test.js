const util = require('./util.js');

const fs = require('fs');

fs.readFile('./testimgs/detectface.jpg', function (err, data) {
    if (err) throw err;
    util.detectface(data,(response)=>{
        console.log(response)
    }, (error)=>{
        console.error(error)
    })
});

