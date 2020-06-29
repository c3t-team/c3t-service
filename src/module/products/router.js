const express = require("express");
const router = new express.Router();
const {
  validateReqBody,
  create,
  findOne,
  findAll,
  update,
  addItem,
  remove,
  getDetail,
  findProductById,
  addDetail,
  updateDetailItem,
  updatePriceDetail,
  search,
  removeImgName,
  UpdateAmountSold,
  getProductBuyCategoryMan,
  getProductBuyCategoryWomen,
  getProductsSale,
  findAllProductIsActivity
} = require("./handler");
const logger = require("../logger");
const { handleError, makeResponse } = require("../common");
const model = require("./model");

router.get("/filter", async (req, res, next) => {
  try {
    const externalFields = ["q"];
    const conditions = Object.keys(req.query)
      .filter(k => externalFields.indexOf(k) === -1)
      .reduce(async (acc, key) => {
        const rs = await acc;

        if (key === "price") {
          rs["price"] = {
            $gte: Number(req.query[key].split(",")[0]) || 0,
            $lte: Number(req.query[key].split(",")[1]) || 1000000000
          };
        } else if (key == "categories") {
          const categories = req.query[key].split(",");

          rs["categories"] = {
            $in: categories
          };
        }

        return rs;
      }, Promise.resolve({}));
    const products = req.query.q
      ? // query search
      await model
        .find(
          { $text: { $search: req.query.q }, ...(await conditions) },
          { score: { $meta: "textScore" } }
        )
        .sort({ score: { $meta: "textScore" } })
        .lean()
      : //not query search
      await model.find(await conditions).lean();

    res.status(200).json(makeResponse(products));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});
router.get("/products-sale", async (req, res, next) => {
  const products = await getProductsSale();
  res.status(200).json(makeResponse(products));
});

router.get("/product-man", async (req, res, next) => {
  const products = await getProductBuyCategoryMan();
  res.status(200).json(makeResponse(products));
});

router.get("/product-women", async (req, res, next) => {
  const products = await getProductBuyCategoryWomen();
  res.status(200).json(makeResponse(products));
});
// const {MESSAGE} = require('../common/constant')
// /**
//  * @swagger
//  * /api/v1/products:
//  *   get:
//  *     tags:
//  *       - products
//  *     description: get products with filter
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: Success
//  */
router.get("/", async (req, res, next) => {
  try {
    let products = [];
    console.log("req.query.activity", req.query.activity);
    if (req.query.activity == "false") {
      products = await findAll();
    } else {
      products = await findAllProductIsActivity();
    }
    res.json(makeResponse(products));
  } catch (error) {
    res.json(handleError(error));
    logger.info(`${req.originalUrl}: `, error);
  }
});
// /**
//  * @swagger
//  * /api/v1/products/{name}?page&per_page:
//  *   get:
//  *     tags:
//  *       - products
//  *     description: get product by product
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: path
//  *         name: name
//  *         description: product name
//  *         type: string
//  *       - name: page
//  *         in: query
//  *       - name: per_page
//  *         in: query
//  *     responses:
//  *       200:
//  *         description: Success
//  */

// router.get("/:name", async (req, res, next) => {
//   try {
//     const conditions = { name: req.params.name };
//     const filter = { name: 1 };
//     const page = Number(req.query.page) ? Number(req.query.page) : undefined;
//     const perPage = Number(req.query.per_page)
//       ? Number(req.query.per_page)
//       : undefined;
//     const product = await findOne(conditions, filter, page, perPage);

//     if (!product)
//       throw new Error("Unable to find product name " + req.params.name);
//     res.json(makeResponse(product));
//   } catch (error) {
//     logger.info(`${req.originalUrl}: `, error);
//     res.json(handleError(error));
//   }
// });

router.get("/search", async (req, res, next) => {
  try {
    const products = await search(req.query.q);
    console.log("filter ne", req.query.q);
    console.log("ppp", products);
    res.json(makeResponse(products));
  } catch (error) {
    res.json(handleError(error));
    logger.info(`${req.originalUrl}: `, error);
  }
});

router.get("/:id", async (req, res, next) => {
  console.log("111", req.params.id);
  var product = await findProductById(req.params.id);
  res.status(200).json(makeResponse(product));
});
// /**
//  * @swagger
//  * /api/v1/products:
//  *   post:
//  *     tags:
//  *       - products
//  *     description: Create a product
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: body
//  *         name: bodyReq
//  *         description: product body
//  *         required: true
//  *         schema:
//  *            $ref: "#/definitions/product"
//  *     responses:
//  *       200:
//  *         description: Success
//  *     security:
//  *       - bearerAuth: []
//  */
router.post("/", async (req, res, next) => {
  try {
    validateReqBody(req.body);
    const isExistName = await findOne({
      conditions: { name: req.body.name },
      filter: { name: 1 }
    });
    if (isExistName) {
      throw new Error(`product ${req.body.name} is already exist`);
    }
    const product = await create(req.body);
    logger.info("created product");
    res.status(200).json(makeResponse(product));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});

// /**
//  * @swagger
//  * /api/v1/products/{name}:
//  *   put:
//  *     tags:
//  *       - products
//  *     description: update product's information
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: name
//  *         description: product name
//  *         in: path
//  *         required: true
//  *       - in: body
//  *         name: bodyReq
//  *         description: product body
//  *         required: true
//  *         schema:
//  *            $ref: "#/definitions/product"
//  *     responses:
//  *       200:
//  *         description: Success
//  *     security:
//  *       - bearerAuth: []
//  */
router.put("/:id", async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Body is empty");
    }
    const updatedproduct = await update(req.params.id, req.body);
    logger.info("product edited");
    res.status(200).json(makeResponse(updatedproduct));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});
// /**
//  * @swagger
//  * /api/v1/products/add-item/{productId}?list:
//  *   put:
//  *     tags:
//  *       - products
//  *     description: Add item to product
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: productId
//  *         description: product id
//  *         in: path
//  *         required: true
//  *       - in: body
//  *         name: bodyReq
//  *         description: newItem
//  *         example: {
//  *                    "newId":""
//  *                  }
//  *         required: true
//  *       - in: query
//  *         name: list
//  *         description: query filter
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Success
//  *     security:
//  *       - bearerAuth: []
//  */

router.put("/add-item/:id", async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Body is empty");
    }

    const updatedproduct = await addItem(
      req.params.id,
      req.query.list,
      req.body.newId
    );
    res.json(makeResponse(updatedproduct));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});

router.delete("/", async (req, res, next) => {
  let id = req.body.id ? req.body.id : 0;
  const product = await remove(id);
  res.status(200).json(makeResponse(product));
});

router.get("/detail/:id", async (req, res, next) => {
  let id = req.params.id;
  const details = await getDetail(id);
  res.status(200).json(makeResponse(details));
});

router.put("/add-detail-item/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const update = await addDetail(id, req.body);
    res.status(200).json(makeResponse(update));
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.put("/update-detail-item/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const update = await updateDetailItem(id, req.body.id, req.body.inventory);
    res.status(200).json(makeResponse(update));
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.put("/update-price-detail/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    const update = await updatePriceDetail(id, req.body.id, req.body.price);
    res.status(200).json(makeResponse(update));
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.put("/amount-sold/:id", async (req, res, next) => {
  const id = req.params.id ? req.params.id : 0;
  console.log("body ne", req.body);
  if (!req.body.color || !req.body.size || !req.body.quantity) {
    throw new Error("Miss body!!");
  }
  const product = await UpdateAmountSold(
    id,
    req.body.color,
    req.body.size,
    req.body.quantity
  );
  console.log("product test",product)
  res.status(200).json(makeResponse(product));
});

router.delete("/image/:id", async (req, res, next) => {
  try {
    let id = req.params.id;
    let name = req.body.name;
    if (!id) throw new Error("miss name image");
    if (!name) throw new Error("miss name image");
    removeImgName(id, name);
    res.status(200).json(makeResponse([]));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});
// router.get("/search", async (req, res, next) => {
//   let id =  req.params.id;
//   const details = await getDetail(id);
//   res.status(200).json(makeResponse(details));
// });

module.exports = router;
