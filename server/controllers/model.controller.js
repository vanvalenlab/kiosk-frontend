import httpStatus from 'http-status';
import AWS from 'aws-sdk';
import { Storage } from '@google-cloud/storage';
import config from '../config/config';
import logger from '../config/winston';
import { visualization1, visualization2, visualization3, visualization4, visualization5, visualization6, visualization7, visualization8, visualization9, visualization10, visualization11, visualization12, visualization13 } from '../config/visualizationDummyData.js';

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region
});

const s3 = new AWS.S3();

const gcs = new Storage({
  projectId: config.gcp.projectId
});

function getModelObject(allModels) {
  let modelPrefix = config.model.prefix;
  if (modelPrefix[modelPrefix.length - 1] !== '/') {
    modelPrefix = modelPrefix + '/';
  }
  const cleanModels = {};
  for (let i = 0; i < allModels.length; ++i) {
    let modelVersion = allModels[i].replace(modelPrefix, '').split('/', 2);
    if (cleanModels.hasOwnProperty(modelVersion[0])) {
      cleanModels[modelVersion[0]].push(modelVersion[1]);
    } else {
      cleanModels[modelVersion[0]] = [modelVersion[1]];
    }
  }
  return cleanModels;
}

async function getAwsKeys(params, keys) {
  let s3Response = await s3.listObjectsV2(params).promise();
  s3Response.CommonPrefixes.forEach(obj => keys.push(obj.Prefix));
  if (s3Response.IsTruncated) {
    let newParams = Object.assign({}, params);
    newParams.ContinuationToken = s3Response.NextContinuationToken;
    await getAwsKeys(newParams, keys); // RECURSIVE CALL
  }
}
  
async function getAwsModels(req, res) {
  let modelPrefix = config.model.prefix;
  if (modelPrefix[modelPrefix.length - 1] !== '/') {
    modelPrefix = modelPrefix + '/';
  }
  try {
    let params = {
      Bucket: config.aws.bucketName,
      Delimiter: '/',
      Prefix: modelPrefix,
      MaxKeys: 2147483647, // Maximum allowed by S3 API
    };
    let models = [];
    await getAwsKeys(params, models);
    // array of params for each listObjectsV2 call
    let arrayOfParams = models.map((prefix) => {
      return {
        Bucket: config.aws.bucketName,
        Prefix: `${prefix}`,
        Delimiter: '/',
        MaxKeys: 2147483647, // Maximum allowed by S3 API
      };
    });
  
    let allModels = [];
    await Promise.all(arrayOfParams.map(param => getAwsKeys(param, allModels)));
    let cleanModels = getModelObject(allModels);
    logger.info(`Found Models: ${JSON.stringify(cleanModels, null, 4)}`);
    res.status(httpStatus.OK).send({ models: cleanModels });
  } catch (error) {
    logger.error(`Error while retrieving models and versions from S3: ${error}`);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getGcpKeys(bucket, key, arr) {
  let response = await bucket.getFiles({
    prefix: key,
    delimiter:'/',
    autoPaginate: false
  });
  Array.prototype.push.apply(arr, response[2].prefixes);
}

async function getGcpModels(req, res) {
  let prefix = config.model.prefix;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  try {
    let bucket = gcs.bucket(config.gcp.bucketName);
    let allModels = [];
    let models = [];
    await getGcpKeys(bucket, config.model.prefix, models);
    await Promise.all(models.map(m => getGcpKeys(bucket, m, allModels)));  
    let cleanModels = getModelObject(allModels);
    logger.info(`Found GCP Models: ${JSON.stringify(cleanModels, null, 4)}`);
    res.status(httpStatus.OK).send({ models: cleanModels });
  } catch (err) {
    logger.error(err);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getGcpModelStats(req, res){
  var arrayofDummyData = [];
  arrayofDummyData.push(visualization1, visualization2, visualization3, visualization4, visualization5, visualization6, visualization7, visualization8, visualization9, visualization10, visualization11, visualization12, visualization13);
  var max = 13;
  var min = 0;
  //add 1 to account for the 0th place of the array.
  var randomNumber = Math.floor(Math.random() * (max - min) + min);
  console.log('Here is the random number: ' + randomNumber);
  //we select a random object from the lengthy visualization Array.
  var randomDataObject = arrayofDummyData[randomNumber];
  //log the randomData Object
  logger.info(`Got GCP Model Visualization Stats: ${JSON.stringify(randomDataObject, null, 4)}`);
  //send the data as a response to React where the ajax call was made.
  res.status(httpStatus.OK).send({ modelArray: randomDataObject });
}

const getModels = config.cloud == 'aws' ? getAwsModels : getGcpModels;
const getModelStats = getGcpModelStats;
export default { getModels, getModelStats };
