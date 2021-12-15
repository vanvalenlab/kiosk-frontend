import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';

let apis;
if (config.env === 'production') {
  apis = ['dist/server/routes/*.js'];
} else {
  apis = ['server/routes/*.js'];
}

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'DeepCell Kiosk API', // Title (required)
      version: '0.8.2', // Version (required)
      description: 'The API for interacting with the DeepCell Kiosk.'
    },
  },
  // Path to the API docs
  apis: apis,
  basePath: '/',
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
