import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Umiya Grocery API', version: '1.0.0', description: 'Production-ready Grocery Store REST API' },
    servers: [
      { url: 'http://localhost:5000/api', description: 'Development' },
      { url: 'https://api.umiyagrocery.com/api', description: 'Production' },
    ],
    components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
