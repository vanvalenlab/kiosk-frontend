var axios = require('axios');
var S3Client = require('aws-s3');
//require the node-redis client
const redis = require('redis');
var AWS = require('aws-sdk');
AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, region: process.env.AWS_REGION});
var s3 = new AWS.S3();
var Promise = require("bluebird");

// ***********  aws-sdk params ***********
var params = { 
 Bucket: 'deepcell-output',
 Delimiter: '/',
 Prefix: 'models/',
 MaxKeys: 2147483647, // Maximum allowed by S3 API
 StartAfter: 'models/'
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

//Controller functions
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

		var allVersions = [];
		//response object
		var responseObject = {};

		//these following functions are called promisified below.
		var listAllModels = function(token, cb){
			if(token){
				console.log("Token: "+token);
				params.ContinuationToken = token;
			}
			return new Promise(function(resolve, reject) {
				//empty container array for returning with response.send to the front-end.
				var allModels = [];
				//aws-sdk s3 object, invoking built-in function listObjectsV2().
				s3.listObjectsV2(params, function(err, data){
					//!!!!!!!!!!!Concat Models Data !!!!!!!!!!!
					console.log("S3 models retrieved: " + JSON.stringify(data));
					allModels = allModels.concat(data.CommonPrefixes);
					// ** RESOLVING THE PROMISE HERE!
					resolve(allModels);

					if(err){
						console.log("Error was reached while attempting to list all s3 models: " + err);
					}
					//if the data object returns a key-value pair called "isTruncated", it will also return a NextContinuationToken automatically
					//in order for us to be able to make subsequent calls. We probably wont need to use this tho...at least until we do.
					if(data.IsTruncated){
						//if the data is truncated, the continuation token will be used to refer where the listing of the keys stopped, so they can
						//then continue parsing the s3 bucket for more keys. i dont believe this is necessary for our project though.
						//we should be consistently hit the else statement when in real usage.
						console.log("Data is truncated! ");
						listAllModels(data.NextContinuationToken, console.log("Warning, Check controller.getModel code. Continuation token was used: " + data));
					}
				})
			})
		}

		var listAllVersions = function(){
			//After retrieving the models, lets use it to retrieve the versions.
			if(allModels.length > 0){
				//set a new parameter object to submit to s3.
				var versionParams = { 
					Bucket: 'deepcell-output',
					Delimiter: '/',
					Prefix: '', //notice the prefix is empty!
					MaxKeys: 2147483647 // Maximum allowed by S3 API
				}
				//for each Model in the allModels array, make the Prefix key-value pair equal to one of the models.
				for(let i = 0; i <= allModels.length; i++){
					//setting the model as the prefix.
					versionParams.Prefix = allModels.Prefix;
					//then make the s3 call to list the versions inside that single model, one at a time :)
					s3.listObjectsV2(versionParams, function(err, data){
						// !!!!!  concat the versions data.  !!!!!!!
						console.log("Versions retrieved: " + JSON.stringify(data.CommonPrefixes));
						allVersions = allVersions.concat(data.CommonPrefixes);
						console.log("Printing the versions container object: " + allVersions);

						if(err){
							console.log("Error was reached while attempting to list all s3 versions: " + err);
						}
					})
				}
			}
		}

		var joinResults = function(){
			//after completing the s3 listing, return a response to the frontend.
			console.log("allModels success: " + JSON.stringify(allModels));
			console.log("allVersions success: " + JSON.stringify(allVersions));
			responseObject.models = allModels;
			responseObject.versions = allVersions;
			console.log("Sending response object with versions and models: " + JSON.stringify(responseObject));
			response.send(responseObject);
		}


		//calling the function defined above.
		listAllModels()
		.then(listAllVersions())
		.then(joinResults())
		.catch(function(error){
			console.log('There was an error while attempting to retrieve models and versions for React:' + error);
		})
	}

}
