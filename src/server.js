const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')
const {connect} = require('./module/database')
const logger = require('./module/logger')
const compression = require('compression')
require('dotenv').config()
const logger2 = require('morgan')
const app = express()

app.use(cors())
// GZIP all assets
app.use(compression())
app.use(logger2('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false, parameterLimit: 1000000 }))
app.use(cookieParser())
app.use(express.static('public'))

app.use('/api', require('./module/gateway').router) 
app.use('/api-docs', require('./module/swagger').router)
const port = process.env.PORT || '1337'
const startHttpServer = async () => {
  try {
    await connect()
    await app.listen(port)
    console.log(`Server is listening on port ${port}`)
  } catch (error) {
    logger.error(`Error when starting server on port ${port}`, error)
    process.exit(0)
  }
}

startHttpServer()
