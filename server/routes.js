const redis = require('redis');
const controller = require('./controller.js');

const options = {
	host: process.env.REDIS_HOST || 'redis-master',
	port: process.env.REDIS_PORT || 6379
}

const client = redis.createClient(options);

module.exports = function(app) {
	app.post('/s3upload', function(request, response){
		controller.s3upload(request, response);
	})

	app.post('/predict', function(request, response){
		controller.predict(request, response);
	})

	app.post('/redis', function(request, response){
		console.log("Connected to the /Redis route.")
		controller.redisConnect(request, response);
	})

}
