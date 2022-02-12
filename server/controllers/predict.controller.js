import httpStatus from 'http-status';
import { v4 as uuidv4 } from 'uuid';
import redis from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

// helper functions
function isArray(a) {
  return (!!a) && (a.constructor === Array);
}

function isValidPredictdata(data) {
  const requiredKeys = [
    // 'modelName',
    // 'modelVersion',
    'imageName',
    'jobType'
  ];
  for (let key of requiredKeys) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      return false;
    }
  }
  return true;
}

// route handlers
async function getJobTypes(req, res) {
  return res.status(httpStatus.OK).send({ jobTypes: config.jobTypes });
}

async function getKey(req, res) {
  const redisHash = req.body.hash;
  const redisKey = req.body.key;
  try {
    let value;
    if (isArray(redisKey)) {
      value = await redis.hmget(redisHash, redisKey);
    } else {
      value = await redis.hget(redisHash, redisKey);
    }
    return res.status(httpStatus.OK).send({ value });

  } catch (err) {
    logger.error(`Could not get hash ${redisHash} key ${redisKey} values: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

async function getJobStatus(req, res) {
  const redisHash = req.body.hash;
  const redisKey = 'status';
  try {
    const value = await redis.hget(redisHash, redisKey);
    return res.status(httpStatus.OK).send({ status: value });
  } catch (err) {
    logger.error(`Could not get hash ${redisHash} status: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

async function expireHash(req, res) {
  const redisHash = req.body.hash;
  const expireTime = req.body.expireIn || 3600;
  try {
    const value = await redis.expire(redisHash, expireTime);
    if (parseInt(value) == 0) {
      logger.warn(`Hash "${redisHash}" not found`);
      return res.status(httpStatus.NOT_FOUND).send({ value });
    }
    logger.debug(`Expiring hash ${redisHash} in ${expireTime} seconds: ${value}`);
    return res.status(httpStatus.OK).send({ value });
  } catch (err) {
    logger.error(`Error during EXPIRE ${redisHash} ${expireTime}: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
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
  const data = req.body;
  const now = new Date().toISOString();

  try {
    await redis.hmset(redisKey, [
      'original_name', data.imageName, // to save results with the same name
      'input_file_name', data.uploadedName || data.imageName, // used for unique files
      'model_name', data.modelName || '',
      'model_version', data.modelVersion || '',
      'postprocess_function', data.postprocessFunction || '',
      'preprocess_function', data.preprocessFunction || '',
      'cuts', data.cuts || '0', // to split up very large images
      'url', data.imageUrl || '', // unused?
      'label', data.dataLabel || '',
      'status', 'new',
      'created_at', now,
      'updated_at', now,
      'identity_upload', config.hostname,
      'channels', data.jobForm?.selectedChannels || '',
      'scale', data.jobForm?.scale || '',
      'segmentation_type', data.jobForm?.segmentationType || '',
    ]);
    await redis.lpush(queueName, redisKey);
    return res.status(httpStatus.OK).send({ hash: redisKey });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

export default {
  getJobTypes,
  getKey,
  expireHash,
  getJobStatus,
  predict
};
