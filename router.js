var express = require('express');
var crypto = require('crypto');
var axios = require('axios');
var util = require('./util.js');
var stringify = require('json-stringify-safe');
var router = express.Router();


router.get('/hello', function (req, res) {
    
    
    res.send("hello")

});


router.post('/detectface', function (req, res) {
    
    
    util.detectface(req.body,(response)=>{
        res.json(response)
    }, (error)=>{
        res.send(JSON.parse(stringify(error)))
    })

});



module.exports = router;