import httpStatus from 'http-status';
import { promisify } from 'util';
import client from '../config/redis';
import logger from '../config/winston';

// helper functions
function isArray(a) {
  return (!!a) && (a.constructor === Array);
}

async function hget(client, key, field) {
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

async function hmget(client, key, fields) {
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
    let value;
    if (isArray(redisKey)) {
      value = await hmget(client, redisHash, redisKey);
    } else {
      value = await hget(client, redisHash, redisKey);
    }
    return res.status(httpStatus.OK).send({ value: value });
  } catch (err) {
    logger.error(`Could not get hash ${redisHash} key ${redisKey} values: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
  }
}

async function getJobStatus(req, res) {
  const redisHash = req.body.hash;
  const redisKey = 'status';
  try {
    const value = await hget(client, redisHash, redisKey);
    return res.status(httpStatus.OK).send({ status: value });
  } catch (err) {
    logger.error(`Could not get hash ${redisHash} status: ${err}`);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: err });
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
