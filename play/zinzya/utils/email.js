const nodemailer = require('nodemailer')
const fs = require('fs')

const transporter = nodemailer.createTransport({
  host: 'smtp.exmail.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: 'zhin@imuntil.com',
    pass: 'eVcybJ4QzvjxjzGv'
  }
})

const sendMail = async(to, code) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: 'zhin@imuntil.com',
      to,
      subject: 'nakuna邀请码',
      html: `<h2 style="color: #ff0000;">${code}</h2>`
    }, (err, info) => {
      if (err) {
        reject(err)
        return
      }
      resolve(true)
    })
  })
}

module.exports = sendMail