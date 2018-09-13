import httpStatus from 'http-status';
import redis from 'redis';
import config from '../config/config';
import logger from '../config/winston';
import modelController from './model.controller';

const redisClient = redis.createClient(config.redis);

async function redisConnect(req, res) {
  //testing the API endpoint
  logger.info(`HTTP POST request received from React: ${JSON.stringify(req.body)}`);

  //if there are any errors whilst connecting to Redis.
  redisClient.on('error', (err) => {
    logger.error(`Error while communicating with Redis: ${err}`);
    res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  });

  logger.info('Setting the AWS S3 URL to Redis...');
  redisClient.hset(req.body.imageName, 'url', req.body.imageURL, redis.print);
  redisClient.hset(req.body.imageName, 'model_name', req.body.model_name, redis.print);
  redisClient.hset(req.body.imageName, 'model_version', req.body.model_version, redis.print);
  // redisClient.set(request.body.imageName, request.body.imageURL, redis.print);
  // redisClient.get(request.body.imageURL, (err, value) => {
  // 	if (err) throw(err);
  // 	logger.info("Saved. Retrieved value successfully from Redis: ");
  // 	logger.info(value);
  // });
  redisClient.hkeys(req.body.imageName, (err, replies) => {
    logger.info(`${replies.length} replies:`);
    replies.forEach((reply, i) => {
      logger.info(`${i} - ${reply}`);
    });
  });
  res.sendStatus(httpStatus.OK);
}

export default {
  modelController,
  redisConnect
};
