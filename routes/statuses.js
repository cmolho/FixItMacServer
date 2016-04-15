var express = require('express');
var router = express.Router();

/* GET statuses page. */

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

function getStatuses(callback) {
    connection.query('SELECT * FROM `status`',  function(err, results, fields) {
        if (err) {
            console.log('Error while performing status Query: ', err);
            return callback(err,null);
        }
        console.log('Successful status query: \tAll Statuses');
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

function getStatusByID(id, callback) {
    connection.query('SELECT * FROM `status` WHERE printerID = ?', [id], function(err, results, fields) {
        if (err) {
            console.log('Error while performing status Query: ', err);
            return callback(err,null);
        }
        console.log('Successful status query: \tPrinter #', id);
        json = JSON.stringify(results[0]);
        return callback(null,json);
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getStatuses(function(request,response) {
        json = response;
        res.header('Access-Control-Allow-Origin', '*');
        res.send(json);
    });
});

router.get('/:id', function(req,res) {
    getStatusByID(req.params.id, function(request,response) {
        json = response;
        res.header('Access-Control-Allow-Origin', '*');
        res.send(json);
    });
});

module.exports = router;

