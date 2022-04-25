import supertest from 'supertest';

import app from '../index';
import swaggerSpec from '../config/swagger';

describe('Miscellaneous Controller Tests', () => {
  describe('GET /api/swagger.json', () => {
    it('should return a JSON Swagger spec', async () => {
      const request = supertest(app);
      const response = await request.get('/api/swagger.json');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(swaggerSpec);
    });
  });

  describe('GET /api/health-check', () => {
    it('should return 200 OK', async () => {
      const request = supertest(app);
      const response = await request.get('/api/health-check');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('OK');
    });
  });

  describe('GET /api/invalid-route', () => {
    it('should return 404 NOT_FOUND', async () => {
      const request = supertest(app);
      const response = await request.get('/api/invalid-route');
      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/invalid-route', () => {
    it('should return 404 NOT_FOUND', async () => {
      const request = supertest(app);
      const response = await request.post('/api/invalid-route');
      expect(response.status).toBe(404);
    });
  });
});
