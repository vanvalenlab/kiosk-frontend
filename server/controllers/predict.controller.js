import httpStatus from 'http-status';
import uuidv4 from 'uuid/v4';
import { promisify } from 'util';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

// helper functions
function isValidPredictdata(data) {
  const requiredKeys = [
    'modelName',
    'modelVersion',
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
      'scale', data.dataRescale ? '' : '1',
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

async function batchAddKeys(client, job, arr) {
  let redisKey = `predict:${job.imageName}:${uuidv4()}`;
  await addRedisKey(client, redisKey, job);
  Array.prototype.push.apply(arr, [redisKey]);
}

// route handlers
async function predict(req, res) {
  if (!isValidPredictdata(req.body)) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }

  let queueName;
  if (req.body.imageName.toLowerCase().endsWith('.zip')) {
    queueName = 'predict-zip';
  } else {
    queueName = 'predict';
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

async function batchPredict(req, res) {
  const maxJobs = 100;
  // check that the `jobs` key exists in the request
  if (!req.body.hasOwnProperty('jobs')) {
    return res.status(httpStatus.BAD_REQUEST).send({
      message: 'Missing required field `jobs`, the list of batch jobs.'
    });
  }

  // check that the number of jobs does not exceed maxJobs
  if (req.body.jobs.length > maxJobs) {
    return res.status(httpStatus.REQUEST_ENTITY_TOO_LARGE).send({
      message: `A maximum of ${maxJobs} can be processed in one request.`
    });
  }

  // check that each job is well formatted
  for (let j = 0; j < req.body.jobs.length; ++j) {
    if (!isValidPredictdata(req.body.jobs[j])) {
      return res.status(httpStatus.BAD_REQUEST).send({
        message: `Not all required fields exist in job ${req.body.jobs[j]}.`
      });
    }
  }

  const hashes = [];

  try {
    await Promise.all(req.body.jobs.map(j => batchAddKeys(client, j, hashes)));
    logger.info(`hashes after waiting for all promises: ${hashes}`);
    await pushRedisKey(client, hashes);
    return res.status(httpStatus.OK).send({ hashes: hashes });
  } catch (err) {
    logger.error(`Encountered error: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

export default {
  predict,
  batchPredict
};
