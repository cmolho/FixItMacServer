var express = require('express');
var router = express.Router();

/* GET printers page. */

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

function getPrinters(callback) {
    connection.query('SELECT * FROM `printer`',  function(err, results, fields) {
        if (err) {
            console.log('Error while performing printer Query: ', err);
            return callback(err,null);
        }
        console.log('Successful printer query: \tAll Printers');
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

function getPrinterByID(id, callback) {
    connection.query('SELECT * FROM `printer` WHERE printerID = ?', [id], function(err, results, fields) {
        if (err) {
            console.log('Error while performing printer Query: ', err);
            return callback(err,null);
        }
        console.log('Successful printer query: \tPrinter #', id);
        json = JSON.stringify(results[0]);
        return callback(null,json);
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getPrinters(function(request,response) {
        json = response;
        res.header('Access-Control-Allow-Origin', '*');
        res.send(json);
    });
});

router.get('/:id', function(req,res) {
    getPrinterByID(req.params.id, function(request,response) {
        json = response;
        res.header('Access-Control-Allow-Origin', '*');
        res.send(json);
    });
});



module.exports = router;

