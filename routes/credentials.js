/**
 * Created by codymolho on 5/4/16.
 */

var creds = {"aws": {
    "host"		: process.env.EC2HOST,
    "user"		: "FixItMacServer",
    "password" : process.env.EC2PASS,
    "database" : "FixItMacDatabase",
    "port"		: process.env.EC2PORT,
    "multipleStatements": true
},
    "gmail": {
        "user": "fixitmacalester@gmail.com",
        "pass": process.env.GMAILPASS
    }};

module.exports = creds;