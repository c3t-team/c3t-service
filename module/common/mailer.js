const nodemailer = require('nodemailer')
const logger = require('../logger')

const transporter = nodemailer.createTransport({
  service: 'gmail', // maybe change if use eva mail
  auth: {
    user: process.env.EVA_EMAIL,
    pass: process.env.EVA_MAIL_PASSWORD
  }
})

const wrapedSendMail = (mailOptions) => new Promise((resolve, reject) => {
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      return reject(error)
    }
    return resolve(info)
  }) 
})


const send = async (destinations, {subject, text, html}) => {
  const makeMailOptions = () => {
    const options = {
      from: process.env.EVA_EMAIL,
      to: destinations.join(','),
      subject: subject,
    }
    if(text) {
      options.text = text
    }
    if(html) {
      options.html = html
    }
    return options
  }

  try {
    await wrapedSendMail(makeMailOptions())
  } catch (error) {
    logger.error(`Unable to send password to ${destinations.join(',')}`, error)
    throw new Error(`Unable to send password to ${destinations.join(',')}`)
  }
}

module.exports = {send}
