import httpStatus from 'http-status';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

async function predict(req, res) {
  const redisKey = `predict_${req.body.imageName}_${Date.now()}`;
  const queueName = 'predict';
  let prefix = config.uploadDirectory;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  client.hmset([
    redisKey,
    'cuts', req.body.cuts,
    'identity_upload', config.hostname,
    'input_file_name', req.body.uploadedName,
    'model_name', req.body.model_name,
    'model_version', req.body.model_version,
    'original_name', req.body.imageName,
    'postprocess_function', req.body.postprocess_function,
    'status', 'new',
    'created_at', new Date().toISOString(),
    'updated_at', new Date().toISOString(),
    'url', req.body.imageURL
  ], (err, redisRes) => {
    if (err) {
      logger.error(`Encountered Error in /predict: ${err}`);
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
    logger.info(`redis.hmset response: ${redisRes}`);
    client.lpush(queueName, redisKey, (err, pushRes) => {
      if (err) throw err;
      logger.info(`redis.lpush response: ${pushRes}`);
      return res.status(httpStatus.OK).send({ hash: redisKey });
    });
  });
}

export default { predict };
