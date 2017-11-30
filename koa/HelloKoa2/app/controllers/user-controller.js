const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')
const Cart = require('../../models/cart')
const fs = require('fs');
const os = require('os');
const path = require('path');
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const credentials = require('../../lib/credentials')
const regs = require('../../lib/common').regs

const max = 200
function setToken(phone, ctx) {
	const token = jwt.sign({ phone }, credentials.cookieSecret, {
		expiresIn: '7d'
	})
	ctx.cookies.set('_token', token, {
		signed: true,
		maxAge: 1000 * 60 * 60 * 24 * 7,
		httpOnly: true
	})
	return token
}
// 创建购物车
createCart = async function (_owner) {
	const date = new Date()
	const cart = new Cart({ _owner, date })
	await cart.save()
	return true
}
class UserController {
  // 获取用户信息
  static async getUser (ctx, next) {
		const { ip } = ctx.params
	  console.log('ip', ctx.params)
	  if (!ip) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    // id or phone
    const { phone ,objectId } = regs
    const isId = objectId.reg.test(ip)
    const isPhone = phone.reg.test(ip)
		if (!isId && !isPhone) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
		const q = isId ? User.findById(ip) : User.findOne({ phone: ip })
    const user = await q.select('nick phone _id').exec()
		// const token = ctx.cookies.get('_token', { signed: true })
		// const user = await User.findOne({ token }).select('nick phone _id').exec()
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
	  console.log('register')
	  const { nick, phone, password } = ctx.request.body
	  if (!nick || !phone || !password) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
	  const user = await User.findOne({ phone }).exec()
    if (user) {
      throw new ApiError(ApiErrorNames.THE_PHONE_WAS_REGISTERED)
    }
		const token = setToken(phone, ctx)
		const created = new Date()
		const bt = User.encryptPassword(password)
		const _new = await User.create({ nick, phone, password: bt, created, token })
	  await createCart(_new._id)
    ctx.body = { data: { nick, phone, uid: _new._id } }
  }

  // 用户登录
  static async login (ctx, next) {
    const { phone, password } = ctx.request.body
    if (!password || !phone) {
      throw new ApiError(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD)
    }
    const user = await User.findOne({ phone }).exec()
		if (!user || !user.validPassword(password)) {
      throw new ApiError(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD)
    }
    const token = setToken(phone, ctx)
	  user.token = token
	  await user.save()
    ctx.body = {
      data: { user: _.pick(user, ['nick', 'phone', '_id']) }
    }
	}

	// 退出登录
  static async logout (ctx, next) {
    // x
    ctx.cookies.set('_token', '', {
			signed: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true
    })
  }

	/**
	 * 修改密码
	 * phone || uid, password
	 * @param ctx
	 * @param next
	 * @return {Promise.<boolean>}
	 */
  static async modifyPassword (ctx, next) {
    const { phone, uid, password } = ctx.request.body
    if (!password || (!phone && !uid)) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    if (!regs.password.reg.test(password)) {
      ctx.body = {
        code: '1042',
        message: '密码格式有误'
      }
      return false
    }
    const bt = User.encryptPassword(password)
    let q
    if (phone) {
      q = User.findOneAndUpdate({ phone }, { password: bt })
    } else {
      q = User.findByIdAndUpdate(uid, { password: bt })
    }
    const user = await q.exec()
		if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
	}

	/**
	 * 修改昵称
	 * phone || uid, nick
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
  static async modifyNick (ctx, next) {
    const { phone, uid, nick } = ctx.request.body
    if (!nick || (!phone && !uid)) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    let q
    if (uid) {
      q = User.findByIdAndUpdate(uid, { $set: { nick } })
    } else {
      q = User.findOneAndUpdate({ phone }, { $set: { nick } })
    }
    const user = await q.select('nick phone _id').lean().exec()
    if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    ctx.body = {
      data: { ...user, nick }
    }
  }

	/**
	 * 修改头像
	 * phone || uid, imgStr(base64)
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
  static async modifyAvatar (ctx, next) {
    const { phone, uid, imgStr } = ctx.request.body
    if (!phone && !uid) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const q = uid ? User.findById(uid) : User.findOne({ phone })
    const user = await q.exec()
    if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    const base64 = imgStr.replace(/^data:image\/\w+;base64,/, '')
    const buffer = Buffer.from(base64, 'base64')
		const p = path.resolve(__dirname, '../../public/upload/' + user.phone + '.png')
    const res = await fs.writeFileSync(p, buffer)
		if (res) {
			ctx.body = {
			  code: '1061',
        message: '图片上传失败'
      }
		}
		user.avatar = '/upload/' + user.phone + '.png'
    await user.save()
	}

  // 上传头像
  // static async uploadAvatar (ctx, next) {
  //   if ('POST' !== ctx.method) return await next()
  //   console.log(ctx.request.body)
  //   const file = ctx.request.body.files.avatar
  //   const reader = fs.createReadStream(file.path);
  //   const p = '../../public/upload/' + Date.now() + '.png'
  //   const stream = fs.createWriteStream(path.resolve(__dirname, p));
  //   reader.pipe(stream)
  //   const base = '/upload/' + path.parse(stream.path).base
  //   ctx.body = {
  //     data: {
  //       path: base
  //     }
  //   }
  // }
  // crm system
  // 获取所有用户，需要分页
  static async getUserList (ctx, next) {
    console.log('获取用户列表')
    const { size = 20, page = 1 } = ctx.query
    const count = await User.count()
    const q = count <= max
      ? User.find()
      : User.find().skip((page - 1) * size).limit(page)
    const users = await q
      .sort('-created')
      .select('phone created nick avatar openID cart _id')
      .lean()
      .exec()
    ctx.body = {
      data: {
        users,
        count,
        total: count <= max ? 1 : (count % size + 1),
        current: page
      }
    }
  }
}


module.exports = UserController