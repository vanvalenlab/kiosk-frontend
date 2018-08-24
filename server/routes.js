var controller = require('./controller.js');

module.exports = function(app) {
	app.post('/s3upload', function(request, response){
		controller.s3upload(request, response);
	})

	app.post('/predict', function(request, response){
		controller.predict(request, response);
	})

}