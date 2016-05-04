var express = require('express');
var router = express.Router();

/* GET locations page. */

//================
// mysql functions
//================

var mysql = require('mysql');
var creds = require('./credentials.js').aws;

var connection = mysql.createPool(creds);


function getLocations(callback) {
    connection.query('SELECT * FROM `locationCategory`',  function(err, results, fields) {
        if (err) {
            return callback(err,'error');
        }
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getLocations(function(request,response) {
        res.send(response);
    });
});

module.exports = router;

