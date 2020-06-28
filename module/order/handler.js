const Order = require("./model");
const productHandler = require("../products/handler");
const { STATUS } = require("../common/constant");
const mongoose = require("mongoose");

const validate = body => {
  if (!body) {
    throw new Error("body is empty");
  }
};

const findAll = async condition => {
  return await Order.find(condition)
    .populate("products.productId")
    .lean();
};

const findOne = async id => {
  return await Order.findById(id).populate("products.productId");
};
const update = async (id, data) => {
  return await Order.findByIdAndUpdate(id, data, { new: true });
};

const addProductItem = async (id, productItem) => {
  return Order.findOneAndUpdate(
    { _id: id },
    { $push: { products: productItem } },
    { new: true, runValidators: true }
  );
};

const removeProductItem = async (id, productItemId) => {
  try {
    console.log("vo ko", id, productItemId);
    const order = await Order.findById(id);
    console.log("totalproce ne", order, order.totalPrice);
    let total = parseInt(order.totalPrice);
    //props.updateAmountSold(item.productId,item.color, item.size, item.quantity);

    if (order && order.products) {
      const temp = order.products;
      for (let k = 0; k < temp.length; k++) {
        console.log(
          "for if",
          temp[k]._id,
          productItemId,
          temp[k]._id == productItemId
        );

        if (temp[k]._id.toString() == productItemId.toString()) {
          console.log("for if vao");
          await productHandler.UpdateInventory(
            temp[k].productId,
            temp[k].color,
            temp[k].size,
            temp[k].inventory
          );
          break;
        }
      }
    }

    if (order.products.length == 1 && order.products[0]._id.toString() == productItemId.toString()) {
      console.log("chi tiet1");
      return await Order.findByIdAndDelete(id);
    } else {
      for (let i = 0; i < order.products.length; i++) {
        console.log(
          "for ne",
          typeof productItemId,
          typeof order.products[i]._id
        );
        if (order.products[i]._id == productItemId) {
          console.log("for for for", productItemId, order.products[i]._id);
          total =
            parseInt(order.totalPrice) -
            parseInt(order.products[i].price) *
              parseInt(order.products[i].inventory);

          console.log("chi tiet", order.totalPrice, order.products[i].price);
          return await Order.findOneAndUpdate(
            { _id: id },
            {
              $pull: {
                products: { _id: mongoose.Types.ObjectId(productItemId) }
              },
              totalPrice: total
            },
            { new: true, runValidators: true }
          );
        } else {
          console.log("elde ne");
        }
      }
    }

    return order;
  } catch (error) {
    console.log("err", error);
  }
};

const getOrderOfUser = async id => {
  return await Order.find({ userId: mongoose.Types.ObjectId(id) }).populate(
    "products.productId"
  );
};

const UpdateStatusOrder = async (orderId, status) => {
  return await Order.findByIdAndUpdate(mongoose.Types.ObjectId(orderId), {
    status: status
  });
};

const create = async order => {
  const orderSave = new Order(order);
  return await orderSave.save();
};
const deleteOrder = async id => {
  return await Order.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
    deleted: true
  });
};
module.exports = {
  findAll,
  validate,
  findOne,
  update,
  addProductItem,
  removeProductItem,
  create,
  getOrderOfUser,
  UpdateStatusOrder,
  deleteOrder
};
