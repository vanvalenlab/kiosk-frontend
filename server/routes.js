var controller = require('./controller.js');

module.exports = function(app) {
	app.post('/s3upload', function(request, response){
		console.log("Connected to the /s3upload route.")
		controller.s3upload(request, response);
	})

	app.post('/redis', function(request, response){
		console.log("Connected to the /Redis route.")
		controller.redisConnect(request, response);
	})

	app.get('/getModel', function(request, response){
		console.log("Connected to /getModel route.")
		controller.getModel(request, response);
	})

}