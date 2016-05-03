var express = require('express');
var router = express.Router();

/* GET printers page. */

//================
// mysql functions
//================

var mysql = require('mysql');
var creds = require('./credentials.json').aws;

var connection = mysql.createPool(creds);

function getPrinters(callback) {
    connection.query('SELECT * FROM `printer`',  function(err, results, fields) {
        if (err) {
            //console.log('Error while performing printer Query: ', err);
            return callback(err,'error');
        }
        //console.log('Successful printer query: \tAll Printers');
        json = JSON.stringify(results);
        return callback(null,json);
    });
}

function getPrinterByID(id, callback) {
    connection.query('SELECT * FROM `printer` WHERE printerID = ?', [id], function(err, results, fields) {
        if (err) {
            //console.log('Error while performing printer Query: ', err);
            return callback(err,'error');
        }
        //console.log('Successful printer query: \tPrinter #', id);
        json = JSON.stringify(results[0]);
        return callback(null,json);
    });
}

function setIssue(id,issue,callback) {
    connection.query('UPDATE `printer` SET printerStatus=0 WHERE printerID=?; UPDATE `status` SET ??=0 WHERE printerID=?;', [id,issue,id], function(err, results, fields) {
        if (err) {
            //console.log('Error while setting printer issue: ', err);
            return callback(err,'error');
        }
        //console.log('Successful printer status set to 0: \tPrinter #', id);
        return callback(null,'success');
    });
}

function setIssueOther(id,description,callback) { //TODO this doesn't work, thinks description is a column
    connection.query('UPDATE `printer` SET printerStatus=0 WHERE printerID=?; UPDATE `status` SET otherStatus=0,otherStatusDescription=?? WHERE printerID=?;', [id,description,id], function(err, results, fields) {
        if (err) {
            //console.log('Error while setting printer issue: ', err);
            return callback(err,'error');
        }
        //console.log('Successful printer status set to 0: \tPrinter #', id);
        return callback(null,'success');
    });
}

function setWorking(id,issue,callback) {
    connection.query('UPDATE `status` SET ??=1 WHERE printerID=?;', [issue,id], function(err, results, fields) {
        if (err) {
            //console.log('Error while setting printer working: ', err);
            return callback(err,'error');
        }
        //console.log('Successful printer status set to 1: \tPrinter #', id);
        return callback(null,'success');
    });
}

//// Used to check setWorking
function getStatusByID(id, callback) {
    connection.query('SELECT * FROM `status` WHERE printerID = ?', [id], function(err, results, fields) {
        if (err) {
            //console.log('Error while performing status Query: ', err);
            return callback(err,'error');
        }
        //console.log('Successful status query: \tPrinter #', id);
        json = JSON.stringify(results[0]);
        return callback(null,json);
    });
}

function setWorkingAll(id,callback) {
    connection.query('UPDATE `printer` SET printerStatus=1 WHERE printerID=?; UPDATE `status` SET inkStatus=1,paperStatus=1,jamStatus=1,otherStatus=1 WHERE printerID=?;', [id,id], function(err, results, fields) {
        if (err) {
            //console.log('Error while setting printer working: ', err);
            return callback(err,'error');
        }
        //console.log('Successful printer status set to 1: \tPrinter #', id);
        return callback(null,'success');
    });
}

//================
// express routing
//================

router.get('/', function(req,res) {
    getPrinters(function(request,response) {
        //json = response;
        //res.header('Access-Control-Allow-Origin', '*');
        res.send(response);
    });
});

router.get('/:id', function(req,res) {
    getPrinterByID(req.params.id, function(request,response) {
        //json = response;
        //res.header('Access-Control-Allow-Origin', '*');
        res.send(response);
    });
});

router.post('/:id/setissue/:issue', function(req,res) {
    setIssue(req.params.id,req.params.issue,function(request,response) {
        //json = response;
        //res.header('Access-Control-Allow-Origin', '*');
        res.send(response);
    });
});

router.post('/:id/setissue/otherStatus/:description', function(req,res) {
    setIssueOther(req.params.id,req.params.description, function(request,response) {
        //json = response;
        //res.header('Access-Control-Allow-Origin', '*');
        res.send(response);
    });
});

router.get('/:id/setworking/:issue', function(req,res) {
    var printer;
    var status;
    getPrinterByID(req.params.id, function(request,response) {
        printer = JSON.parse(response);
        setWorking(req.params.id,req.params.issue,function(request,response) {
            //res.header('Access-Control-Allow-Origin', '*');
            res.render('email', {printer: printer.printerName, location: printer.printerLocation});
        });
    });
});

router.get('/:id/setworking', function(req,res) {
    var printer;
    var status;
    getPrinterByID(req.params.id, function(request,response) {
        printer = JSON.parse(response);
        setWorkingAll(req.params.id,function(request,response) {
            //res.header('Access-Control-Allow-Origin', '*');
            res.render('email', {printer: printer.printerName, location: printer.printerLocation});
        });
    });
});


module.exports = router;