const express = require("express");
const router = new express.Router();
const {
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
} = require("./handler");
const logger = require("../logger");
const { handleError, makeResponse } = require("../common");
// const {MESSAGE} = require('../common/constant')

// /**
//  * @swagger
//  * /api/v1/brands:
//  *   get:
//  *     tags:
//  *       - Brands
//  *     description: get brands with filter
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: Success
//  */

router.get("/", async (req, res, next) => {
  try {
    const brands = await findAll();
    res.json(makeResponse(brands));
  } catch (error) {
    res.json(handleError(error));
    logger.info(`${req.originalUrl}: `, error);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const brands = await search(req.query.q);
    res.json(makeResponse(brands));
  } catch (error) {
    res.json(handleError(error));
    logger.info(`${req.originalUrl}: `, error);
  }
});

// /**
//  * @swagger
//  * /api/v1/brands/{name}?page&per_page:
//  *   get:
//  *     tags:
//  *       - Brands
//  *     description: get product by brand
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: path
//  *         name: name
//  *         description: brand name
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
//     const brand = await findOne(conditions, filter, page, perPage);
//     const mongoose = require("mongoose");
//     console.log(brand instanceof mongoose.Document);
//     if (!brand) throw new Error("Unable to find brand name " + req.params.name);
//     res.json(makeResponse(brand));
//   } catch (error) {
//     logger.info(`${req.originalUrl}: `, error);
//     res.json(handleError(error));
//   }
// });

router.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id ? req.params.id : 0;
    const brand = await findBrandById(id);
    res.status(200).json(makeResponse(brand));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});
router.get("/list-product/:id", async (req, res, next) => {
  const list = await getProductIds(req.params.id);
  res.status(200).json(makeResponse(list));
});

// /**
//  * @swagger
//  * /api/v1/brands:
//  *   post:
//  *     tags:
//  *       - Brands
//  *     description: Create a brand
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: body
//  *         name: bodyReq
//  *         description: brand body
//  *         required: true
//  *         schema:
//  *            $ref: "#/definitions/Brand"
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
      throw new Error(`Brand ${req.body.name} is already exist`);
    }
    const brand = await create(req.body);
    logger.info("created brand");
    res.status(200).json(makeResponse(brand));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});

// /**
//  * @swagger
//  * /api/v1/brands/{name}:
//  *   put:
//  *     tags:
//  *       - Brands
//  *     description: update brand's information
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: name
//  *         description: brand name
//  *         in: path
//  *         required: true
//  *       - in: body
//  *         name: bodyReq
//  *         description: brand body
//  *         required: true
//  *         schema:
//  *            $ref: "#/definitions/Brand"
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
    const id = req.params.id ? req.params.id : 0;
    const updatedBrand = await update(id, req.body);
    logger.info("Brand edited");
    res.status(200).json(makeResponse(updatedBrand));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});

// /**
//  * @swagger
//  * /api/v1/brands/add-item/{brandId}?list:
//  *   put:
//  *     tags:
//  *       - Brands
//  *     description: Add item to brand
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: brandId
//  *         description: brand id
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

router.put("/add-product/:id", async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Body is empty");
    }

    console.log(req.params.id, req.body.addProductId);

    const updatedBrand = await addProductId(
      req.params.id,
      req.body.addProductId
    );
    res.json(makeResponse(updatedBrand));
  } catch (error) {
    console.log("errr", error);
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});

router.put("/remove-product/:id", async (req, res, next) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Body is empty");
    }
    const updatedBrand = await removeProductId(
      req.params.id,
      req.body.removeProductId
    );
    res.json(makeResponse(updatedBrand));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});

router.get("/brand-names", async (req, res, next) => {
  try {
    const brandnames = getNameBrand();
    res.status(200).json(brandnames);
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.get("/productIds", async (req, res, next) => {
  try {
    if (!req.id || Object.keys(req.body).length === 0)
      throw new Error("body is empty");
    const productIds = getProductIds(req.id);
    res.status(200).json(productIds);
  } catch (err) {
    logger.info(`${req.originalUrl}: `, err);
    res.json(handleError(err));
  }
});

router.delete("/:id", async (req, res, next) => {
  if (req.params.id) {
    let result = await remove(req.params.id);
    res.status(200).json(makeResponse(result));
  }
});
module.exports = router;
