const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// /**
//  * @swagger
//  *
//  * definitions:
//  *   Category:
//  *     type: object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         readOnly: true
//  *       name:
//  *         type: string
//  *       parent:
//  *         type: objectId
//  *     required:
//  *         - name
//  */
// /**
//  * @swagger
//  *
//  * definitions:
//  *   Ancestor:
//  *     type: object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         readOnly: true
//  *       name:
//  *         type: string
//  */

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  parent: {
    type: Schema.Types.ObjectId,
    ref: "category"
  },
  deleted:{
    type:Boolean,
    default: false
  }
});

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


module.exports = mongoose.model("category", schema, "categories");
