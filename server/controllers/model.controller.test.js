import supertest from 'supertest';

import app from '../index';
import config from '../config/config';

const mockGcpResponse = [
  [], null, { prefixes: [`${config.model.prefix}/Model`] }
];

const mockGcpResponse2 = [
  [], null, { prefixes: [`${config.model.prefix}/Model/0`] }
];

const mockAwsModel = `${config.model.prefix}/Model`;
const mockAwsResponse = [{ Prefix: mockAwsModel }];

const mockAwsModel2 = `${config.model.prefix}/Model2`;
const mockAwsResponse2 = [{ Prefix: mockAwsModel2 }];

const mockModelPrefix = config.model.prefix;

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      listObjectsV2: jest.fn((params) => {
        return {
          promise() {
            const isTruncated = !Object.prototype.hasOwnProperty.call(
              params, 'ContinuationToken')  && !params.Prefix.includes('Model');

            let response;
            if (isTruncated)  {
              response = mockAwsResponse;
            } else if (params.Prefix.endsWith('Model')) {
              response = [
                { Prefix: `${mockAwsModel}/0`},
                { Prefix: `${mockAwsModel}/1`}
              ];
            } else if (params.Prefix.endsWith('Model2')) {
              response = [
                { Prefix: `${mockAwsModel2}/0`},
                { Prefix: `${mockAwsModel2}/1`}
              ];
            } else {
              response = mockAwsResponse2;
            }

            return Promise.resolve({
              NextContinuationToken: 'token',
              IsTruncated: isTruncated,
              CommonPrefixes: response
            });
          }
        };
      })
    })),
    config: {
      update: () => true
    }
  };
});

jest.mock('@google-cloud/storage', () => ({
  Storage: jest.fn(() => {
    return {
      bucket: jest.fn(() => {
        return {
          getFiles: jest.fn((params) => {
            if (params.prefix === 'models') {
              return mockGcpResponse;
            }
            return mockGcpResponse2;
          })
        };
      })
    };
  })
}));

jest.mock('../config/multer', () => ({
  single: jest.fn(() => {
    return (req, res, next) => {
      req.file = {
        originalname: 'sample.name',
        mimetype: 'sample.type',
        path: 'sample.url'
      };
      return next();
    };
  })
}));

jest.mock('../config/config', () => ({
  gcp: {},
  aws: {},
  uploadDirectory: '/test/',
  model: { prefix: 'models' }
}));

describe('Model Controller Tests', () => {

  describe('GET /api/models', () => {

    it('should get models from AWS bucket', async () => {
      config.cloud = 'aws';
      const request = supertest(app);
      const response = await request.get('/api/models');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('models');
      expect(response.body.models).toHaveProperty('Model');
      expect(response.body.models.Model).toMatchObject(['0', '1']);
      expect(response.body.models).toHaveProperty('Model2');
      expect(response.body.models.Model2).toMatchObject(['0', '1']);
    });

    it('should get models from GCP bucket', async () => {
      config.cloud = 'gcp';

      const request = supertest(app);
      const response = await request.get('/api/models');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('models');
      expect(response.body.models).toHaveProperty('Model');
      expect(response.body.models.Model).toMatchObject(['0']);
    });

  });

});
