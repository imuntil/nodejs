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
  // ctx   .cookies   .set('_li', token, {     signed: true,     maxAge: 60 * 60 *
  // 24 * 7,     httpOnly: true   })
  return token
}

class UserController {
  static async login(ctx, next) {
    console.log('用户登录')
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
      data: {
        ...pick(user.toObject(), ['auth', 'created', 'nick', 'email']),
        token: user.token
      }
    }
  }

  /**
   * 添加账号 pm>=lv5
   * POST
   * /shizuku/user/create
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
    const itCode = user && user.invitationCode
    const newCode = UserController.getItCode()

    if (!user) {
      /* 用户不存在 */
      try {
        await Promise.all([
          User.create({email, invitationCode: newCode}),
          sendMail(email, newCode.value)
        ])
        ctx.body = {
          message: '创建账号成功'
        }
      } catch (e) {
        console.log(e)
        throw e
      }
    } else if (user && user.password) {
      /* 用户已注册 */
      ctx.body = {
        code: 0,
        message: '用户已存在'
      }
    } else if (!itCode.value || Date.now() >= itCode.expired) {
      /* code 过期，重发 */
      user.invitationCode = newCode
      await Promise.all([
        user.save(),
        sendMail(email, newCode.value)
      ])

      ctx.body = {
        message: '已重新发送邀请码'
      }
    } else {
      /* 账号之前已经创建 */
      ctx.body = {
        message: '账号已经创建'
      }
    }
  }

  static getItCode() {
    return {
      value: `${Math.random()}`
        .split('.')[1]
        .slice(0, 6),
      expired: Date.now() + 1000 * 60 * 60 * 24 * 2
    }
  }

  /**
   * 注册
   * PUT
   * /shizuku/user/register
   * body = {email, code, password, nick}
   * @param {*} ctx
   * @param {*} next
   */
  static async register(ctx, next) {
    console.log('注册')
    const {
      email,
      code,
      password,
      nick = ''
    } = ctx.request.body
    if (!email || !code || !password) {
      throw new ApiError(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS)
    }
    const account = await User.findOne({email})
    const itCode = account && account.invitationCode
    if (!account) {
      /* 没有账号，无权注册 */
      throw new ApiError(ApiErrorNames.THE_EMAIL_CANT_REG)
    } else if (account.password) {
      /* 有账号，且密码不为空，已被注册 */
      throw new ApiError(ApiErrorNames.EMAIL_IS_EXIST)
    } else if (!itCode.value || itCode.expired < Date.now()) {
      /* 邀请码已过期 */
      ctx.body = {
        code: 0,
        message: '邀请码已过期'
      }
    } else if (+ itCode.value !== + code) {
      ctx.body = {
        code: 0,
        message: '邀请码错误'
      }
    } else {
      /* 有账号，且密码为空，可以注册 */
      // const token = setToken(email, ctx)
      const bt = User.encryptPassword(password)
      // account.token = token
      account.password = bt
      account.nick = nick
      account.invitationCode = null
      await account.save()
      ctx.body = {}
    }
  }

  static async test(ctx) {
    ctx.body = {
      message: 'test api'
    }
  }
}

module.exports = UserController