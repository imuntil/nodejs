const passport = require('koa-passport')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')
const fs = require('fs');
const os = require('os');
const path = require('path');

class UserController {
  // 获取用户信息
  static async getUser (ctx, next) {
    const { ip } = ctx.params
    if (!ip) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    // id or phone
    const isId = /^[0-9a-fA-F]{24}$/.test(ip)
    const q = isId ? User.findById(ip) : User.findOne({ phone: ip })
    const user = await q.select('-__v').exec()
    ctx.body = { data: { user } }
  }

  // 获取验证码
  static async getCode (ctx, next) {
    const code = Math.floor(Math.random() * 1000000)
    ctx.session.code = code
    ctx.body = { data: { code } }
  }


  // 用户注册
  static async register (ctx, next) {
	  const { nick, phone, password } = ctx.request.body
    if (!nick || !phone || !password) {
	    throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    const user = await User.create({ nick, phone, password }).select('_id phone nick')
	  console.log(user)
	  ctx.body = { data: { nick, phone } }
  }

  // 用户登录
  static async login (ctx, next) {
    const { phone, password } = ctx.request.body
    if (!password || !phone) {
      throw new ApiError(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD)
    }
    return passport.authenticate('local.login', (err, user, info, status) => {
      const { msg } = info
      if (!user) {
        throw new ApiError(msg)
      }
    })(ctx)
  }

  // 修改密码
  static async modifyPassword (ctx, next) {
    const { phone, id, pn, po } = ctx.request.body
    if (!pn || !po || (!phone && !id)) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
  }

  // 修改昵称
  static async modifyNick (ctx, next) {
	  const { phone, id, nick } = ctx.request.body
	  if (!nick || (!phone && !id)) {
		  throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
	  }
	  let user, data
	  if (id) {
	  	user = await User.findByIdAndUpdate(id, { $set: { nick } }).select('-__v').exec()
	  } else {
	  	user = await User.findOneAndUpdate({ phone }, { $set: { nick } }).select('-__v').exec()
	  }
	  if (!user) {
	    throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
	  ctx.body = {
		  data: { user }
	  }
  }

  // 修改头像
  static async modifyAvatar (ctx, next) {

  }

  // 上传头像
  static async uploadAvatar (ctx, next) {
    if ('POST' !== ctx.method) return await next()
    console.log(ctx.request.body)
    const file = ctx.request.body.files.avatar
    const reader = fs.createReadStream(file.path);
    const p = '../../public/upload/' + Date.now() + '.png'
    const stream = fs.createWriteStream(path.resolve(__dirname, p));
    reader.pipe(stream);
    const base = '/upload/' + path.parse(stream.path).base
    ctx.body = {
      data: {
        path: base
      }
    }
  }
}

module.exports = UserController