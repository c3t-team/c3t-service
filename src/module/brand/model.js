const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// /**
//  * @swagger
//  *
//  * definitions:
//  *   Brand:
//  *     type: object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         readOnly: true
//  *       name:
//  *         type: string
//  *       products:
//  *         example: []
//  *         type: array
//  *         items:
//  *           type: string
//  *       images:
//  *         type: object
//  *         logo:
//  *           type: string
//  *         image:
//  *           type: string
//  *       deleted:
//  *         type: boolean
//  *         default: false
//  *         readOnly: true
//  *     required:
//  *       - name
//  *       - images
//  */
const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index:true,

    },
    phone: {
      type: String,
      trim: true,
   
   
    },

    email: {
      type: String,
      required: true,
   
    },
    address: {
      type: String
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product"
      }
    ],

    deleted: {
      type: Boolean,
      select: false,
      default: false
    }
  },
  { timestamps: true }
);
const index = { name: 'text'}
schema.index(index)
schema.pre("find", function() {
  this.where({ deleted: false });
});
schema.pre("findOne", function() {
  this.where({ deleted: false });
});
schema.pre("findById", function() {
  this.where({ deleted: false });
});
schema.pre("findOneAndUpdate", function() {
  this.where({ deleted: false });
});
schema.pre("findByIdAndUpdate", function() {
  this.where({ deleted: false });
});
module.exports = mongoose.model("brand", schema, "brands");
