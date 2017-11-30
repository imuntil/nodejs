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
	 * /api/users/code
	 * 获取验证码
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async getCode (ctx, next) {
    const code = Math.floor(Math.random() * 1000000)
    ctx.session.code = { result: code, timeout: Date.now() + timeout }
    ctx.body = { data: { code } }
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

	/**
	 * GET
	 * 退出登录
	 * /api/users/logout
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
  static async logout (ctx, next) {
    // x
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

	static async forget (ctx, next) {
		console.log('忘记密码')
		const { uid } = ctx.params
		validUID(uid)
		const { code, password } = ctx.request.body
		const session = ctx.session.code
		// 服务器没有code的session
		if (!session || !session.result) throw new ApiError(ApiErrorNames.UNKNOWN_ERROR)
		if (code !== session.result) throw new ApiError(ApiErrorNames.WRONG_CODE)
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