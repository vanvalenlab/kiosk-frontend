import httpStatus from 'http-status';
import client from '../config/redis';
import logger from '../config/winston';

async function predict(req, res) {
  const redisKey = req.body.imageName;

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

    client.on('monitor', (time, args) => {
      if (args[1] == redisKey) {
        for (let i = 2; i < args.length; i = i + 2) {
          if (args[i] == 'output_url' && args[i  +1] != 'none') {
            logger.info(`redis key ${args[1]}.output_url set to: ${args[3]}`);
            if (args[3].toLowerCase().startsWith('fail')) {
              logger.error(`Failed to get output_url due to failure: ${args[3]}`);
              return res.sendStatus(httpStatus.SERVICE_UNAVAILABLE);
            }
            return res.status(httpStatus.OK).send({ outputURL: args[3] });
          }
        }
      }
    });
  });
}

export default { predict };
