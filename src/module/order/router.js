const express = require("express");
const { handleError, makeResponse } = require("../common");
const logger = require("../logger");
const mongoose = require("mongoose");
const {
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
} = require("./handler");
const router = new express.Router();

router.get("/", async (req, res, next) => {
  const products = await findAll({});
  res.status(200).json(makeResponse(products));
});

router.get("/report", async (req, res, next) => {
  const products = await findAll({
    createdAt: {
      $gte: new Date(
        new Date(req.query.month + "/1" + "/" + req.query.year).setHours('00', '00', '00')
      ),
      $lt: new Date(
        new Date(req.query.month + "/30" + "/" + req.query.year).setHours(
          23,
          59,
          59
        )
      )
    }
  });
  const _products = products.map(item => item.products).flat();
  const a = [..._products];
  const result = _products
    .filter(
      (item, index) =>
        a.findIndex(_item => _item.productId._id === item.productId._id) ===
        index
    )
    .map(i => {
      let totalPrice = 0;
      let quantity = 0;
      _products.map(_i => {
        if (_i.productId._id === i.productId._id) {
          totalPrice += _i.price;
          quantity += 1;
        }
      });
      return {
        name: i.productId.name,
        quantity,
        totalPrice,
        id: i.productId._id
      };
    });

  res.status(200).json(makeResponse(result));
});

router.get("/user/:id", async (req, res, next) => {
  try {
    const userId = req.params.id ? req.params.id : 0;
    console.log("id ne", userId);
    let orders = await getOrderOfUser(userId);
    console.log("orde", orders);
    res.status(200).json(makeResponse(orders));
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id ? req.params.id : 0;
  console.log("id da", id);
  const order = await findOne(id);
  res.status(200).json(makeResponse(order));
});

router.put("/:id", async (req, res, next) => {
  validate(req.body);
  const id = req.params.id ? req.params.id : 0;
  const order = update(id, req.body);
  res.status(200).json(order);
});

router.post("/", async (req, res, next) => {
  try {
    validate(req.body);
    const order = await create(req.body);
    res.status(200).json(makeResponse(order));
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.post("/product-item/:id", async (req, res, next) => {
  validate(req.body);
  const id = req.params.id ? req.params.id : 0;
  const productItem = addProductItem(id, req.body);
  res.status(200).json(productItem);
});

router.put("/product-item/:id", async (req, res, next) => {
  validate(req.body);
  const id = req.params.id ? req.params.id : 0;
  const productItem = await removeProductItem(id, req.body.idItem);
  res.status(200).json(productItem);
});

router.put("/status/:id", async (req, res, next) => {
  const id = req.params.id ? req.params.id : 0;
  if (!req.body.status) throw new Error("miss status !!");
  const order = await UpdateStatusOrder(id, req.body.status);
  res.status(200).json(makeResponse(order));
});

router.delete("/:id", async (req, res, next) => {
  const id = req.params.id ? req.params.id : 0;

  const order = await findOne(id);
  for (let i = 0; i < order.products.length; i++) {
    await removeProductItem(id, order.products[i]._id);
  }
  const orderDelte = await deleteOrder(id);
  res.status(200).json(orderDelte);
});
module.exports = router;
