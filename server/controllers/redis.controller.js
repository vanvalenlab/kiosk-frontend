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
async function expire(client, key, expireTime) {
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
  try {
    const value = await expire(client, redisHash, expireTime);
    if (parseInt(value) == 0) {
      logger.warning(`Hash "${redisHash}" not found`);
      return res.status(httpStatus.NOT_FOUND).send({ value });
    }
    logger.debug(`Expiring hash ${redisHash} in ${expireTime} seconds: ${value}`);
    return res.status(httpStatus.OK).send({ value });
  } catch (err) {
    logger.error(`Error during EXPIRE ${redisHash} ${expireTime}: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

export default {
  getKey,
  expireHash,
  getJobStatus,
};
