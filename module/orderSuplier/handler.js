const OrderSuplier = require("./model");
const { STATUS } = require("../common/constant");
const mongoose = require("mongoose");
//Used in user module

const validate = data => {
  if (!data) throw new Error("data is empty");
};

const filter = async filter => {
  const reg = new RegExp(filter, "i");
  return OrderSuplier.find()
    .populate({ path: "suplierId", match: { _id: { $exists: true } } })
    .populate("employee");

  //không sử dụng được như thế này nha===>ahihi
  // .populate({
  //   path: "suplierId",
  //   select: "name",

  // })
  // .populate({
  //   path: "employee",

  //   select: "name"
  // });
};


const getAll = async (paran) => {
  console.log('as',new Date(new Date(paran.month+'/30'+'/'+paran.year).setHours(23, 59, 59)))

  // return {}
  const order= await OrderSuplier.find({createdAt:{ $gte: new Date(new Date(paran.month+'/1'+'/'+paran.year).setHours(00, 00, 00)),
    $lt: new Date(new Date(paran.month+'/30'+'/'+paran.year).setHours(23, 59, 59))}})
    .populate('suplierId')
    .populate("employee");
const unique= [...new Set(order.map(item=>item.suplierId._id))]

    return report = unique.map(item=>{
      let name=""
      let count=0
      let totalPrice=0
      order.map(_item=>{
        if(_item.suplierId._id===item){
          name=_item.suplierId.name?_item.suplierId.name:name;
          count+=_item.products?_item.products.length:0;
          totalPrice+=_item.totalPrice?_item.totalPrice:0

        } 
       
      })

      return {name,numberProductOrder:count,totalPrice}
    })
};

const findOne = async id => {
  return await OrderSuplier.findById(id)
    .populate("suplierId")
    .populate("employee")
    .populate("products.maSanPham");
};

const create = async data => {
  const orderSuplier = new OrderSuplier(data);
  return await orderSuplier.save();
};

const update = async (id, data) => {
  return await OrderSuplier.findByIdAndUpdate(id, data, { new: true });
};

const remove = async id => {
  return await OrderSuplier.findByIdAndUpdate(
    id,
    { deleted: true },
    { new: true }
  );
};

const Approved = async (id, status) => {
  try {
    return await OrderSuplier.findByIdAndUpdate(mongoose.Types.ObjectId(id), {
      status: status
    });
  } catch (error) {
    console.log("lỗi", error);
    return null;
  }
};
module.exports = {
  validate,
  create,
  update,
  remove,
  filter,
  findOne,
  Approved,getAll
};
