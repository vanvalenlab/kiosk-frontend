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
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
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
      if (args[1] === redisKey && args[2] === 'output_url') {
        logger.info(`redis key ${args[1]}.output_url set to: ${args[3]}`);
        client.quit();
        return res.status(httpStatus.OK).send({ outputURL: args[3] });
      }
    });
  });
}

export default { predict };
