const swaggerJSDoc = require('swagger-jsdoc')

const swaggerDefinition = {
  swagger: '2.0',
  info: {
    title: 'Backend API',
    version: '1.0.0',
    description: 'Backend UI API Test'
  },
  basePath: '/',
  securityDefinitions: {
    bearerAuth: {
      type: 'apiKey',
      name: 'Authorization',
      description: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImR1bmdAZ21haWwuY29tIiwiaWQiOiI1ZDc3N2FlOTg4NDUyMjViZDU3NjE3ODEiLCJyb2xlcyI6WyJjdXN0b21lciIsImRvY3RvciJdLCJpYXQiOjE1NjkzODQ0NTUsImV4cCI6MTYwMDQ4ODQ1NX0.9ycRgTMykYqPW-GlwA7sATYwETTamRuhuZAHoVLQK_I',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT'
    }
  }
}
const options = {
  swaggerDefinition, 
  apis: ['./module/*/model.js','./module/*/router.js']
  // apis: ['**/*/model.js','**/*/router.js']
}

const swaggerSpec = swaggerJSDoc(options)
module.exports = {swaggerSpec}