const Product = require("./model");
const mongoose = require("mongoose");

const validateReqBody = body => {
  if (!body) {
    throw new Error("Missing data");
  }
  if (!body.name) {
    throw new Error("'Name' is required");
  }
};
// const filter = {
//   name: 1,
//   images: 1
// };

const findAllProductIsActivity = async () => {
  return await Product.find({ status: true }).populate({
    path: "categories",
    populate: { path: "parent" }
  });
};

const findAll = async () => {
  return await Product.find().populate({
    path: "categories",
    populate: { path: "parent" }
  });
};

const findOne = async (conditions, returnFields, page, perPage) => {
  return await Product.findOne(conditions)
    .populate({
      path: "products",
      select: { name: 1, images: 1, description: 1 },
      options: {
        skip: page * perPage,
        limit: perPage
      }
    })
    .select(returnFields)
    .lean();
};

const findProductById = async id => {
  return await Product.findById(id).populate({
    path: "categories",
    populate: { path: "parent" }
  });
};

const updateCountFavorite = async (id, count) => {
  return await Product.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
    $set: { favorited: count }
  });
};

const getProductsSale = async () => {
  return await Product.find({ sale: { $gt: 0 } });
};
const addItem = async (_id, filter, newId) => {
  let object = {};
  object[filter] = newId;
  const _conditions = { _id };
  const product = await Product.findOne(_conditions).lean();
  if (product[filter].filter(item => item == newId).length === 0)
    return await Product.findByIdAndUpdate(
      _conditions,
      { $push: object },
      { new: true, runValidators: true }
    );
  throw new Error(filter + " existed");
};

const removeItem = async (_id, filter, itemId) => {
  const product = await Product.findById(_id);
  if (!product[filter]) throw new Error("Unable to found item " + filter);
  const obj = {};
  obj[filter] = mongoose.Types.ObjectId(itemId);
  return product.findByIdAndUpdate(_id, { $pull: obj }, { new: true });
};

const create = async data => {
  const reg = new RegExp("^" + data.name.toLowerCase() + "$", "i");
  const old_product = await Product.find({ name: reg }, { _id: 1 })
    .limit(1)
    .lean();
  if (old_product.length > 0) throw new Error("product name already existed");
  const product = new Product(data);
  return await product.save();
};

const update = async (id, data) => {
  return await Product.findByIdAndUpdate(mongoose.Types.ObjectId(id), data, {
    new: true,
    runValidators: true
  });
};

const remove = async id => {
  return await Product.findByIdAndUpdate(id, { deleted: true }, { new: true });
};

const getDetail = async id => {
  return await Product.findById(mongoose.Types.ObjectId(id)).select("detail");
};

const addDetail = async (id, detail) => {
  return await Product.update(
    {
      _id: mongoose.Types.ObjectId(id)
    },
    {
      $push: {
        detail: detail
      }
    }
  );
};

const updateDetailItem = async (id, idItem, item) => {
  return await Product.update(
    {
      _id: mongoose.Types.ObjectId(id),
      "detail._id": mongoose.Types.ObjectId(idItem)
    },
    { $inc: { "detail.$.inventory": item } }
  );
};

const updatePriceDetail = async (id, idItem, item) => {
  return await Product.update(
    {
      _id: mongoose.Types.ObjectId(id),
      "detail._id": mongoose.Types.ObjectId(idItem)
    },
    { $set: { "detail.$.price": item } }
  );
};
const search = async text => {
  try {
    return await Product.find({ $text: { $search: text } });
  } catch (error) {
    console.log("loi j day", error);
  }
};


const removeImgName = async (id, name) => {
  let exist = await Product.find({
    _id: id
  });
  console.log(exist);
  if (exist.length > 0) {
    await Product.findById(id, function(err, product) {
      if (name) {
        product.images.pull(name);
      }
      product.markModified("products");
      product.save();
    });
  } else {
    throw new Error("productID not  existed !");
  }
};

const UpdateAmountSold = async (productId, color, size, quantity) => {
  // return await Product.update(
  //   {
  //     _id: mongoose.Types.ObjectId(productId),
  //     "detail.color": color,
  //     "detail.size": size
  //   },
  //   {
  //     $inc: {
  //       "detail.$.amountSold": parseInt(quantity),
  //       "detail.$.inventory": -parseInt(quantity)
  //     }
  //   }
  // );
  return await Product.update(
    {
      _id: mongoose.Types.ObjectId(productId),
      detail: { $elemMatch: { color: color, size: size } }
    },
    {
      $inc: {
        "detail.$.amountSold": parseInt(quantity),
        "detail.$.inventory": -parseInt(quantity)
      }
    }
  );
};

const UpdateInventory = async (productId, color, size, quantity) => {
  return await Product.update(
    {
      _id: mongoose.Types.ObjectId(productId),
      "detail.color": color,
      "detail.size": size
    },
    {
      $inc: {
        "detail.$.amountSold": -parseInt(quantity),
        "detail.$.inventory": parseInt(quantity)
      }
    }
  );
};

const getProductBuyCategoryMan = async () => {
  return await Product.find().populate({
    path: "categories",
    populate: {
      path: "parent"
    }
  });
};

const getProductBuyCategoryWomen = async () => {
  return await Product.find().populate({
    path: "categories",
    populate: {
      path: "parent",

      name: "Giày nữ"
    }
  });
};

// const filterProductByCondition =  async(conditions)=>{

// }
module.exports = {
  validateReqBody,
  findAll,
  findOne,
  create,
  update,
  addItem,
  removeItem,
  remove,
  getDetail,
  findProductById,
  addDetail,
  updateDetailItem,
  updatePriceDetail,
  search,
  removeImgName,
  updateCountFavorite,
  UpdateAmountSold,
  UpdateInventory,
  getProductBuyCategoryMan,
  getProductBuyCategoryWomen,
  getProductsSale,
  findAllProductIsActivity
};
