const Brand = require("./model");
const mongoose = require("mongoose");

const validateReqBody = body => {
  if (!body) {
    throw new Error("Missing data");
  }
  if (!body.name) {
    throw new Error("'Name' is required");
  }
  if (!body.phone) {
    throw new Error("phone is required");
  }
  if (!body.email) {
    throw new Error("email is required");
  }
  if (!body.address) {
    throw new Error("address is required");
  }
};

const findAll = async () => {
  return await Brand.find({}).populate('products', 'name');
};

const search = async (text) => {
  return await Brand.find({ $text: { $search: text }},  {score: {$meta: 'textScore'}}).populate('products', 'name')};

const findOne = async (conditions, returnFields) => {
  return await Brand.findOne(conditions)
    .select(returnFields)
    .lean();
};

const addProductId = async (id, productId) => {
  let exist = await Brand.find({
    _id: id,
    products: { $elemMatch: { productId: productId } }
  });
  if (exist.length > 0) {
    throw new Error("productID existed !");
  } else {
    await Brand.findById(id, function(err, brand) {
      if (productId) {
        brand.products.push(productId);
      }
      brand.markModified("products");
      brand.save();
    });
  }
  // return await Brand.findByIdAndUpdate(
  //   id,
  //   { $push: { products:  productId  } },
  //   { new: true, runValidators: true }
  // );
};

const removeProductId = async (id, productId) => {
  // return await Brand.findOneAndUpdate(
  //   { _id: id },
  //   { $pull: { products: {  _productId } } },
  //   { new: true }
  // );

  let exist = await Brand.find(
    {
      _id: id
    }
  );
  console.log(exist);
  if (exist.length>0) {
    await Brand.findById(id, function(err, brand) {
      if (productId) {
        brand.products.pull(productId);
      }
      brand.markModified("products");
      brand.save();
    });

  } else {
    throw new Error("productID not  existed !");
  }
};
const getNameBrand = async () => {
  return await Brand.find({}).select("_id name");
};
const getProductIds = async id => {
  //var productIds = {};
  // await Brand.findById(id, function(err, brand) {
  //   productIds = brand.products;
  // });
  return await Brand.findById(id).populate('products', 'name');
  //return productIds;
};

// const addItem = async (_id,filter, newId) => {
//   let object ={}
//   object[filter]=newId
//   const _conditions={_id}
//   const brand= await Brand.findOne(_conditions).lean()
//   if(brand[filter].filter(item=>item==newId).length===0)
//     return await Brand.findByIdAndUpdate(_conditions, {'$push': object},{new: true, runValidators: true})
//   throw new Error(filter + ' existed')
// }

// const removeItem = async (_id,filter, itemId) => {
//   const brand= await Brand.findById(_id)
//   if(!brand[filter]) throw new Error('Unable to found item ' + filter)
//   const obj = {}
//   obj[filter] = mongoose.Types.ObjectId(itemId)
//   return Brand.findByIdAndUpdate(_id, {'$pull': obj}, {new: true})
// }

const create = async data => {
  const reg = new RegExp("^" + data.name.toLowerCase() + "$", "i");
  // const old_brand = await Brand.find({name: reg}, {_id: 1}).limit(1).lean()
  const old_brand = await Brand.find({ name: reg })
    .limit(1)
    .lean();
  if (old_brand.length > 0) throw new Error("Brand name already existed");
  const brand = new Brand(data);
  return await brand.save();
};

const update = async (id, data) => {
  return await Brand.findByIdAndUpdate(mongoose.Types.ObjectId(id), data, {
    new: true,
    runValidators: true
  });
};

const remove = async(id)=>{
  return await Brand.findByIdAndUpdate(id, {deleted: true}, {
    new: true,
    runValidators: true
  });
}

const findBrandById = async(id)=>{
  return await Brand.findById(mongoose.Types.ObjectId(id));
}


module.exports = {
  validateReqBody,
  findAll,
  findOne,
  create,
  update,
  addProductId,
  removeProductId,
  getNameBrand,
  getProductIds,
  remove,
  search,
  findBrandById
};
