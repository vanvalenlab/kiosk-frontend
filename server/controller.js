var axios = require('axios');
var S3Client = require('aws-s3');
//require the node-redis client
const redis = require('redis');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION});
var s3 = new AWS.S3();

// ***********  aws-sdk params ***********
var params = { 
 Bucket: 'deepcell-output',
 Delimiter: '/',
 Prefix: 'models/',
 ContinuationToken: '',
}

// ***********  s3 config ****************
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

// ************* REDIS **********************
//redis options

/*
info: https://www.npmjs.com/package/redis

Example object:
var options = {
	host:,
	port:,
	path:The UNIX socket string of the Redis server,
	url:The URL of the Redis server. Format: [redis:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]],

}

*/

//production host: process.env.REDIS_HOST || 'redis-master'
var options = {
	host: "localhost",
	port: process.env.REDIS_PORT || 6379
}


const client = redis.createClient(options);


module.exports = {
	s3upload: function(request, response) {
		console.log("request received from react.");
		console.log(request);
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
		// client.set(request.body.imageName, request.body.imageURL, redis.print);
		// client.get(request.body.imageURL, function (err, value) {
		// 	if (err) throw(err);
		// 	console.log("Saved. Retrieved value successfully from Redis: ");
		// 	console.log(value);
		// });
		client.hkeys(request.body.imageName, function (err, replies) {
			console.log( replies.length + " replies:" );
            replies.forEach( function (reply, i) {
                console.log( "   " + i + ": " + reply);
            });
            // client.quit();
		});
	},

	getModel: function(request, response){
		console.log("getModel controller function was called.");

		var allKeys = [];

		listAllKeys();

		function listAllKeys(token, cb){
			if(token){
				console.log("Token: "+token);
				params.ContinuationToken = token;
			}

			s3.listObjectsV2(params, function(err, data){
				console.log("S3 keys retrieved: " + data);
				// allKeys = allKeys.concat(data.Contents);
				if(err){
					console.log("Error was reached while attempting to list all s3 keys: " + err);
				}
				if(data.IsTruncated){
					//if the data is truncated, the continuation token will be used to refer where the listing of the keys stopped, so they can
					//then continue parsing the s3 bucket for more keys. i dont believe this is necessary for our project though.
					//we should be consistently hit the else statement when in real usage.
					console.log("Data is truncated! ");
					listAllKeys(data.NextContinuationToken, console.log("Warning, Check controller.getModel code. Continuation token was used: " + data));
			    }
			    else{
			    	console.log("allKeys success: " + allKeys);
					res.send(JSON.stringify(allKeys));
			    }
			});
		}
	}

}
