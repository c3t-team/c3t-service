const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const { ogPath, path200 } = require("../common/constant");
// const host = require("../common/host");

const rating = new Schema(
  {
    userId: {
      type: String,
      required: true
    },

    rate: {
      type: Number,
      max: [5, "max rate is 5"],
      min: [0, "min rate is 0"],
      required: true
    },

    time: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "is required"],
      trim: true,
     
    },

    // inventory: {
    //   type: Number,
    //   trim: true,
    //   default: 0
    // },
    nameShow: {
      type: String,
      trim: true,
      index: true
    },
    rating: [rating],
    price: {
      type: Number,
      min: 0
    },
    description: {
      type: String,
      trim: true
    },
    sale: {
      type: Number,
      trim: true,
      default:0
    },
    favorited: {
      type: Number,
      trim: true,
      default: 0
    },
    categories: {
      type: Schema.Types.ObjectId,
      required: [true, "is required"],
      ref: "category"
    },

    rate: {
      type: Number,
      min: 0,
      max: 500,
      default: 0
    },

    images: [
      {
        type: String,
        trim: true
      }
    ],

    detail: [
      {
        size: {
          type: String,
          trim: true
        },
        color: {
          type: String,
          trim: true
        },
        price: {
          type: Number,
          trim: true
        },
        inventory: {
          type: Number,
          default: 0,
          min: 0
        },
        amountSold: {
          type: Number,
          default: 0,
          min: 0
        }
      }
    ],
    // amountSold: {
    //   type: Number,
    //   default: 0,
    //   min: 0
    // },
    //status: true: đang hoạt đông
    //status: false: ngừng hoạt động
    status: {
      type: Boolean,
      default: false,
      required: true
    },
    deleted: {
      type: Boolean,
      select: false,
      default: false
    }
  },
  {
    timestamps: true
  }
);
const index = { nameShow: "text" };
schema.index(index);
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
module.exports = mongoose.model("product", schema, "products");
