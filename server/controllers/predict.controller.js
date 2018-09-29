import httpStatus from 'http-status';
import redis from 'redis';
import config from '../config/config';
import logger from '../config/winston';

async function predict(req, res) {
  const client = redis.createClient(config.redis);
  const redisKey = req.body.imageName;
  // handle any errors whilst connecting to Redis.
  client.on('error', (err) => {
    logger.error(`Error while communicating with Redis: ${err}`);
    res.sendStatus(httpStatus.SERVICE_UNAVAILABLE);
  });

  // set the initial keys/values for redis
  client.hmset([
    redisKey,
    'url', req.body.imageURL,
    'model_name', req.body.model_name,
    'model_version', req.body.model_version,
    'output_url', 'none',
    'processed', 'no'
  ], (err, redisRes) => {
    if (err) throw err;
    logger.info(`redis.hmset response: ${redisRes}`);

    client.monitor((err, res) => {
      if (err) throw err;
      logger.info(`Entering monitoring mode: ${res}`);
    });
    client.on('monitor', (time, args, raw_reply) => {
      logger.debug(`redis monitor: ${raw_reply}`);
      if (args[1] === redisKey && args[2] === 'output_url' && args[3] !== 'none') {
        logger.info(`redis key ${args[1]}.output_url set to: ${args[3]}`);
        client.del(redisKey, (err, response) => {
          if (err || response !== 1) {
            if (err) {
              logger.error(`Failed to delete redis key: ${err}`);
            } else {
              logger.error(`'No error, but failed to deletel hash ${redisKey}`);
            }
            return res.sendStatus(httpStatus.CONFLICT);
          } else if (args[3].toLowerCase().startsWith('fail')) {
            logger.error(`Failed to get output_url due to failure: ${args[3]}`);
            return res.sendStatus(httpStatus.SERVICE_UNAVAILABLE);
          }
          return res.status(httpStatus.OK).send({ outputURL: args[3] });
        });
      }
    });
  });
}

export default { predict };
