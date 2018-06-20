const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const User = require('../../models/user')
const credentials = require('../../utils/credentials')

function setToken(phone, ctx) {
  const token = jwt.sign({
    phone
  }, credentials.cookieSecret, {expiresIn: '7d'})
  ctx
    .cookies
    .set('_li', token, {
      signed: true,
      maxAge: 60 * 60 * 24 * 7,
      httpOnly: true
    })
  return token
}

class UserController {
  static async login(ctx, next) {
    ctx.body = {
      data: 'login'
    }
  }

  static async createAccount(ctx, next) {
    // console.log(process.env)
    console.log('创建用户')
    const {phone, password} = ctx.request.body
    // const user = await User.findOne({ phone }).exec() if (user) { } if (!phone ||
    // !password) { }
    const token = setToken(phone, ctx)
    const bt = User.encryptPassword(password)
    const user = await User.create({phone, password: bt, token})
    ctx.body = {
      data: pick(user.toObject(), ['phone', 'auth', 'created']),
      msg: '创建用户成功'
    }
  }
}

module.exports = UserController