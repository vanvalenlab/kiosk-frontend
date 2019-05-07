import Redis from 'ioredis';
import config from './config';
import logger from './winston';

const client = Redis.createClient({
  host: config.redis.host,
  port: config.redis.port,
});

// handle any errors whilst connecting to Redis.
client.on('error', (err) => {
  logger.error(`Error while communicating with Redis: ${err}`);
});

export default client;
