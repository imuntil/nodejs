const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const User = require('../../models/user')
const credentials = require('../../utils/credentials')
const {ApiError, ApiErrorNames} = require('../error/ApiError')
const pm = require('../../utils/permission')
const {getCurrentUser} = require('../../utils/ct')

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
    const {phone, password} = ctx.request.body
    if (!phone || !password) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const user = await User
      .findOne({phone})
      .exec()
    if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    const res = await user.validPassword(password)
    if (!res) {
      throw new ApiError(ApiErrorNames.WRONG_PHONE_OR_PWD)
    }
    user.token = setToken(phone, ctx)
    await user.save()
    ctx.body = {
      data: pick(user.toObject(), ['phone', 'auth', 'created', 'nick'])
    }
  }

  /**
   * 添加账号 pm>=lv5
   * POST
   * @param {ctx} ctx
   * @param {func} next
   */
  static async createAccount(ctx, next) {
    const {phone} = ctx.request.body
    if (!phone) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const who = await getCurrentUser(ctx)
    if (!who || who.auth < pm.LV5) {
      throw new ApiError(ApiErrorNames.PERMISSION_DENIED)
    }
    const user = await User.findOne({phone})
    /* 用户或者账号已经存在 */
    if (user) {
      ctx.body = {
        code: 1039,
        message: user.password
          ? '用户已存在'
          : '账号已存在'
      }
      return
    }
    await User.create({phone})
    ctx.body = {
      message: '创建账号成功'
    }
  }

  static async register(ctx, next) {
    console.log('注册')
    const {phone, password, nick} = ctx.request.body
    if (!phone || !password || !nick) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const account = await User.findOne({phone})
    if (!account) {
      /* 没有账号，无权注册 */
      throw new ApiError(ApiErrorNames.THE_PHONE_CANT_REG)
    } else if (account && account.password) {
      /* 有账号，且密码不为空，已被注册 */
      throw new ApiError(ApiErrorNames.PHONE_IS_EXIST)
    }
    /* 有账号，且密码为空，可以注册 */
    const token = setToken(phone, ctx)
    const bt = User.encryptPassword(password)
    account.token = token
    account.password = bt
    account.nick = nick
    await account.save()
  }

  static async test(ctx) {
    console.log('test')
  }
}

module.exports = UserController