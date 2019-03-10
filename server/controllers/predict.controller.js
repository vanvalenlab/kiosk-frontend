import httpStatus from 'http-status';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

async function predict(req, res) {
  const redisKey = `predict_${req.body.imageName}_${Date.now()}`;
  let prefix = config.uploadDirectory;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  try {
    client.hmset([
      redisKey,
      'url', req.body.imageURL,
      'model_name', req.body.model_name,
      'model_version', req.body.model_version,
      'input_file_name', req.body.uploadedName,
      'original_name', req.body.imageName,
      'postprocess_function', req.body.postprocess_function,
      'cuts', req.body.cuts,
      'timestamp_upload', Date.now(),
      'status', 'new'
    ], (err, redisRes) => {
      if (err) throw err;
      logger.info(`redis.hmset response: ${redisRes}`);
      return res.status(httpStatus.OK).send({ hash: redisKey });
    });
  } catch (err) {
    logger.error(`Encountered Error in /predict: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { predict };
