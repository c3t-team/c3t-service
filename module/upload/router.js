const express = require("express");
const router = new express.Router();
const logger = require("../logger");
const { handleError, makeResponse } = require("../common");
const sharp = require("sharp");

const { validateFilePath } = require("../common/fileHandler");
const { removeFile, updateAvatar, compressAndResize } = require("./handler");
const {
  tempPath,
  serverPath,
  pathAvatar,
  contributePath
} = require("../common/constant");
const { upload } = require("../common/upload");

/**
 * @swagger
 * /api/v1/uploads/images/single:
 *   post:
 *     tags:
 *       - Uploads
 *     description: Upload single image
 *     consumes:
 *       - "multipart/form-data"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "image"
 *         in: "formData"
 *         description: "file to upload"
 *         required: true
 *         type: "file"
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */

router.post("/images/single", upload(tempPath).single("image"), async function(
  req,
  res,
  next
) {
  try {
    const file = req.file;
    if (!file) throw new Error("Image is missing ");
    // await compressAndResize([serverPath + tempPath + file.filename])

    res.json(makeResponse(file.filename));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});

/**
 * @swagger
 * /api/v1/uploads/avatar:
 *   post:
 *     tags:
 *       - Users
 *     description: Upload avartar user
 *     consumes:
 *       - "multipart/form-data"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "image"
 *         in: "formData"
 *         description: "file to upload"
 *         required: true
 *         type: "file"
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post("/avatar", upload(pathAvatar).single("image"), async function(
  req,
  res,
  next
) {
  try {
    const file = req.file;
    if (!file) throw new Error("Image is missing ");
    // var dimensions = await sharp(file.path).metadata()
    // // if(dimensions.width>200  || dimensions.height>200){
    // //   removeFile(file.path)
    // //   res.json(makeResponse('Image too large'))
    // //   return
    // // }
    // if(!['jpg','png','jpeg','gif'].includes(dimensions.format)){
    //   removeFile(file.path)
    //   res.json(makeResponse('File type not supported!'))
    //   return
    // }
    // await updateAvatar(req.id,file.filename)
    res.json(makeResponse("Update avatar success"));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});

router.post("/images/avatar", upload(tempPath).single("image"), async function(
  req,
  res,
  next
) {
  try {
    const file = req.file;
    if (!file) throw new Error("Image is missing ");
    // await compressAndResize([serverPath + tempPath + file.filename])
    console.log("lla",req.id)
    console.log("llaqqq",file.filename)
    await updateAvatar("5dbede03a5592c2698f1992d", file.filename);
    res.json(makeResponse(file.filename));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});

/**
 * @swagger
 * /api/v1/uploads/images/single/{name}:
 *   delete:
 *     tags:
 *       - Uploads
 *     description: Delete single image in temp folder
 *     consumes:
 *       - "multipart/form-data"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: name
 *         in: path
 *         description: file to delete
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.delete("/images/single/:name", async function(req, res, next) {
  try {
    validateFilePath(serverPath + tempPath + req.params.name);
    removeFile(serverPath + tempPath + req.params.name);
    res.json(makeResponse(serverPath + tempPath + req.params.name));
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error);
    res.json(handleError(error));
  }
});
/**
 * @swagger
 * /api/v1/uploads/images/multiple:
 *   post:
 *     tags:
 *       - Uploads
 *     description: Upload multiple image, Swagger not support multiple upload files, use POSTMAN instead
 *     consumes:
 *       - "multipart/form-data"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "images"
 *         in: "formData"
 *         description: "file to upload"
 *         collectionFormat: multi
 *         required: true
 *         type: array
 *         items:
 *           type: "string"
 *           format: binary
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/images/multiple",
  upload(tempPath).array("images", 10),
  async function(req, res, next) {
    try {
      const files = req.files;
      if (files.length <= 0) throw new Error("Image is missing");
      res.json(makeResponse(files.map(e => e.filename)));
    } catch (error) {
      logger.info(`${req.originalUrl}: `, error);
      res.json(handleError(error));
    }
  }
);
/**
 * @swagger
 * /api/v1/uploads/images/contribute:
 *   post:
 *     tags:
 *       - Uploads
 *     description: Upload multiple image, Swagger not support multiple upload files, use POSTMAN instead
 *     consumes:
 *       - "multipart/form-data"
 *     produces:
 *       - "application/json"
 *     parameters:
 *       - name: "images"
 *         in: "formData"
 *         description: "file to upload"
 *         collectionFormat: multi
 *         required: true
 *         type: array
 *         items:
 *           type: "string"
 *           format: binary
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/images/contribute",
  upload(contributePath).array("images", 10),
  async function(req, res, next) {
    try {
      const files = req.files;
      if (files.length <= 0) throw new Error("Image is missing");
      res.json(makeResponse(files.map(e => e.filename)));
    } catch (error) {
      logger.info(`${req.originalUrl}: `, error);
      res.json(handleError(error));
    }
  }
);
module.exports = router;
