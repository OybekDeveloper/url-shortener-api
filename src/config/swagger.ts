import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config();

export const swaggerOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Secure URL Shortener API',
      version: '1.0.0',
      description: 'API documentation for Secure URL Shortener',
    },
    servers: [
      {
        url: process.env.PUBLIC_URL || 'http://localhost:8080',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // @swagger yoziladigan joylar
};

export default swaggerJSDoc(swaggerOptions);
