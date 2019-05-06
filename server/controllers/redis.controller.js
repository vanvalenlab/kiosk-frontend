import httpStatus from 'http-status';
import client from '../config/redis';
import logger from '../config/winston';

async function getKey(req, res) {
  const redisHash = req.body.hash;
  const redisKey = req.body.key;
  client.hget(redisHash, redisKey, (err, value) => {
    if (err) {
      logger.error(`Could not get hash ${redisHash} key ${redisKey} values: ${err}`);
      return res.sendStatus(httpStatus.INTERNAL_SERVER_ERROR);
    }
    logger.debug(`Hash ${redisHash} has ${redisKey} = ${value}`);
    return res.status(httpStatus.OK).send({ value: value });
  });
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
  expireHash
};
