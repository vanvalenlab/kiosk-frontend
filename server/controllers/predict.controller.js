import httpStatus from 'http-status';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

async function predict(req, res) {
  const redisKey = `${req.body.imageName}_${Date.now()}`;
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
      'file_name', `${prefix}/${req.body.imageName}`,
      'cuts', req.body.cuts,
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
