import Redis from 'ioredis';
import { promisify } from 'util';
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

function isArray(a) {
  return (!!a) && (a.constructor === Array);
}

async function hget(key, field) {
  const client = getClient();
  const hgetAsync = promisify(client.hget).bind(client);
  try {
    const value = await hgetAsync(key, field);
    logger.debug(`Hash ${key} has ${field} = ${value}`);
    return value;
  } catch (err) {
    logger.error(`Encountered error during "HGET ${key} ${field}": ${err}`);
    throw err;
  }
}

async function hmget(key, fields) {
  const client = getClient();
  const hmgetAsync = promisify(client.hmget).bind(client);
  try {
    const value = await hmgetAsync(key, ...fields);
    logger.debug(`Hash ${key} has ${fields} = ${value}`);
    return value;
  } catch (err) {
    logger.error(`Encountered error during "HMGET ${key} ${fields}": ${err}`);
    throw err;
  }
}

async function expire(key, expireTime) {
  const client = getClient();
  const expireAsync = promisify(client.expire).bind(client);
  try {
    const value = await expireAsync(key, expireTime);
    logger.debug(`EXPIRE ${key} ${expireTime} got result: ${value}.`);
    return value;
  } catch (err) {
    logger.error(`Encountered error during "EXPIRE ${key} ${expireTime}": ${err}`);
    throw err;
  }
}

async function lpush(queueName, redisKey) {
  const client = getClient();
  const lpushAsync = promisify(client.lpush).bind(client);
  try {
    let response;
    if (isArray(redisKey)) {
      response = await lpushAsync(queueName, ...redisKey);
    } else {
      response = await lpushAsync(queueName, redisKey);
    }
    logger.debug(`"LPUSH ${redisKey}" response: ${response}`);
    return response;
  } catch (err) {
    logger.error(`Encountered error during "LPUSH ${queueName} ${redisKey}": ${err}`);
    throw err;
  }
}

async function hmset(redisHash, values) {
  const client = getClient();
  const hmsetAsync = promisify(client.hmset).bind(client);
  try {
    const response = await hmsetAsync([redisHash, ...values]);
    logger.debug(`"HMSET ${redisHash}" response: ${response}`);
    return response;
  } catch (err) {
    logger.error(`Encountered error during "HMSET ${redisHash}": ${err}`);
    throw err;
  }
}

export default {
  hget,
  hmget,
  expire,
  lpush,
  hmset
};
