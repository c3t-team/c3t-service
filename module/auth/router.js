const express = require('express')
const router = new express.Router()
const { findOne, create, addFriends,updateUser } = require('../user')
const { handleError, makeResponse } = require('../common')
const { match } = require('../crypto')
const {makeAuthenResponse} = require('./handler')
const axios = require('axios')
const logger = require('../logger')

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags: 
 *       - Authorize
 *     description: Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: bodyReq
 *         description: login body
 *         required: true
 *         example: {
 *                     "email": "dung@gmail.com",
 *                     "password": "123"
 *                   }
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post('/login', async (req, res, next) => {
  const validateReqBody = (body) => {
    if (!body) {
      throw new Error('Missing body')
    }
    if (!body.email) {
      throw new Error('Missing \'email\'')
    }
    if (!body.password) {
      throw new Error('Missing \'password\'')
    }
  }

  try {
    validateReqBody(req.body)
    const user = await findOne({ email: req.body.email })
    if(!user) {
      throw new Error(`Unable to find user with email ${req.body.email}`)
    }
    if (!match(req.body.password, user.password)) {
      throw new Error('Password is invalid')
    }
    const response = makeAuthenResponse(user)
    res.status(200).json(makeResponse(response))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})

/**
 * @swagger
 * /api/v1/auth/facebook:
 *   post:
 *     tags: 
 *       - Authorize
 *     description: Login
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: bodyReq
 *         description: login body
 *         required: true
 *         example: {
 *                     "access_token": "a token that client received from facebook"
 *                   }
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post('/facebook', async (req, res, next) => {
  const validteReqBody = (body) => {
    if (!body.access_token) {
      throw new Error(`'access_token' is required`)
    }
  }
  
  const getFacebookUserFromToken = async (token) => {
    try {
      const {data} = await axios.get(`https://graph.facebook.com/me?fields=name,email,picture&access_token=${token}`)
      return data
    } catch (error) {
      logger.error(`Error when get facebook user by token`, error)
      throw new Error(`access token is invalid`)
    }
  }

  const createUserIfNotExist = async (facebookUser) => {
    try {
      let user = await findOne({ email: facebookUser.email })
      if(user) {
        if(user.avatar===null || user.avatar.length===0){
          user =  await updateUser({avatar:facebookUser.picture.data.url},user._id) 
         
        }
        return user
      }
      const data = {}
      data.email = facebookUser.email
      data.facebookId = facebookUser.id
      data.firstName = facebookUser.name.split(' ')[0]
      data.lastName = facebookUser.name.split(' ')[1]
      data.avatar = facebookUser.picture.data.url
      return await create(data)
    } catch (error) {
      logger.error(`Error when create eva facebook user`, error)
      throw new Error(`Unable to add facebook user ${facebookUser.id}`)
    }
  }

  const validateRefCode = async (refCode) => {
    try {
      const user = await findOne({ refCode: refCode })
      if (!user) {
        throw new Error()
      }
    } catch (error) {
      logger.error(`Error when validate refcode ${refCode}`, error)
      throw new Error(`Unable to find user with ref code ${refCode}`)
    }
  }

  try {
    validteReqBody(req.body)
    if(req.query.refCode) {
      await validateRefCode(req.query.refCode)
    }
    const facebookUser = await getFacebookUserFromToken(req.body.access_token)
  
    if(!facebookUser.email) {
      throw new Error(`your facebook account doesn't have email address`)
    }

    const user = await createUserIfNotExist(facebookUser)
    
    if(req.query.refCode) {
      addFriends(req.query.refCode, user.id)
    }
    const response = makeAuthenResponse(user)
    res.status(200).json(makeResponse(response))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})
/**
 * @swagger
 * /api/v1/auth/google:
 *   post:
 *     tags: 
 *       - Authorize
 *     description: google
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: bodyReq
 *         description: login body
 *         required: true
 *         example: {
 *                     "tokenId": "a token that client received from google"
 *                   }
 *     responses:
 *       200:
 *         description: Success
 *     security:
 *       - bearerAuth: []
 */
router.post('/google', async (req, res, next) => {
  const validteReqBody = (body) => {
    if (!body.tokenId) {
      throw new Error(`'tokenId' is required`)
    }
  }
  
  const getGoogleUserFromToken = async (token) => {
    try {
      const {data} = await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${token}`)
      return data
    } catch (error) {
      logger.error(`Error when get google user by token`, error)
      throw new Error(`access token is invalid`)
    }
  }

  const createUserIfNotExist = async (googleUser) => {
    try {
      let user = await findOne({ email: googleUser.email })
      if(user) {
        if(user.avatar===null ||( user.avatar&&user.avatar.length===0)){
          user =  await updateUser({avatar:googleUser.picture},user._id) 
        }
        return user
      }
      const data = {}
      data.email = googleUser.email
      data.googleId = googleUser.id
      data.firstName = googleUser.given_name
      data.lastName = googleUser.family_name
      data.avatar = googleUser.picture
      return await create(data)
    } catch (error) {
      logger.error(`Error when create eva google user`, error)
      throw new Error(`Unable to add google user ${googleUser.id}`)
    }
  }

  const validateRefCode = async (refCode) => {
    try {
      const user = await findOne({ refCode: refCode })
      if (!user) {
        throw new Error()
      }
    } catch (error) {
      logger.error(`Error when validate refcode ${refCode}`, error)
      throw new Error(`Unable to find user with ref code ${refCode}`)
    }
  }

  try {
    validteReqBody(req.body)
    if(req.query.refCode) {
      await validateRefCode(req.query.refCode)
    }
    const googleUser = await getGoogleUserFromToken(req.body.tokenId)
    if(!googleUser.email) {
      throw new Error(`your google account doesn't have email address`)
    }
    const user = await createUserIfNotExist(googleUser)
    if(req.query.refCode) {
      addFriends(req.query.refCode, user.id)
    }
    const response = makeAuthenResponse(user)
    res.status(200).json(makeResponse(response))
  } catch (error) {
    logger.info(`${req.originalUrl}: `, error)
    res.status(200).json(handleError(error))
  }
})
module.exports = router