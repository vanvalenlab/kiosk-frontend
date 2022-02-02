import MockRedis from 'ioredis-mock';
import supertest from 'supertest';

import app from '../index';

jest.mock('../config/redis', () => {
  const mockRedis = new MockRedis({
    data: {
      jobId: {
        'status': 'done',
        'otherKey': 'testValue'
      }
    }
  });
  return mockRedis;
});

jest.mock('../config/config', () => {
  return {
    jobTypes: ['testJob1', 'testJob2'],
    aws: {},
    gcp: {},
    uploadDirectory: 'uploads'
  };
});

describe('Predict Controller Tests', () => {

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe('predictController.predict', () => {
    it('should create a job in redis', async () => {
      const request = supertest(app);
      const response = await request.post('/api/predict')
        .set('content-type', 'application/json')
        .send({ jobType: 'testJob1', imageName: 'test.zip' });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('hash');
      // TODO: check Redis entries for valid data.
    });

    it('should return a 400 for bad request body', async () => {
      const request = supertest(app);
      const response = await request.post('/api/predict')
        .set('content-type', 'application/json')
        .send({ hash: 'jobId' });

      expect(response.statusCode).toEqual(400);
    });

    it('should return a 400 for bad job type', async () => {
      const request = supertest(app);
      const response = await request.post('/api/predict')
        .set('content-type', 'application/json')
        .send({ jobType: 'invalidJobType', imageName: 'test.zip' });

      expect(response.statusCode).toEqual(400);
    });

    // it('should return a 500 when an error is raised', async () => {

    //   jest.doMock('../config/config', () => {
    //     return {
    //       hmset: () => {
    //         throw new Error('on purpose');
    //       }
    //     };
    //   });
    //   const request = supertest(app);
    //   const response = await request.post('/api/predict')
    //     .set('content-type', 'application/json')
    //     .send({ jobType: 'testJob1', imageName: 'test.tif'});

    //   expect(response.statusCode).toEqual(500);
    //   done();
    // });
  });

  describe('predictController.getJobStatus', () => {

    it('should get the correct job status', async () => {
      const request = supertest(app);
      const response = await request.post('/api/status')
        .set('content-type', 'application/json')
        .send({ hash: 'jobId' });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toEqual('done');
    });

    it('should return null for invalid record', async () => {
      const request = supertest(app);
      const response = await request.post('/api/status')
        .set('content-type', 'application/json')
        .send({ hash: 'invalidJobId' });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toEqual(null);
    });
  });

  describe('predictController.getJobTypes', () => {

    it('should return the jobs supportin in config', async () => {
      const request = supertest(app);
      const response = await request.get('/api/jobtypes');

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('jobTypes');
      expect(response.body.jobTypes).toEqual(['testJob1', 'testJob2']);
    });
  });

  describe('predictController.getKey', () => {

    it('should return the correct redis value', async () => {
      const request = supertest(app);
      const response = await request.post('/api/redis')
        .set('content-type', 'application/json')
        .send({ hash: 'jobId', key: 'otherKey' });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('value');
      expect(response.body.value).toEqual('testValue');
    });

    it('should return the multiple redis values', async () => {
      const request = supertest(app);
      const response = await request.post('/api/redis')
        .set('content-type', 'application/json')
        .send({ hash: 'jobId', key: ['status', 'otherKey'] });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('value');
      expect(response.body.value).toEqual(['done', 'testValue']);
    });
  });

  describe('predictController.expireHash', () => {

    it('should expire the hash', async () => {
      const request = supertest(app);
      const response = await request.post('/api/redis/expire')
        .set('content-type', 'application/json')
        .send({ hash: 'jobId', expireIn: 1 });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toHaveProperty('value');
      expect(response.body.value).toEqual(1);
    });

    it('should return 0 if there is no hash found', async () => {
      const request = supertest(app);
      const response = await request.post('/api/redis/expire')
        .set('content-type', 'application/json')
        .send({ hash: 'invalidJobId' });

      expect(response.statusCode).toEqual(404);
      expect(response.body).toHaveProperty('value');
      expect(response.body.value).toEqual(0);
    });
  });
});
