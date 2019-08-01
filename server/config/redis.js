import Redis from 'ioredis';
import config from './config';
import logger from './winston';

function createBasicClient() {
  const client = new Redis({
    host: config.redis.host,
    port: config.redis.port,
  });
  return client;
}

function createSentinel() {
  const client = new Redis({
    sentinels: [config.redis],
    showFriendlyErrorStack: true,
    name: 'mymaster',
  });
  return client;
}

function getClient() {
  if (config.redis.sentinelEnabled) {
    logger.debug('Sentinel mode is enabled.');
    return createSentinel();
  }
  logger.debug('Sentinel mode is disabled.');
  return createBasicClient();
}

const client = getClient();

export default client;
