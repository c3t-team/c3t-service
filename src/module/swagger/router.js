const express = require('express')
const router = new express.Router()
const {swaggerSpec} = require('./swaggerSpec')

const swaggerUi = require('swagger-ui-express')
router.use('/', swaggerUi.serve)
router.get('/', swaggerUi.setup(swaggerSpec))
router.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})
module.exports = {router}