import httpStatus from 'http-status';
import uuidv4 from 'uuid/v4';
import { promisify } from 'util';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

// helper functions
function isValidPredictdata(data) {
  const requiredKeys = [
    // 'modelName',
    // 'modelVersion',
    'imageName'
  ];
  for (let key of requiredKeys) {
    if (!data.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

async function addRedisKey(client, redisKey, data) {
  const hmsetAsync = promisify(client.hmset).bind(client);
  const now = new Date().toISOString();
  try {
    const response = await hmsetAsync([
      redisKey,
      'original_name', data.imageName, // to save results with the same name
      'input_file_name', data.uploadedName || data.imageName, // used for unique files
      'model_name', data.modelName || '',
      'model_version', data.modelVersion || '',
      'postprocess_function', data.postprocessFunction || '',
      'preprocess_function', data.preprocessFunction || '',
      'cuts', data.cuts || '0', // to split up very large images
      'url', data.imageUrl || '', // unused?
      'scale', data.dataRescale || '',
      'label', data.dataLabel || '',
      'status', 'new',
      'created_at', now,
      'updated_at', now,
      'identity_upload', config.hostname,
    ]);
    logger.debug(`"HMSET ${redisKey}" response: ${response}`);
    return response;
  } catch (err) {
    logger.error(`Encountered error during "HMSET ${redisKey}": ${err}`);
    throw err;
  }
}

async function pushRedisKey(client, queueName, redisKey) {
  const lpushAsync = promisify(client.lpush).bind(client);
  try {
    let response;
    if (Array.isArray(redisKey)) {
      response = await lpushAsync(queueName, ...redisKey);
    } else {
      response = await lpushAsync(queueName, redisKey);
    }
    logger.debug(`"LPUSH ${redisKey}" response: ${response}`);
    return response;
  } catch (err) {
    logger.error(`Encountered error during "LPUSH ${queueName} ${redisKey}": ${err}`);
    throw err;
  }
}

// route handlers
async function getJobTypes(req, res) {
  return res.status(httpStatus.OK).send({ jobTypes: config.jobTypes });
}

async function predict(req, res) {
  if (!isValidPredictdata(req.body)) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Invalid prediction request body.'
    });
  }

  let queueName = req.body.jobType;

  if (config.jobTypes.indexOf(queueName) == -1) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: `Invalid Job Type: ${req.body.jobType}.`
    });
  }

  if (req.body.imageName.toLowerCase().endsWith('.zip')) {
    queueName = `${queueName}-zip`;
  }

  const redisKey = `${queueName}:${req.body.imageName}:${uuidv4()}`;

  try {
    await addRedisKey(client, redisKey, req.body);
    await pushRedisKey(client, queueName, redisKey);
    return res.status(httpStatus.OK).send({ hash: redisKey });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

export default {
  getJobTypes,
  predict
};
