const mongoose = require('mongoose')
const Schema = mongoose.Schema

const tokenSchema = new Schema({
  userId: String,
  
  value: String,
  expire_at: {type: Date, default: () => Date.now() + 120, expires: 60 * 60 * 24 } 
})

module.exports = mongoose.model('activeToken', tokenSchema, 'activeToken')
