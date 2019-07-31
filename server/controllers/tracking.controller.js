import httpStatus from 'http-status';
import uuidv4 from 'uuid/v4';
import client from '../config/redis';
import config from '../config/config';
import logger from '../config/winston';

async function track(req, res) {
  let queueName;
  if (req.body.imageName.toLowerCase().endsWith('.zip')) {
    queueName = 'track-zip';
  } else {
    queueName = 'track';
  }

  const redisKey = `${queueName}:${req.body.imageName}:${uuidv4()}`;

  let prefix = config.uploadDirectory;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }

  try {
    client.hmset([
      redisKey,
      'identity_upload', config.hostname,
      'input_file_name', req.body.uploadedName,
      'model_name', req.body.model_name,
      'model_version', req.body.model_version,
      'original_name', req.body.imageName,
      'status', 'new',
      'created_at', new Date().toISOString(),
      'updated_at', new Date().toISOString(),
      'url', req.body.imageURL
    ], (err, redisRes) => {

      if (err) throw err;
      logger.info(`redis.hmset response: ${redisRes}`);
      client.lpush(queueName, redisKey, (err, pushRes) => {
        if (err) throw err;
        logger.info(`redis.lpush response: ${pushRes}`);
        return res.status(httpStatus.OK).send({ hash: redisKey });
      });
    });
  } catch (err) {
    logger.error(`Encountered Error in /track: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { track };
