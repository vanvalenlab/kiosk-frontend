import httpStatus from 'http-status';
import config from '../config/config';
import client from '../config/redis';
import logger from '../config/winston';

async function train(req, res) {
  const redisKey = `${req.body.imageName}_${Date.now()}`;
  let prefix = config.uploadDirectory;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  try {
    // set the initial keys & values for redis
    client.hmset([
      redisKey,
      'file_name', `${prefix}/${req.body.imageName}`,
      'url', req.body.imageURL,
      'ndim', req.body.ndim,
      'optimizer', req.body.optimizer,
      'field', req.body.fieldSize,
      'skips', req.body.skips,
      'epochs', req.body.epochs,
      'transform', req.body.transform,
      'normalization', req.body.normalization,
      'training_type', req.body.trainingType,
      'status', 'new_training'
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
