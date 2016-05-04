var express = require('express');
var router = express.Router();

/* GET statuses page. */

//================
// mysql functions
//================

var mysql = require('mysql');
var creds = require('./credentials.js').aws;

var connection = mysql.createPool(creds);

function getStatuses(callback) {
    connection.query('SELECT * FROM `status`',  function(err, results, fields) {
        if (err) {
            return callback(err,'error');
        }
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

function getStatusByID(id, callback) {
    connection.query('SELECT * FROM `status` WHERE printerID = ?', [id], function(err, results, fields) {
        if (err) {
            return callback(err,'error');
        }
        json = JSON.stringify(results[0]);
        return callback(null,json);
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getStatuses(function(request,response) {
        res.send(response);
    });
});

router.get('/:id', function(req,res) {
    getStatusByID(req.params.id, function(request,response) {
        res.send(response);
    });
});

module.exports = router;