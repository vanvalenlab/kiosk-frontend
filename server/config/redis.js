import redis from 'redis';
import config from './config';
import logger from './winston';

function createClient() {
  const client = redis.createClient(config.redis);

  // handle any errors whilst connecting to Redis.
  client.on('error', (err) => {
    logger.error(`Error while communicating with Redis: ${err}`);
  });

  return client;
}

const client = createClient();

export default client;
