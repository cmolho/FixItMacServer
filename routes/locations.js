var express = require('express');
var router = express.Router();

/* GET locations page. */

//================
// mysql functions
//================

var mysql = require('mysql');
var creds = require('./credentials.json').aws;

var connection = mysql.createPool(creds);


function getLocations(callback) {
    connection.query('SELECT * FROM `locationCategory`',  function(err, results, fields) {
        if (err) {
            //console.log('Error while performing location Query: ', err);
            return callback(err,'error');
        }
        //console.log('Successful location query');
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getLocations(function(request,response) {
        //json = response;
        //res.header('Access-Control-Allow-Origin', '*');
        res.send(response);
    });
});

module.exports = router;

