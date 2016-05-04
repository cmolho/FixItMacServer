var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');


//================
// nodemailer functions
//================

var creds = require('./credentials.js').gmail;

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP",{
    service: "Gmail",  // sets automatically host, port and connection security settings
    auth: creds
});

//================
// express routing
//================


router.get('/:text/:address', function(req,res) {
    // setup e-mail data
    var mailOptions = {
        from: '"FixItMac" <fixitmacalester@gmail.com>', // sender address
        to: [req.params.address], // list of receivers
        subject: 'Printer Issue Report from FixItMac' , // Subject line
        text: req.params.text   // plaintext body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }
        console.log('Successfully sent email.');
        res.sendStatus(200); //need to send response otherwise it will continually send emails
    });
});

module.exports = router;