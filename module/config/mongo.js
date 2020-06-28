const {format} = require('util')
const dotenv = require('dotenv')
dotenv.config()

const hasAuthen = process.env.EVA_DB_USER && process.env.EVA_DB_PASSWORD
const host = process.env.EVA_DB_HOST || 'localhost'
const port = process.env.EVA_DB_PORT || 27017
const dbName = process.env.EVA_DB_NAME || 'eva'
const uri = hasAuthen ? 
  format('mongodb://%s:%s@%s/%s', process.env.EVA_DB_USER, process.env.EVA_DB_PASSWORD, host, port, dbName) : 
  format('mongodb://%s:%s/%s', host, port, dbName)
module.exports = {
  uri: process.env.MONGO_URI || uri,
  poolSize: process.env.EVA_DB_POOL_SIZE || 10
}