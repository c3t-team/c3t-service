const mongoose = require('mongoose')
const Schema = mongoose.Schema
/**
 * @swagger
 *
 * definitions:
 *   Campaign:
 *     type: object
 *     properties:
 *       _id: 
 *         type: string
 *         readOnly: true
 *       name:
 *         type: string
 *       url:
 *         type: string
 *       images:
 *         type: array
 *         items:
 *           type: string
 *       deleted:
 *         type: boolean
 *         default: false
 *         readOnly: true  
 *     required:
 *       - name
 *       - type
 */
const schema = new Schema({
  name: {
    type: String,
    required: [true, 'is required'],
    trim:true
  },
  url: {
    type: String,
    required: [true, 'is required'],
  },
  images: {
    type: [String],
    required: true
  },
  deleted: {
    type: Boolean,
    select: false,
    default: false,
    required: [true, 'is required']
  }
}, {timestamps: true})
  
schema.pre('find', function() {
  this.where({deleted: false})
})
schema.pre('findOne', function() {
  this.where({deleted: false})
})
schema.pre('findById', function() {
  this.where({deleted: false})
})
schema.pre('findOneAndUpdate', function() {
  this.where({deleted: false})
})
schema.pre('findByIdAndUpdate', function() {
  this.where({deleted: false})
})  
module.exports = mongoose.model('campaign', schema, 'campaigns')