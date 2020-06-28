const CryptoJS = require('crypto-js')
const {privatekey} = require('../config')
const crypto = require('crypto')

const encrypt = (plaintext) => CryptoJS.AES.encrypt(plaintext, privatekey).toString()

const decrypt = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, privatekey)
  return bytes.toString(CryptoJS.enc.Utf8)
}

const match = (password, ciphertext) => decrypt(ciphertext) === password

const generateToken = () => crypto.randomBytes(16).toString('hex')

module.exports = {match, encrypt, generateToken}
