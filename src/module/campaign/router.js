const express = require('express')
const router = new express.Router()
const {create,findOne,findAll,update} = require('./handler')
const logger = require('../logger')
const {handleError, makeResponse} = require('../common')

/**
 * @swagger
 * /api/v1/campaigns:
 *   get:
 *     tags: 
 *       - Campaigns
 *     description: get campaigns with filter
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', async (req, res, next) => {
  try {
    const campaigns = await findAll()
    res.json(makeResponse(campaigns))
  }
  catch(error) {
    logger.info(`${req.originalUrl}: `, error)
    res.json(handleError(error))
  }
})
/**
 * @swagger
 * /api/v1/campaigns/{id}:
 *   get:
 *     tags: 
 *       - Campaigns
 *     description: get campaign by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: campaign name
 *         type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/:id', async (req, res, next) => {
  try {
    const campaign = await findOne(req.params.id)
    if(!campaign) throw new Error('Unable to find campaign id ' + req.params.id)
    res.json(makeResponse(campaign))
  }
  catch(error) {
    logger.info(`${req.originalUrl}: `, error)
    res.json(handleError(error))
  }
})
/**
 * @swagger
 * /api/v1/campaigns:
 *   post:
 *     tags: 
 *       - Campaigns
 *     description: Create a campaign
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: bodyReq
 *         description: campaign body
 *         required: true
 *         schema:
 *            $ref: "#/definitions/Campaign"
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post('/', async (req, res, next) => {
  try {
    const campaign = await create(req.body)
    logger.info('created campaign ', campaign._id)
    res.status(200).json(makeResponse(campaign))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})
  
/**
 * @swagger
 * /api/v1/campaigns/{campaignId}:
 *   put:
 *     tags: 
 *       - Campaigns
 *     description: update campaign's information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: campaignId
 *         description: campaign id
 *         in: path
 *         required: true
 *       - in: body
 *         name: bodyReq
 *         description: campaign body
 *         required: true
 *         schema:
 *            $ref: "#/definitions/campaign"
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', async (req, res, next) => {
  try {
    if(!req.body || Object.keys(req.body).length === 0) {
      throw new Error('Body is empty')
    }
    const updatedCampaign = await update(req.params.id, req.body)
    logger.info('campaign created')
    res.status(200).json(makeResponse(updatedCampaign))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})
/**
 * @swagger
 * /api/v1/campaigns/{campaignId}:
 *   delete:
 *     tags: 
 *       - Campaigns
 *     description: update campaign's information
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: campaignId
 *         description: campaign id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const updatedCampaign = await update(req.params.id, {
      deleted: true
    })
    logger.info('campaign created')
    res.status(200).json(makeResponse(updatedCampaign))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})
module.exports = router

