const tokenConfig = require('./token')
const {privatekey} = require('./common')
const {logDir} = require('./logger')
const dbConfig = require('./mongo')


module.exports = {tokenConfig, privatekey, logDir, dbConfig}
