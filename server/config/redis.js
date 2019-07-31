import Redis from 'ioredis';
import config from './config';
import logger from './winston';

function createBasicClient() {
  const client = new Redis(config.redis);
  return client;
}

function createSentinel() {
  const client = new Redis({
    sentinels: [config.redis],
    showFriendlyErrorStack: true,
    name: 'mymaster',
  });
  client.on('error', (err) => {
    logger.error(`Encountered error from Redis Sentinel ${err}`);
    logger.info('Creating basic Redis client without a Sentinel.');
    client.disconnect();
    return createBasicClient();
  });
  return client;
}

const client = createSentinel();

export default client;
