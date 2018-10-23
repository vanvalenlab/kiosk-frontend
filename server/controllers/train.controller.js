import httpStatus from 'http-status';
import client from '../config/redis';
import logger from '../config/winston';

async function train(req, res) {
  const redisKey = req.body.imageName;
  try {
    // set the initial keys & values for redis
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
      'status', 'new'
    ], (err, redisRes) => {
      if (err) throw err;
      logger.info(`redis.hmset response: ${redisRes}`);
      return res.status(httpStatus.OK).send({ hash: redisKey });
    });
  } catch (err) {
    logger.error(`Encountered Error in /train: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { train };
