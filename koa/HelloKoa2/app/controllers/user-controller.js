const passport = require('koa-passport')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')

class UserController {
	// 获取用户信息
	static async getUser (ctx, next) {
		const { id, phone } = ctx.params
		if (!id && !phone) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const q = id ? User.findById(id) : User.findOne({ phone })
		console.log('xxxxxxxxx')
		try {
			const user = await q.select('-__v').exec()
			console.log('___________________________')
			console.log(user)
			ctx.body = {
				user
			}
		} catch (err) {
			console.log(err)
			ctx.body = 'err'
		}
	}

	// 获取验证码
	static async getCode (ctx, next) {
		ctx.body = ctx.params
	}

	// 查看手机号码是否可用(注册前)
	static async phoneAble (ctx, next) {}

	// 用户注册
	static async register (ctx, next) {
		const { nick, phone } = ctx.request.body
		const user = new User({ nick, phone })
		const res = await user.save()
		console.log(res)
		ctx.body = res
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
}

module.exports = UserController