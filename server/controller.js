var axios = require('axios');
var S3Client = require('aws-s3');

//s3 config
const config = {
    bucketName: process.env.S3_BUCKETNAME ,
    region: process.env.S3_REGION ,
    accessKeyId: process.env.S3_ACCESS_KEY_ID ,
    secretAccessKey: process.env.S3_ACCESS_KEY
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

}