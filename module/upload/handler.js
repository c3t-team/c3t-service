const sharp = require('sharp')
const path = require('path')
const fs = require('fs')
const User= require('../user/model')
const mongoose = require("mongoose");

const {ogPath, path200, serverPath} = require('../common/constant')
const compressAndResize = async (imageUrl,size = 200) => {
  for(let i = 0; i < imageUrl.length; i++) {
    const dimensions = await sharp(imageUrl[i]).metadata()
    const resizeSize = Math.max(dimensions.width, dimensions.height)
    console.log(resizeSize,serverPath + ogPath + path.basename(imageUrl[i]))
    await sharp(imageUrl[i]).flatten(true).resize(resizeSize, resizeSize, {
      fit: 'contain',
      background: {r: 255, g: 255, b: 255, alpha: 1}
    }).jpeg().toFile(serverPath + ogPath + path.basename(imageUrl[i]))

    await sharp(imageUrl[i]).flatten(true).resize(size, size, {
      fit: 'contain',
      background: {r: 255, g: 255, b: 255, alpha: 1}
    }).jpeg().toFile(serverPath + path200 + path.basename(imageUrl[i]))
  }

}
const removeFile = (path) => {
  if(fs.existsSync(path))
    fs.unlinkSync(path, (error) => {
      if (error) throw error
    })
}

const updateAvatar = async (id,avatar)=>{
  const user = await User.findById(mongoose.Types.ObjectId(id))
  if(!user){
    throw new Error('Not found User')
  }
  return await User.findByIdAndUpdate(user._id, {'$set': {avatar: avatar}}, {new: true})
}
module.exports = {compressAndResize, removeFile,updateAvatar}