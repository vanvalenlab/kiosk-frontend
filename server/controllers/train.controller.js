import httpStatus from 'http-status';
import config from '../config/config';
import client from '../config/redis';
import logger from '../config/winston';

async function train(req, res) {
  const redisKey = `train_${req.body.imageName}_${Date.now()}`;
  // const queueName = 'train';
  let prefix = config.uploadDirectory;
  if (prefix[prefix.length - 1] === '/') {
    prefix = prefix.slice(0, prefix.length - 1);
  }
  try {
    // set the initial keys & values for redis
    client.hmset([
      redisKey,
      'epochs', req.body.epochs,
      'field', req.body.fieldSize,
      'identity_upload', config.hostname,
      'input_file_name', `${prefix}/${req.body.imageName}`,
      'ndim', req.body.ndim,
      'normalization', req.body.normalization,
      'optimizer', req.body.optimizer,
      'skips', req.body.skips,
      'status', 'new',
      'updated_at', Date.now().toISOString(),
      'created_at', Date.now().toISOString(),
      'training_type', req.body.trainingType,
      'transform', req.body.transform,
      'url', req.body.imageURL
    ], (err, redisRes) => {
      if (err) throw err;
      logger.info(`redis.hmset response: ${redisRes}`);
      // client.lpush(queueName, redisKey, (err, pushRes) => {
      //   if (err) throw err;
      //   logger.info(`redis.lpush response: ${pushRes}`);
      return res.status(httpStatus.OK).send({ hash: redisKey });
      // });
    });
  } catch (err) {
    logger.error(`Encountered Error in /train: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

export default { train };
