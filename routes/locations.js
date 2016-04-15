var express = require('express');
var router = express.Router();

/* GET locations page. */

//================
// mysql functions
//================

var mysql = require('mysql');

var connection = mysql.createPool({
    host		: 'ec2-54-213-132-214.us-west-2.compute.amazonaws.com',
    user		: 'FixItMacServer',
    password : 'serverpassword',
    database : 'FixItMacDatabase',
    port		: '3306',
    multipleStatements: true
});


function getLocations(callback) {
    connection.query('SELECT * FROM `locationCategory`',  function(err, results, fields) {
        if (err) {
            console.log('Error while performing location Query: ', err);
            return callback(err,null);
        }
        console.log('Successful location query');
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getLocations(function(request,response) {
        json = response;
        res.header('Access-Control-Allow-Origin', '*');
        res.send(json);
    });
});

module.exports = router;

