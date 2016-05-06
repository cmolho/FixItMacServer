
# FixItMac Server
FixItMac is a mobile application that helps students report problems that they are experiencing with a printer on campus in only a few clicks. It also serves to indicate which printers are in working-order and are available for use.
This is the code for the server, deployed on Heroku. 
 * To access the full code of the application, visit the main project page:
   https://github.com/cmolho/FixItMac
 * For more information, please email fixitmacalester@gmail.com
 

## Built With
* Node
* Express
* node-mysql
* Nodemailer
* Jade
* Amazon AWS
* Heroku

## Installation and Local Development
1. Install Node.js if you do not already have it (https://nodejs.org/en/)
2. Run `npm install` from the main directory to install dependencies
3. To run the server locally, run `npm start` from the main directory. The server runs locally on port 8081 by default; this can be changed in the startup script /bin/www, line 15. 

## Known Bugs
* The links to set individual printer statuses to "working," defined in routes/printers.js lines 110-119, do not check to see if the overall status of the printer should be set to "working," enabling a state where all individual statuses are working but the overall status is broken. 
* If given a description for "otherIssue," the database query does not update the otherStatusDescription field in the database (routes/printers.js line 45). It gives the error that the given description is not a field in the database, but the description should be the value for field otherStatusDescription. 

##Future Features
Once the current app is used by many students and gets positive feedback, FixItMac plans to extend its service to variety of issues, including projector malfunction, broken stalls, washing machines, driers, etc. As such, the server and database will need to reflect these new fields. 

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request

## History
FixItMac was created by students at Macalester College throughout their duration in a Software Design and Development course in the spring of 2016.

## Authors
Current server maintainers:
 * Cody Molho - https://github.com/cmolho