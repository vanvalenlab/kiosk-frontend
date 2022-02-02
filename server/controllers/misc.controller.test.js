import supertest from 'supertest';

import app from '../index';
import swaggerSpec from '../config/swagger';

describe('Miscellaneous Controller Tests', () => {

  describe('GET /api/swagger.json', () => {

    it('should return a JSON Swagger spec', done => {
      const request = supertest(app);
      const response = await request.get('/api/swagger.json');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(swaggerSpec);
      done();
    });

  });

  describe('GET /api/health-check', () => {

    it('should return 200 OK', done => {
      const request = supertest(app);
      const response = await request.get('/api/health-check');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('OK');
      done();
    });

  });

  describe('GET /api/invalid-route', () => {

    it('should return 404 NOT_FOUND', done => {
      const request = supertest(app);
      const response = await request.get('/api/invalid-route');
      expect(response.status).toBe(404);
      done();
    });
  });

  describe('POST /api/invalid-route', () => {

    it('should return 404 NOT_FOUND', done => {
      const request = supertest(app);
      const response = await request.post('/api/invalid-route');
      expect(response.status).toBe(404);
      done();
    });
  });

});
