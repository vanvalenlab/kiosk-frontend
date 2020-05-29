import httpStatus from 'http-status';
import { promisify } from 'util';
import client from '../config/redis';
import logger from '../config/winston';

// helper functions
function isArray(a) {
  return (!!a) && (a.constructor === Array);
}

async function getRedisValue(client, key, field) {
  let getAsync;
  let cmd;
  if (isArray(field)) {
    getAsync = promisify(client.hget).bind(client);
    cmd = 'HGET';
  } else {
    getAsync = promisify(client.hmget).bind(client);
    cmd = 'HMGET';
  }
  try {
    const value = await getAsync(key, field);
    logger.debug(`Hash ${key} has ${field} = ${value}`);
    return value;
  } catch (err) {
    logger.error(`Encountered error during "${cmd} ${key} ${field}": ${err}`);
    throw err;
  }
}

async function getRedisValues(client, key, field, arr) {
  // get the same field from many keys
  const value = await getRedisValue(client, key, field);
  Array.prototype.push.apply(arr, [value]);
}

// route handlers
async function getKey(req, res) {
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
  const redisHash = req.body.hash;
  try {
    const value = await getRedisValue(client, redisHash, 'status');
    return res.status(httpStatus.OK).send({ status: value });
  } catch (err) {
    logger.error(`Could not get hash ${redisHash} status: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function batchGetKeys(req, res) {
  const hashes = req.body.hashes;
  const key = req.body.key;
  const values = [];
  try {
    await Promise.all(hashes.map(h => getRedisValues(client, h, key, values)));
    return res.status(httpStatus.OK).send({ values: values });
  } catch (err) {
    logger.error(`Error finding ${key} for hashes ${hashes}: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function batchGetJobStatus(req, res) {
  const hashes = req.body.hashes;
  const statuses = [];

  try {
    await Promise.all(hashes.map(h => getRedisValues(client, h, 'status', statuses)));
    return res.status(httpStatus.OK).send({ statuses: statuses });
  } catch (err) {
    logger.error(`Error waiting for status checks for ${hashes}: ${err}`);
    return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
  }
}

async function expireHash(req, res) {
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
};
