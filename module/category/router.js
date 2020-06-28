const express = require("express");
const router = new express.Router();
const {
  create,
  getCategorys,
  getCategoryById,
  update,
  deleteCategory,
  getCategoryByGroup,
  getnameCategoryParentAndSub
} = require("./handler");
const { handleError, makeResponse } = require("../common");
const logger = require("../logger");

// /**
//  * @swagger
//  * /api/v1/categories:
//  *   post:
//  *     tags:
//  *       - Categories
//  *     description: Create a category
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: body
//  *         name: bodyReq
//  *         description: category body
//  *         required: true
//  *         schema:
//  *            $ref: "#/definitions/Category"
//  *     responses:
//  *       200:
//  *         description: Success
//  *     security:
//  *       - bearerAuth: []
//  */

router.post("/", async (req, res, next) => {
  const validateReqBody = body => {
    if (!body.name) {
      throw new Error(`'name' is require`);
    }
  };

  // validate existing category

  try {
    validateReqBody(req.body);
    const createdCategory = await create(req.body);
    res.status(200).json(makeResponse(createdCategory));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.status(200).json(handleError(error));
  }
});

// /**
//  * @swagger
//  * /api/v1/categories:
//  *   get:
//  *     tags:
//  *       - Categories
//  *     description: get categories with filter
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - name: type
//  *         in: query
//  *     responses:
//  *       200:
//  *         description: Success
//  */
// router.get("/", async (req, res, next) => {
//   try {
//     const categories = await list(req.query.type);
//     res.status(200).json(makeResponse(categories));
//   } catch (error) {
//     logger.error(`Unable to get categories`, error);
//     res.status(200).json(handleError(error));
//   }
// });

// /**
//  * @swagger
//  * /api/v1/categories:
//  *   get:
//  *     tags:
//  *       - Categories
//  *     description: get all categories
//  *     produces:
//  *       - application/json
//  *     responses:
//  *       200:
//  *         description: Success
//  */
router.get("/", async (req, res, next) => {
  try {
    const categories = await getCategorys();
    res.status(200).json(makeResponse(categories));
  } catch (err) {
    logger.error(`Unable to get all categories`, err);
    res.status(200).json(handleError(err));
  }
});

router.get("/group", async (req, res, next) => {
  let categories = await getCategoryByGroup();
  res.status(200).json(makeResponse(categories));
});
// /**
//  * @swagger
//  * /api/v1/categories/{categoryId}:
//  *   get:
//  *     tags:
//  *       - Categories
//  *     description: get category by id
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: path
//  *         name: categoryId
//  *         description: category id to get.
//  *         required: true
//  *         type: string
//  *     responses:
//  *       200:
//  *         description: Success
//  */
router.get("/:id", async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json(makeResponse(category));
  } catch (error) {
    logger.error(`Error when getting category id ${req.params.id}`, error);
    res.status(200).json(handleError(error));
  }
});

// /**
//  * @swagger
//  * /api/v1/categories:
//  *   post:
//  *     tags:
//  *       - Categories
//  *     description: update a category
//  *     produces:
//  *       - application/json
//  *     parameters:
//  *       - in: body
//  *         name: bodyReq
//  *         description: category body
//  *         required: true
//  *         schema:
//  *            $ref: "#/definitions/Category"
//  *     responses:
//  *       200:
//  *         description: Success
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/', async (req,res,next)=>{
//   update(req.id , res.name);

// })

router.get("/name-parent-sub/:id", async (req, res, next) => {
  console.log("mane-parent-sub",req.params.id )
  let id = req.params.id ;
  logger.info("huhu"+ id,"aaa");
  let restlt = await getnameCategoryParentAndSub(id);
  res.status(200).json(makeResponse(restlt));
});

router.put("/:id", async (req, res, next) => {
  console.log("1111", req.params.id);

  const validate = body => {
    if (!body) {
      throw new Error("Miss data");
    }
    if (!body.name) {
      throw new Error("name is require");
    }
  };
  try {
    validate(req.body);
    const category = update(req.params.id, req.body);
    res.status(200).json(makeResponse(category));
  } catch (err) {
    res.json(handleError(err));
  }
});

router.delete("/", async (req, res, next) => {
  let category = deleteCategory(req.body.id);
  return res.status(200).json(makeResponse(category));
});

module.exports = router;
