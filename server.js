/* *****************Server Dependencies********************* */
const express = require("express");
const cors = require("cors");
const app = express();
//require accessing the fs system
var fs = require('fs')
//Never touch the placement of express and app.
const port = process.env.PORT || 8080;
const path = require('path');
//logger for http middleware
const logger = require('morgan');
//body-parser for parsing http-bodies.
var bodyParser = require('body-parser');

/* *****************Server config********************* */
// create a Logging write stream (in append mode)
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// Log requests to the console.
console.log("Setting up server logging.")
// setup the logger
app.use(logger('combined', {stream: accessLogStream}))

//Enable cors usage
app.use(cors())

//enabling body-parser
// to support JSON-encoded bodies
app.use( bodyParser.json() );
// to support URL-encoded bodies
app.use(bodyParser.urlencoded({
  extended: true
})); 

//Serving the files on the dist folder
var DIST_DIR = path.join(__dirname, "dist");
app.use(express.static(path.join(__dirname, 'dist')));

// Setup a default catch-all route that sends back a welcome message in JSON format.
// app.get('*', (req, res) => res.status(200).send({
// 	message: 'Welcome to the beginning of nothingness.',
// }));

//Routing: telling the server where to derive the logic for routing the application
console.log("Server: setting routes..");
var route_setter = require('./server/routes.js');
route_setter(app);

/* *****************Server Start********************* */
//Listen on
var server = app.listen(port, function(){
	console.log("Server: listening on port: " ,port);
});


/*
PRODUCTION MODE
To run the react interface for production, one must first run "npm run build"
in order to build the dist folder with Webpack's compression capabilities.

Upon successfully building an updated dist folder, one can then run "npm run prod"
in order to start the express server and have all requests going to localhost:8000
display the contents of the webpack dist folder (which would be the react interface).

DEVELOPMENT MODE
If you want to just run the interface in development mode, we use Webpack's Development
server tool instead, which allows for hot-reloading and generally a way better
development experience. Use "npm run start" for this one.
*/
