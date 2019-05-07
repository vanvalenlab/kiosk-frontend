import httpStatus from 'http-status';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

async function addRedisKey(redisKey, data, cb) {
  client.hmset([
    redisKey,
    'cuts', data.cuts,
    'identity_upload', config.hostname,
    'input_file_name', data.uploadedName,
    'model_name', data.model_name,
    'model_version', data.model_version,
    'original_name', data.imageName,
    'postprocess_function', data.postprocess_function,
    'preprocess_function', data.preprocess_function,
    'url', data.imageURL,
    'status', 'new',
    'created_at', new Date().toISOString(),
    'updated_at', new Date().toISOString(),
  ], (err, redisRes) => {
    if (err) {
      logger.error(`Encountered error during "HMSET ${redisKey}": ${err}`);
      throw err;
    }
    return cb(redisRes);
  });
}

async function predict(req, res) {
  const redisKey = `predict_${req.body.imageName}_${Date.now()}`;
  const queueName = 'predict';
  addRedisKey(redisKey, req.body, (redisResponse) => {
    logger.info(`redis.hmset response: ${redisResponse}`);
    client.lpush(queueName, redisKey, (err, pushResponse) => {
      if (err) throw err;
      logger.info(`redis.lpush response: ${pushResponse}`);
      return res.status(httpStatus.OK).send({ hash: redisKey });
    });
  });
}

async function batchPredict(req, res) {
  const redisKey = `predict_${req.body.imageName}_${Date.now()}`;
  const queueName = 'predict';

  const maxJobs = 100;

  if (req.body.jobs.length > maxJobs) {
    return res.status(httpStatus.REQUEST_ENTITY_TOO_LARGE).send({
      message: `A maximum of ${maxJobs} can be processed in one request.`
    });
  }

  let hashes = [];
  for (let i = 0; i < req.body.jobs.length; ++i) {
    addRedisKey(redisKey, req.body.jobs[i], (redisResponse) => {
      logger.info(`redis.hmset response: ${redisResponse}`);
      client.lpush(queueName, redisKey, (err, pushResponse) => {
        if (err) throw err;
        logger.info(`redis.lpush response: ${pushResponse}`);
        hashes.push(redisKey);
      });
    });
  }
  return res.status(httpStatus.OK).send({ hashes: hashes });
}

export default { predict, batchPredict };
