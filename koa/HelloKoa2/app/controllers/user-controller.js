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
// uid是否合法
function validUID(uid) {
	if (!regs.objectId.reg.test(uid)) throw new ApiError(ApiErrorNames.WRONG_ID)
}
// 验证码过期时间1min
const timeout = 1000 * 60
class UserController {
	/**
	 * GET
	 * /api/users/:ip
	 * 获取用户信息
	 * params = { ip (phone, uid)}
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async getUser (ctx, next) {
    console.log('获取用户信息')
    const { ip } = ctx.params
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

	/**
	 * GET
	 * 获取验证码
	 * /api/users/code
	 * 获取验证码
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async getCode (ctx, next) {
    console.log('获取验证码')
    const code = Math.floor(Math.random() * 1000000)
		// if (!ctx.session.code || !ctx.session.code.result) {
		ctx.session.code = { result: code, timeout: Date.now() + timeout }
    console.log(code)
    // }
		ctx.body = {
    	data: code
		}
  }

  /**
	 * GET
	 * 查询手机号对应的用户是否存在
	 * /api/users/is-exist
	 * query = { phone }
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
  static async isExist (ctx, next) {
    console.log('查询手机号对应的用户是否存在')
		const { phone } = ctx.query
		if (!regs.phone.reg.test(phone)) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const user = await User.findOne({ phone }).exec()
    ctx.body = {
    	data: +!!user
		}
  }

	/**
	 * POST
	 * /api/users/register
	 * 用户注册
	 * body = { nick, phone, password }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async register (ctx, next) {
	  console.log('用户注册')
	  const { nick, phone, password } = ctx.request.body
    const user = await User.findOne({ phone }).exec()
    if (user) {
      throw new ApiError(ApiErrorNames.THE_PHONE_WAS_REGISTERED)
    }
	  if (!nick || !phone || !password) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
		const token = setToken(phone, ctx)
		const created = new Date()
		const bt = User.encryptPassword(password)
		const _new = await User.create({ nick, phone, password: bt, created, token })
	  await createCart(_new._id)
    ctx.body = { data: { nick, phone, uid: _new._id } }
  }

	/**
	 * POST
	 * /api/users/login
	 * 用户登录
	 * body = { phone, password }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async login (ctx, next) {
    console.log('用户登录')
    const { phone, password } = ctx.request.body
		if (!password || !phone) {
      throw new ApiError(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD)
    }
    const user = await User.findOne({ phone }).exec()
		if (!user || !user.validPassword(password)) {
      throw new ApiError(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD)
    }
	  user.token = setToken(phone, ctx)
	  await user.save()
    ctx.body = {
      data: _.pick(user, ['nick', 'phone', '_id', 'cart', 'avatar'])
    }
	}

	/**
	 * GET
	 * 退出登录
	 * /api/users/logout
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async logout (ctx, next) {
    console.log('登出')
    ctx.cookies.set('_token', '', {
			signed: true,
			maxAge: 1000 * 60 * 60 * 24 * 7,
			httpOnly: true
    })
  }

	/**
	 * PUT
	 * 修改密码
	 * /api/users/:uid/password
	 * body = { np, op, phone }
	 * @param ctx
	 * @param next
	 * @return {Promise.<boolean>}
	 */
  static async modifyPassword (ctx, next) {
		console.log('修改密码')
		const { uid } = ctx.params
		validUID(uid)
    const { np, op } = ctx.request.body
    if (!np || !op) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    // const bt = User.encryptPassword(op)
    // const user = await User.findByIdAndUpdate(uid, { password: bt })
		// if (!user) {
    //   throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    // }
		// 查找用户
		const user = await User.findById(uid).exec()
		if (!user || !user.validPassword(op)) {
			throw new ApiError(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD)
		}
		// 修改密码
		user.password = user.encryptPassword(np)
		// 更新token
		user.token = setToken(user.phone, ctx)
		await user.save()
    ctx.body = {
  		message: '操作成功'
		}
	}

  /**
	 * PUT
	 * 忘记密码
	 * /api/users/:uid/forget
	 * params { uid }
	 * body { code, password }
   * @param ctx
   * @param next
   * @return {Promise.<void>}
   */
	static async forget (ctx, next) {
		console.log('忘记密码')
		const { uid } = ctx.params
		validUID(uid)
		const { code, password } = ctx.request.body
    console.log(ctx.session.code)
    const session = ctx.session.code
		// 服务器没有code的session
		if (!session || !session.result) throw new ApiError(ApiErrorNames.UNKNOWN_ERROR)
		if (code.toString() !== session.result.toString()) throw new ApiError(ApiErrorNames.WRONG_CODE)
		if (Date.now() - session.timeout > timeout) throw new ApiError(ApiErrorNames.CODE_EXPIRED)
		const user = await User.findById(uid).exec()
		if (!user) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		user.password = user.encryptPassword(password)
		user.token = setToken(user.phone, ctx)
		await user.save()
		ctx.session.code = ''
		ctx.body = {
			message: '操作成功'
		}
	}

	/**
	 * PUT
	 * /api/users/:uid/nick
	 * 修改昵称
	 * params = { uid }
	 * body = { nick }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
  static async modifyNick (ctx, next) {
    console.log('修改昵称')
    const { uid } = ctx.params
    validUID(uid)
    const {  nick } = ctx.request.body
    if (!nick) {
      throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
    }
    const user = await User
			.findByIdAndUpdate(uid, { $set: { nick } })
			.select('nick phone _id')
			.lean()
			.exec()
    if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    ctx.body = {
      data: { ...user, nick }
    }
  }

	/**
	 * PUT
	 * /api/users/:uid/avatar
	 * 修改头像
	 * params = { uid }
	 * body = { imgStr }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
  static async modifyAvatar (ctx, next) {
    console.log('修改头像')
    const { uid } = ctx.params
    validUID(uid)
    const { imgStr } = ctx.request.body
    const user = await User.findById(uid).exec()
    if (!user) {
      throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    if (/^\d+$/.test(imgStr)) {
    	user.avatar = imgStr
		} else {
      const base64 = imgStr.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64, 'base64')
      const p = path.resolve(__dirname, '../../public/avatar/' + user.phone + '.png')
      const res = await fs.writeFileSync(p, buffer)
      if (res) {
        ctx.body = {
          code: '1061',
          message: '图片上传失败'
        }
      }
		}
		user.avatar = '/avatar/' + user.phone + '.png'
    const _new = await user.save()
		ctx.body = {
    	data: _.pick(_new, ['nick', 'phone', '_id', 'cart', 'avatar'])
		}
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
	/**
	 * GET
	 * 获取用户列表
	 * query = { size, page }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async getUserList (ctx, next) {
    console.log('获取用户列表')
    const { size = 20, page = 1 } = ctx.query
    const count = await User.count()
    const users = await User.find()
			.skip((page - 1) * size)
			.limit(~~size)
      .sort('-created')
      .select('phone created nick avatar openID cart _id')
      .lean()
      .exec()
    ctx.body = {
      data: {
        users,
        count,
        total: Math.ceil(count / size),
        current: page,
				size
      }
    }
  }

	/**
	 * GET
	 * 检索用户
	 * query = { ps }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<boolean>}
	 */
  static async filterUsers (ctx, next) {
		console.log('检索用户')
		const { ps } = ctx.query
		if (!/^1\d{2,10}$/.test(ps)) {
			ctx.body = {
				data: []
			}
			return false
		}
		const users = await User
			.find({ phone: { $regex: new RegExp(`^${ps}`) } })
			.limit(20)
			.lean()
			.exec()
		ctx.body = {
			data: users
		}
	}
}


module.exports = UserController