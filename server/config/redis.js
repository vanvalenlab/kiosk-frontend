import redis from 'redis';
import config from './config';
import logger from './winston';

const client = redis.createClient(config.redis);

// handle any errors whilst connecting to Redis.
client.on('error', (err) => {
  logger.error(`Error while communicating with Redis: ${err}`);
});

client.monitor((err, res) => {
  if (err) throw err;
  logger.info(`Entering monitoring mode: ${res}`);
});

export default client;
