import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'DeepCell Kiosk API', // Title (required)
      version: '0.5.0', // Version (required)
      description: 'The API for interacting with the DeepCell Kiosk.'
    },
  },
  // Path to the API docs
  apis: ['server/routes/*.js'],
  basePath: '/api',
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
