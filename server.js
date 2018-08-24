let path = require("path");
let express = require("express");

var DIST_DIR = path.join(__dirname, "dist"),
	PORT = 8000,
	app = express();

//Serving the files on the dist folder
app.use(express.static(path.join(__dirname, 'dist')));

//Routes requirement
var route_setter = require('./server/routes.js');
route_setter(app);


//listen on port 3000 as specified above.
app.listen(PORT);
console.log("Node server running on port: " + PORT);

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
