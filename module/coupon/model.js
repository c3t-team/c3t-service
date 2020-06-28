const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  code: {
    type: String,
    unique: true
  },
  percent: Number,
  expireAt: {
    type: Date
  }
})

schema.index({ "expireAt": 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model('coupon', schema, 'coupons')