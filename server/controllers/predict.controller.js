import httpStatus from 'http-status';
import client from '../config/redis';
import logger from '../config/winston';

async function predict(req, res) {
  const redisKey = `${req.body.imageName}_${Date.now()}`;
  try {
    client.hmset([
      redisKey,
      'url', req.body.imageURL,
      'model_name', req.body.model_name,
      'model_version', req.body.model_version,
      'file_name', req.body.imageName,
      'output_url', 'none',
      'processed', 'no'
    ], (err, redisRes) => {
      if (err) throw err;
      logger.info(`redis.hmset response: ${redisRes}`);

      client.on('monitor', (time, args) => {
        if (args[1] == redisKey) {
          for (let i = 2; i < args.length; i = i + 2) {
            if (args[i] === 'output_url' && args[i + 1] !== 'none') {
              logger.info(`redis key ${args[1]}: ${args[i]} set to: ${args[i + 1]}`);

              let outputURL = args[i + 1];
              if (outputURL.toString().toLowerCase().startsWith('fail')) {
                logger.error(`Failed to get output_url due to failure: ${outputURL}`);
                return res.status(httpStatus.SERVICE_UNAVAILABLE).send({ err: outputURL });
              } else {
                return res.status(httpStatus.OK).send({ outputURL: outputURL });
              }
            }
          }
        }
      });
    });
  } catch (err) {
    logger.error(`Encountered Error in /predict: ${err}`);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ err: err });
  }
}

export default { predict };
