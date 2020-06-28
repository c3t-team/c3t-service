const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const host = require("../common/host");
const { pathAvatar } = require("../common/constant");

const schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      index: true
    },
    password: {
      type: String,
      select: false
    },
    facebookId: {
      type: String
    },
    googleId: {
      type: String
    },
    avatar: {
      type: String
    },

    role: {
      type: String,
      default: "customer"
    },
    phone: {
      type: String,
      trim: true,
      unique: true
    },
    address: {
      type: String
    },
    shipAddress: {
      type: String
    },
    status: {
      type: Boolean,
      default: true,
      select: true
    },
    carts: [
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
        quantity: {
          type: Number
        }
      }
    ],
    favoriteProducts: [{ type: Schema.Types.ObjectId, ref: "product" }],

    deleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
const index = { name: "text" };
schema.index(index);
schema.post("find", function(docs) {
  if (docs.length <= 0) return;
  for (let i = 0; i < docs.length; i++) {
    if (docs[i] && docs[i].avatar && !docs[i].avatar.includes("https://"))
      docs[i].avatar = host + "/" + pathAvatar + docs[i].avatar;
  }
});

schema.pre("findOne", function() {
  this.where({ deleted: false });
});
schema.pre("findById", function() {
  this.where({ deleted: false });
});
schema.pre("find", function() {
  this.where({ deleted: false });
});
schema.pre("findOneAndUpdate", function() {
  this.where({ deleted: false });
});
schema.pre("findByIdAndUpdate", function() {
  this.where({ deleted: false });
});
const user = mongoose.model("user", schema, "users");
module.exports = user;
