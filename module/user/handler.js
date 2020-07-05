const { encrypt } = require("../crypto");
const User = require("./model");
const { findProductById, updateCountFavorite } = require("../products");
const mongoose = require("mongoose");
// const get = async (filter, returnFields, page, numberPerPage) => {
//   return await User.find(filter).select(userReturnFileds).lean()
// }
const search = async (text, kind) => {
  if (kind == "customer")
    return await User.find({ $text: { $search: text }, role: kind });
  else
    return await User.find({
      $text: { $search: text },
      role: { $ne: "customer" }
    });
};
const findOne = async (filter, returnFields = "") => {
  const conditions = filter || {};
  const userReturnFileds = returnFields;
  return await User.findOne(conditions).select(`${userReturnFileds} +password`);
};

const getUserById = async id => {
  console.log("id", id);
  return await User.findById(mongoose.Types.ObjectId(id));
};

const changeRole = async (id, role) => {
  const tempId = mongoose.Types.ObjectId(id);
  return await User.findByIdAndUpdate(tempId, { role: role });
};
const create = async data => {
  if (data.password) {
    // facebook user is no need password
    data.password = encrypt(data.password);
  }
  const user = new User(data);
  return await user.save();
};

const update = async (id, data) => {
  if (data.password) {
    data.password = encrypt(data.password);
  }
  return await User.findByIdAndUpdate(id, data, { new: true });
};

const getCustomer = async () => {
  return await User.find({ role: "customer" }).lean();
};

const getEmployee = async () => {
  return await User.find({ role: { $ne: "customer" } }).lean();
};

//Used to add favorite
const addFavoritedProduct = async (userId, productId) => {
  const product = await findProductById(productId);
  if (!product) throw new Error("Not found product id");
  const user = await User.findById(userId);
  if (!user) throw new Error("Not found user id ", userId);
  const count = user.favoriteProducts.length;
  await User.findByIdAndUpdate(userId, {
    $addToSet: { favoriteProducts: productId }
  });
  const userTemp = await User.findById(userId);
  const counttemp = userTemp.favoriteProducts.length;
  if (counttemp > count) {
    await updateCountFavorite(
      product._id,
      product.favorited ? product.favorited + 1 : 1
    );
  }

  return user;
};

const addToCard = async (id, cart) => {
  return await User.update(
    {
      _id: mongoose.Types.ObjectId(id)
    },
    {
      $push: {
        carts: cart
      }
    }
  );
};

const removeCartItem = async (id, idItem) => {
  return await User.findOneAndRemove({
    _id: mongoose.Types.ObjectId(id),
    "detail._id": mongoose.Types.ObjectId(idItem)
  });
};

const removeCart = async id => {
  return await User.findOneAndUpdate(id, { carts: [] });
};

const getCarts = async id => {
  return await User.findById(id).select("carts");
};

const upDateCartItem = async (id, idItem, quantity) => {
  return await User.update(
    {
      _id: mongoose.Types.ObjectId(id),
      "carts._id": mongoose.Types.ObjectId(idItem)
    },
    { $inc: { "carts.$.quantity": quantity } }
  );
};

const updateUser = async (condition, id) =>
  await User.findByIdAndUpdate(id, condition, { new: true });

const getFavoriteProducts = async id => {
  return await User.findById(id)
    .select("favoriteProducts")
    .populate("favoriteProducts");
};

const removeFavoriteProduct = async (userid, productId) => {
  const product = await findProductById(productId);
  if (!product) throw new Error("Not found product id");
  console.log("favourite", product.favorited);
  await updateCountFavorite(
    product._id,
    product.favorited ? product.favorited - 1 : 1
  );
  return await User.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(userid) },
    { $pull: { favoriteProducts: mongoose.Types.ObjectId(productId) } },
    { new: true, runValidators: true }
  )
    .select("favoriteProducts")
    .populate("favoriteProducts");
};

const updateAvatar = async (id, avatar) => {
  const user = await User.findById(mongoose.Types.ObjectId(id));
  if (!user) {
    throw new Error("Not found User");
  }
  console.log("avatart", avatar);
  return await User.findByIdAndUpdate(
    user._id,
    { $set: { avatar: avatar } },
    { new: true }
  );
};
module.exports = {
  create,
  update,
  findOne,
  addFavoritedProduct,
  updateUser,
  getUserById,
  search,
  upDateCartItem,
  getCarts,
  removeCart,
  removeCartItem,
  addToCard,
  getFavoriteProducts,
  getCustomer,
  getEmployee,
  changeRole,
  updateAvatar,
  removeFavoriteProduct
};
