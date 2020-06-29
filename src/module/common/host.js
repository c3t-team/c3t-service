const dotenv = require('dotenv')

dotenv.config()
let host = ''
if(process.env.NODE_ENV === 'production') {
  host = process.env.HOST
}
else {
  host = process.env.HOST + ':' + process.env.PORT
}

module.exports = host