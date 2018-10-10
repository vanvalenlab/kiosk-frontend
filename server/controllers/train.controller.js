import httpStatus from 'http-status';
import client from '../config/redis';
import logger from '../config/winston';

async function train(req, res) {
  const redisKey = req.body.imageName;

  // set the initial keys/values for redis
  client.hmset([
    redisKey,
    'url', req.body.imageURL,
    'optimizer', req.body.optimizer,
    'field', req.body.fieldSize,
    'skips', req.body.skips,
    'epochs', req.body.epochs,
    'transform', req.body.transform,
    'normalization', req.body.normalization,
    'output_url', 'none',
    'processed', 'no'
  ], (err, redisRes) => {
    if (err) throw err;
    logger.info(`redis.hmset response: ${redisRes}`);

    client.on('monitor', (time, args, raw_reply) => {
      logger.debug(`redis monitor: ${raw_reply}`);
      if (args[1] === redisKey && args[2] === 'output_url') {
        logger.info(`redis key ${args[1]}.output_url set to: ${args[3]}`);
        return res.status(httpStatus.OK).send({ outputURL: args[3] });
      }
    });
  });
}

export default { train };
