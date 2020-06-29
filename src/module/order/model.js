const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { STATUS } = require("../common/constant");

// /**
//  * @swagger
//  *
//  * definitions:
//  *   Order:
//  *     type: object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         readOnly: true
//  *       products:
//  *         type: array
//  *         items:
//  *           type: string
//  *           $ref: "#/definitions/ProductByOrder"
//  *       totalPrice:
//  *         type: number
//  *         readOnly: true
//  *       userId:
//  *         type: string
//  *       fullname:
//  *         type: string
//  *       email:
//  *         type: string
//  *       phone:
//  *         type: string
//  *       shipAddress:
//  *         type: string
//  *       paymentMethod:
//  *         type: string
//  *     required:
//  *       - transactionId
//  *       - totalPrice
//  *       - fullname
//  *       - email
//  *       - phone
//  *       - shipAddress
//  *       - paymentMethod
//  *       - status
//  */

// /**
//  * @swagger
//  *
//  * definitions:
//  *   ProductByOrder:
//  *     type: object
//  *     properties:
//  *       _id:
//  *         type: string
//  *         readOnly: true
//  *       productId:
//  *         type: objectId
//  *       storeId:
//  *         type: objectId
//  *       price:
//  *         type: number
//  *       quantity:
//  *         type: number
//  *       evacoinUsed:
//  *         type: number
//  *       evacoinReceived:
//  *         type: number
//  *         readOnly: true
//  *       coupon:
//  *         type: string
//  *       status:
//  *         type: string
//  *         readOnly: true
//  *       refUser:
//  *         type: string
//  *       transactionId:
//  *         type: objectId
//  *         description: Id of transaction
//  *         readOnly: true
//  *     required:
//  *       - productId
//  *       - storeId
//  *       - price
//  *       - quantity
//  */
const schema = new Schema(
  {
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "product"
        },
        size: {
          type: Number
        },
        color: {
          type: String
        },
        price: {
          type: Number
        },
        inventory: {
          type: Number
        }
      }
    ],
    totalPrice: {
      type: Number,
      required: [true, "is required"]
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user"
    },
    status: {
      type: String,
      // enum: [STATUS.PAID, STATUS.ORDERED, STATUS.CANCEL],
      default: STATUS.PAID,
      required: [true, "is required"]
    },
    name: {
      type: String,
      required: [true, "is required"]
    },
    email: {
      type: String,
      required: [true, "is required"]
    },
    phone: {
      type: String,
      required: [true, "is required"]
    },
    shipAddress: {
      type: String,
      required: [true, "is required"]
    },
    paymentMethod: {
      type: String
    },
    employees: [
      {
        type: Schema.Types.ObjectId,
        ref: "user"
      }
    ],

    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

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
module.exports = mongoose.model("order", schema, "orders");
