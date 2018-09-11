import httpStatus from 'http-status';
import redis from 'redis';
import AWS from 'aws-sdk';
import config from '../config/config';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const s3 = new AWS.S3();

const redisClient = redis.createClient(config.redis);

async function redisConnect(req, res) {
  //testing the API endpoint
  console.log(`HTTP POST request received from React: ${JSON.stringify(req.body)}`);

  //if there are any errors whilst connecting to Redis.
  redisClient.on('error', (err) => {
    console.log(`Error while communicating with Redis: ${err}`);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  });

  console.log('Setting the AWS S3 URL to Redis...');
  redisClient.hset(req.body.imageName, 'url', req.body.imageURL, redis.print);
  redisClient.hset(req.body.imageName, 'model_name', req.body.model_name, redis.print);
  redisClient.hset(req.body.imageName, 'model_version', req.body.model_version, redis.print);
  // redisClient.set(request.body.imageName, request.body.imageURL, redis.print);
  // redisClient.get(request.body.imageURL, (err, value) => {
  // 	if (err) throw(err);
  // 	console.log("Saved. Retrieved value successfully from Redis: ");
  // 	console.log(value);
  // });
  redisClient.hkeys(req.body.imageName, (err, replies) => {
    console.log(`${replies.length} replies:`);
    replies.forEach((reply, i) => {
      console.log(`${i} - ${reply}`);
    });
  });
  res.sendStatus(httpStatus.OK);
}

function s3upload(req, res) {
  console.log(`request received from react: ${req}`);
  res.sendStatus(httpStatus.OK);
}

// Get Model Info From S3

async function getKeys(params, keys) {
  let s3Response = await s3.listObjectsV2(params).promise();
  s3Response.CommonPrefixes.forEach(obj => keys.push(obj.Prefix));
  if (s3Response.IsTruncated) {
    let newParams = Object.assign({}, params);
    newParams.ContinuationToken = s3Response.NextContinuationToken;
    await getKeys(newParams, keys); // RECURSIVE CALL
  }
}

async function getModels(req, res) {
  try {
    let params = {
      Bucket: config.aws.bucketName,
      Delimiter: '/',
      Prefix: config.model.prefix,
      MaxKeys: 2147483647, // Maximum allowed by S3 API
    }
    let models = [];
    await getKeys(params, models);
    // array of params for each listObjectsV2 call
    let arrayOfParams = models.map((prefix) => {
      return {
        Bucket: config.aws.bucketName,
        Prefix: `${prefix}`,
        Delimiter: '/',
        MaxKeys: 2147483647, // Maximum allowed by S3 API
      }
    });

    let allModels = [];
    await Promise.all(arrayOfParams.map(param => getKeys(param, allModels)));

    console.log(allModels);
    res.status(httpStatus.OK).send({ models: allModels });
  } catch (error) {
    console.log(`Error while retrieving models and versions from S3: ${error}`);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default {
  redisConnect,
  getModels,
  s3upload
};
