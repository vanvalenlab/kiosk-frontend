import redis from 'redis';
import config from './config';
import logger from './winston';

const client = redis.createClient(config.redis);

// handle any errors whilst connecting to Redis.
client.on('error', (err) => {
  logger.error(`Error while communicating with Redis: ${err}`);
});

export default client;
