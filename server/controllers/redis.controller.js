import httpStatus from 'http-status';
import { promisify } from 'util';
import createClient from '../config/redis';
import logger from '../config/winston';

// helper functions
async function getRedisValue(client, key, field) {
  const hgetAsync = promisify(client.hget).bind(client);
  const value = await hgetAsync(key, field);
  logger.debug(`Hash ${key} has ${field} = ${value}`);
  return value;
}

async function getRedisValues(client, key, field, arr) {
  // get the same field from many keys
  const value = await getRedisValue(client, key, field);
  Array.prototype.push.apply(arr, [value]);
}

// route handlers
async function getKey(req, res) {
  const client = createClient();
  const redisHash = req.body.hash;
  const redisKey = req.body.key;
  try {
    const value = await getRedisValue(client, redisHash, redisKey);
    return res.status(httpStatus.OK).send({ value: value });
  } catch (err) {
    logger.error(`Could not get hash ${redisHash} key ${redisKey} values: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function getJobStatus(req, res) {
  const client = createClient();
  const redisHash = req.body.hash;
  try {
    const value = await getRedisValue(client, redisHash, 'status');
    return res.status(httpStatus.OK).send({ status: value });
  } catch (err) {
    logger.error(`Could not get hash ${redisHash} status: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function batchGetJobStatus(req, res) {
  const client = createClient();
  const redisHashes = req.body.hashes;

  const statuses = [];

  try {
    await Promise.all(req.body.hashes.map((h) => {
      getRedisValues(client, h, 'status', statuses)
    }));
    return res.status(httpStatus.OK).send({ statuses: statuses });
  } catch (err) {
    logger.error(`Error waiting for status checks for ${redisHashes}: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function expireHash(req, res) {
  const client = createClient();
  const redisHash = req.body.hash;
  const expireTime = req.body.expireIn || 3600;

  client.expire(redisHash, expireTime, (err, value) => {
    if (err) {
      logger.error(`Could not expire hash ${redisHash} with ${expireTime} seconds: ${err}`);
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
    if (parseInt(value) == 0) {
      logger.warning(`Hash "${redisHash}" not found`);
      return res.status(httpStatus.NOT_FOUND).send({ value });
    }
    logger.debug(`Expiring hash ${redisHash} in ${expireTime} seconds: ${value}`);
    return res.status(httpStatus.OK).send({ value });
  });
}

export default {
  getKey,
  expireHash,
  getJobStatus,
  batchGetJobStatus
};
