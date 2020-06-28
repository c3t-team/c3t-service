const express = require('express')
const router = new express.Router()
const Coupon = require('./model')
const {handleError, makeResponse} = require('../common')
const couponMaker = require('coupon-code')
const logger = require('../logger')
/**
 * @swagger
 * /api/v1/coupons:
 *   post:
 *     tags: 
 *       - Coupons
 *     description: create coupons
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: bodyReq
 *         description: coupons body
 *         required: true
 *         example: {
 *                     "percent": 10,
 *                     "timeInHours": 3
 *                   }
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post('/', async (req, res, next) => {
  const validateReqBody = (body) => {
    if(!body.percent) {
      throw new Error(`'percent' is required`)
    }
    if(!body.timeInHours) {
      throw new Error(`'timeInHours' is required`)
    }
  }

  const insertCoupon = async (data) => {
    try {
      const coupon = new Coupon({
        code: couponMaker.generate(),
        percent: data.percent,
        expireAt: new Date(Date.now() + data.timeInHours * 60 * 60 * 1000)
      })
      return await coupon.save()
    } catch (error) {
      if(error.name === 'MongoError' && error.code === 11000) {
        return await insertCoupon(data)
      }
      throw new Error(`Error when making new coupon`)
    }
  }
  
  try {
    validateReqBody(req.body)
    const savedCoupon = await insertCoupon(req.body)
    res.status(200).json(makeResponse(savedCoupon))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})

/**
 * @swagger
 * /api/v1/coupons/:code:
 *   get:
 *     tags: 
 *       - Coupons
 *     description: get users with filter
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: code
 *         in: path
 *         description: coupons code to get.
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.get('/:code', async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({code: req.params.code})
    if(!coupon) {
      throw new Error()
    }
    res.status(200).json(makeResponse(coupon))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(`Coupon is invalid`))
  }
})

module.exports = router