// Import the dependencies for testing
import supertest from 'supertest';
import tmp from 'tmp';
import { PassThrough } from 'stream';

import app from '../index';
import config from '../config/config';

jest.mock('../config/config', () => ({
  gcp: {},
  aws: {},
  uploadDirectory: '/test/',
}));

const mockStream = new PassThrough();

jest.mock('../config/multer', () => {
  return {
    single: jest.fn(() => {
      return (req, res, next) => {
        req.file = {
          originalname: 'sample.name',
          mimetype: 'sample.type',
          path: 'sample.url',
        };
        return next();
      };
    }),
  };
});

jest.mock('@google-cloud/storage', () => {
  return {
    Storage: jest.fn(() => {
      return {
        bucket: jest.fn(() => {
          return {
            file: jest.fn(() => {
              return {
                createWriteStream: jest.fn(() => mockStream),
                makePublic: jest.fn(() => Promise.resolve(true)),
              };
            }),
          };
        }),
      };
    }),
  };
});

describe('Upload Controller Tests', () => {
  describe('POST /api/upload', () => {
    it('should upload file using multer S3', async () => {
      config.cloud = 'aws';
      const tmpobj = tmp.fileSync({ postfix: '.png' });
      const request = supertest(app);
      const response = await request
        .post('/api/upload')
        .attach('file', tmpobj.name);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('imageURL');
    });

    it('should upload file using multer', async () => {
      config.cloud = 'gcp';

      const tmpobj = tmp.fileSync({ postfix: '.png' });
      const request = supertest(app);

      const response = await request
        .post('/api/upload')
        .attach('file', tmpobj.name);

      setTimeout(() => {
        mockStream.end();
      }, 10);

      const resolved = await response;
      expect(resolved.status).toBe(200);
      expect(resolved.body).toHaveProperty('imageURL');
    });
  });
});
