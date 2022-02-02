// import MockRedis from 'ioredis-mock';

import redis from './redis';
import config from './config';

const mocks = { redis: null };

jest.mock('ioredis', () => {
  const Redis = require('ioredis-mock');
  if (typeof Redis === 'object') {
    // the first mock is an ioredis shim because ioredis-mock depends on it
    // https://github.com/stipsan/ioredis-mock/blob/master/src/index.js#L101-L111
    return {
      Command: { _transformer: { argument: {}, reply: {} } }
    };
  }
  // second mock for our code
  return function(...args) {
    const dummyData = {
      data: {
        jobId: {
          'status': 'done',
          'otherKey': 'testValue'
        }
      }
    };
    const instance = new Redis({...args, ...dummyData});
    mocks.redis = instance;
    return instance;
  }
});

jest.mock('../config/config', () => {
  return {
    redis: {
      sentinelEnabled: false
    }
  };
});

describe('Redis tests', () => {

  beforeEach(() => {
    if (mocks.redis != null) {
      mocks.redis.hmset('jobId', ['status', 'done', 'otherKey', 'testValue']);
    }
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Test HGET', () => {

    it('should get the correct value', async () => {
      let value = await redis.hget('jobId', 'status');
      expect(value).toBe('done');

      config.redis.sentinelEnabled = true;
      value = await redis.hget('jobId', 'status');
      expect(value).toBe('done');
    });

  });

  describe('Test HMGET', () => {

    it('should get the correct values', async () => {
      let value = await redis.hmget('jobId', ['status', 'otherKey']);
      expect(value).toMatchObject(['done', 'testValue']);

      config.redis.sentinelEnabled = true;
      value = await redis.hmget('jobId', ['status', 'otherKey']);
      expect(value).toMatchObject(['done', 'testValue']);
    });

  });

  describe('Test EXPIRE', () => {

    it('should expire the key', async () => {
      let value = await redis.expire('jobId', 1);
      expect(value).toBe(1);

      config.redis.sentinelEnabled = true;
      value = await redis.expire('jobId', 1);
      expect(value).toBe(1);
    });

    it('should return 0 if no valid key', async () => {
      let value = await redis.expire('otherKey', 1);
      expect(value).toBe(0);

      config.redis.sentinelEnabled = true;
      value = await redis.expire('anotherKey', 1);
      expect(value).toBe(0);
    });
  });

  describe('Test LPUSH', () => {

    it('should push a single value to a queue', async () => {
      let value = await redis.lpush('testQueue0', 'newKey');
      expect(value).toBe(1);

      let response = await mocks.redis.llen('testQueue0');
      expect(response).toBe(1);

      config.redis.sentinelEnabled = true;
      value = await redis.lpush('testQueue1', 'newKey');
      expect(value).toBe(1);

      response = await mocks.redis.llen('testQueue1');
      expect(response).toBe(1);
    });

    it('should push an array of values to a queue', async () => {
      let value = await redis.lpush('testQueue2', ['newKey', 'otherNewKey']);
      expect(value).toBe(2);

      let response = await mocks.redis.llen('testQueue2');
      expect(response).toBe(2);

      config.redis.sentinelEnabled = true;
      value = await redis.lpush('testQueue3', ['newKey', 'otherNewKey']);
      expect(value).toBe(2);

      response = await mocks.redis.llen('testQueue3');
      expect(response).toBe(2);
    });
  });

  describe('Test HMSET', () => {

    it('should set multiple values', async () => {
      const newStatus = 'success';
      let value = await redis.hmset('jobId', ['status', newStatus]);
      expect(value).toBe('OK');

      let response = await mocks.redis.hget('jobId', 'status');
      expect(response).toBe(newStatus);

      config.redis.sentinelEnabled = true;
      value = await redis.hmset('jobId', ['status', newStatus]);
      expect(value).toBe('OK');

      response = await mocks.redis.hget('jobId', 'status');
      expect(response).toBe(newStatus);
    });
  });

});
