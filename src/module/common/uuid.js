const uuid = require('uuid/v5')
const namespace = 'ce28a280-fdf4-4a1a-8d43-3848fef83b1b'

const generateUuid = (info) => {
  return uuid(info, namespace)
}

module.exports = {generateUuid}