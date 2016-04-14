var tls = require('tls');
var fs = require('fs');

var express = require('express');
var app = express();
var mysql = require('mysql');
var nodemailer = require('nodemailer');

var connection = mysql.createConnection({
	host		: 'ec2-54-213-132-214.us-west-2.compute.amazonaws.com',
	user		: 'FixItMacServer',
	password : 'serverpassword',
	database : 'FixItMacDatabase',
	port		: '3306',
	multipleStatements: true
});

// NODEMAILER 
// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP",{
   service: "Gmail",  // sets automatically host, port and connection security settings
   auth: {
       user: "fixitmacalester@gmail.com",
       pass: "macalester"
   }
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});


//=============================
// Functions for mySQL queries
//=============================


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
};

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
};

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
};

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
};

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

};

function setIssue(id,issue,callback) {
	connection.query('UPDATE `printer` SET printerStatus=0 WHERE printerID=?; UPDATE `status` SET ??=0 WHERE printerID=?;', [id,issue,id], function(err, results, fields) {
	   if (err) {
	     console.log('Error while setting printer issue: ', err);
	     return callback(err,null);
	   }
	   console.log('Successful printer status set to 0: \tPrinter #', id);
	   return callback(null,'success');
	});
};

function setWorking(id,callback) {
	connection.query('UPDATE `printer` SET printerStatus=1 WHERE printerID=?; UPDATE `status` SET inkStatus=1,paperStatus=1,jamStatus=1,otherStatus=1 WHERE printerID=?;', [id,id], function(err, results, fields) {
	   if (err) {
	     console.log('Error while setting printer working: ', err);
	     return callback(err,null);
	   }
	   console.log('Successful printer status set to 1: \tPrinter #', id);
	   return callback(null,'success');
	});
};


//===============
// REST Methods
//===============

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/api/printers', function(req,res) {
	getPrinters(function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(json);
	});
});

app.get('/api/printers/:id', function(req,res) {
	getPrinterByID(req.params.id, function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(json);
	});
});

app.get('/api/statuses', function(req,res) {
	getStatuses(function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(json);
	});
});

app.get('/api/statuses/:id', function(req,res) {
	getStatusByID(req.params.id, function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(json);
	});
});

app.get('/api/locations', function(req,res) {
	getLocations(function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send(json);
	});
});

app.post('/api/printers/:id/setissue/:issue', function(req,res) {
	setIssue(req.params.id,req.params.issue,function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send('success');
	});
	//TODO: implement otherIssue text input
});

app.post('/api/printers/:id/setworking', function(req,res) {
	setWorking(req.params.id,function(request,response) {
		json = response;
		res.header('Access-Control-Allow-Origin', '*');
		res.send('success');
	});
});

// NODEMAILER 
app.post('/api/email/:text', function(req,res) {
	// setup e-mail data
	var mailOptions = {
		from: '"FixItMac" <fixitmacalester@gmail.com>', // sender address
		to: ['cmolho@macalester.edu'], // list of receivers
		subject: 'Printer Issue Report from FixItMac' , // Subject line
		text: req.params.text   // plaintext body
	};

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Some sort of email was sent!');
		res.sendStatus(200); //need to send response otherwise it will continually send emails
    });
});

//=================
// Open Connection
//=================

console.log("App listening on port 8080");
app.listen(8080);
