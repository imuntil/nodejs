const jwt = require('jsonwebtoken')
const pick = require('lodash.pick')
const User = require('../../models/user')
const credentials = require('../../utils/credentials')
const {ApiError, ApiErrorNames} = require('../error/ApiError')
const pm = require('../../utils/permission')
const {ct, sendMail} = require('../../utils')

function setToken(email, ctx) {
  const token = jwt.sign({
    email
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
    const {email, password} = ctx.request.body
    if (!email || !password) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const user = await User
      .findOne({email})
      .exec()
    if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    const res = await user.validPassword(password)
    if (!res) {
      throw new ApiError(ApiErrorNames.WRONG_ACCOUNT_OR_PWD)
    }
    user.token = setToken(email, ctx)
    await user.save()
    ctx.body = {
      data: pick(user.toObject(), ['auth', 'created', 'nick', 'email'])
    }
  }

  /**
   * 添加账号 pm>=lv5
   * POST
   * /api/user/create
   * body = {email}
   * @param {ctx} ctx
   * @param {func} next
   */
  static async createAccount(ctx, next) {
    const {email} = ctx.request.body
    if (!email) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const who = await ct.getCurrentUser(ctx)
    if (!who || who.auth < pm.LV5) {
      throw new ApiError(ApiErrorNames.PERMISSION_DENIED)
    }
    const user = await User.findOne({email})
    /* 用户或者账号已经存在 */
    if (user && user.password) {
      ctx.body = {
        code: 1039,
        message: '用户已存在'
      }
      return
    }
    try {
      const code = Math.trunc(Math.random() * 100000)
      await Promise.all([
        User.create({
          email,
          invationCode: {
            value: `${code}`,
            expired: Date.now() + 1000 * 60 * 60 * 24 * 2
          }
        }),
        sendMail(email, code)
      ])
      ctx.body = {
        message: '创建账号成功'
      }
    } catch (e) {
      console.log(e)
      throw e
    }
  }

  /**
   * 注册
   * PUT
   * /api/user/register
   * body = {email, code, password, nick}
   * @param {*} ctx
   * @param {*} next
   */
  static async register(ctx, next) {
    console.log('注册')
    const {email, code, password, nick} = ctx.request.body
    if (!email || !code || !password || !nick) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const account = await User.findOne({email})
    if (!account) {
      /* 没有账号，无权注册 */
      throw new ApiError(ApiErrorNames.THE_EMAIL_CANT_REG)
    } else if (account && account.password) {
      /* 有账号，且密码不为空，已被注册 */
      throw new ApiError(ApiErrorNames.EMAIL_IS_EXIST)
    }
    /* 有账号，且密码为空，可以注册 */
    const token = setToken(email, ctx)
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