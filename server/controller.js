var axios = require('axios');
var S3Client = require('aws-s3');

//s3 config
const config = {
    bucketName: process.env.AWS_S3_BUCKET ,
    region: process.env.AWS_REGION ,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
}

/*
	Example s3 response json:
	{
		"bucket":"deepcell-output",
		"key":"dna_version2.tif",
		"location":"https://deepcell-output.s3.amazonaws.com/dna_version2.tif",
		"result":{}
	}
*/

module.exports = {
	s3upload: function(request, response) {
		console.log("request received from react.");
		console.log(request);
	},

	predict: function(request, response) {

	},

  redisConnect: function(request, response) {
		//testing the API endpoint
		console.log("HTTP POST request received from React: ");
		console.log(request.body.imageName);
		console.log(request.body.imageURL);
    console.log(request.body.model_name);
    console.log(request.body.model_version);

		//if there are any errors whilst connecting to Redis.
		client.on("error", function (err) {
			console.log("Error while communicating with Redis: " + err);
		});
		console.log("Setting the AWS S3 URL to Redis...");
    client.hset( request.body.imageName, "url", request.body.imageURL, redis.print);
    client.hset( request.body.imageName, "model_name", request.body.model_name, redis.print);
    client.hset( request.body.imageName, "model_version", request.body.model_version, redis.print);
    client.hkeys(request.body.imageName, function (err, replies) {
    	console.log( replies.length + " replies:" );
        replies.forEach( function (reply, i) {
          console.log( "   " + i + ": " + reply);
      });
		});
	}

}
