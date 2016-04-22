var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');

/* POST email page. */

//================
// nodemailer functions
//================

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport("SMTP",{
    service: "Gmail",  // sets automatically host, port and connection security settings
    auth: {
        user: "fixitmacalester@gmail.com",
        pass: "macalester"
    }
});

//================
// express routing
//================


router.post('/:text/:address', function(req,res) {
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
        console.log('Some sort of email was sent!');
        res.sendStatus(200); //need to send response otherwise it will continually send emails
    });
});

module.exports = router;