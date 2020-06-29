const multer  = require('multer')
const path = require('path')
const {serverPath} = require('../common/constant')
const slug = require('slug')
const maxSize = 10*1024*1024
slug.defaults.modes['rfc3986'] = {
  replacement: '-',      // replace spaces with replacement
  symbols: true,         // replace unicode symbols or not
  remove: null,          // (optional) regex to remove characters
  lower: true,           // result in lower case
  charmap: slug.charmap, // replace special characters
  multicharmap: slug.multicharmap // replace multi-characters
}
const returnStorage=(_path)=>{
  return multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, serverPath + _path)
    },
    filename: function (req, file, cb) {
      
      cb(null, slug(path.parse(file.originalname).name) + '-' + Date.now() + path.extname(file.originalname))
    }
  })
}

const fileFilter = function (req, file, callback) {
  const ext = path.extname(file.originalname).toLowerCase()
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return callback('File type not supported!', false, )
  }
  callback(null, true)
}
const   upload =_path=> multer({ storage: returnStorage(_path), limits: { fileSize: maxSize, files: 10 }, fileFilter: fileFilter })

module.exports = {upload}