const Admin = require('../../models/admin')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const jwt = require('jsonwebtoken')
const credentials = require('../../lib/credentials')

function setToken (ctx, account) {
  const token = jwt.sign({ account }, credentials.sysCookieSecret, {
    expiresIn: '7d'
  })
  ctx.cookies.set('_st', token, {
    signed: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  })
  return token
}
class AdminController {
	/**
   * POST
   * 管理员登录
   * body = { account, password }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async login (ctx, next) {
    console.log('sys 登录')
    const { account, password } = ctx.request.body
    if (!account || !password) throw new ApiError(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD)
    const admin = await Admin.findOne({ account }).exec()
    if (!admin || !admin.validPassword(password)) {
      throw new ApiError(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD)
    }
    admin.token = setToken(ctx, account)
    await admin.save()
    ctx.body = {
      message: '登录成功'
    }
  }
  static async register (ctx, next) {
    const user = await Admin.findOne({ account: 'admin' }).exec()
    if (!user) {
      const token = setToken(ctx, 'admin')
      await Admin.create({ account: 'admin', password: Admin.encryptPassword('k0kEwcW@'), token })
    }
  }
  static async logout (ctx, next) {
		console.log('登出')
    ctx.cookies.set('_st', '', {
      signed: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true
    })
    ctx.body = {
		  message: '已退出登录'
    }
	}
}
module.exports = AdminController