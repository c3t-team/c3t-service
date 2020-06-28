const jwt = require('jsonwebtoken')
const { secret, expiresIn } = require('../config').tokenConfig

const makeAuthenResponse = (user) => {
  const role=user.role.length>0?user.role:['customer'] 
  const token = jwt.sign({
    email: user.email,
    id: user._id,
    role
  },
  secret, { expiresIn: expiresIn })
  const response = {
    email: user.email, 
    token: token,
    id:user._id,
    role
  }
  return response
}

module.exports = {makeAuthenResponse}