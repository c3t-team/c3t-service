const {logDir} = require('../config')
const fs = require('fs')
const path = require('path')
const winston = require('winston')
require('winston-daily-rotate-file')

if(!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir)
}

const transports = []
transports.push(
  new winston.transports.DailyRotateFile({
    filename: path.join(logDir, 'eva-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
  })
)
transports.push(new winston.transports.Console())

const logger = winston.createLogger({
  format: winston.format
    .combine(winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), winston.format.json()),
  transports: transports
})

module.exports = logger