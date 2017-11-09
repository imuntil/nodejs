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
		const { id, phone } = ctx.params
		if (!id && !phone) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		if (id && !/^[0-9a-fA-F]{24}$/.test(id)) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const q = id ? User.findById(id) : User.findOne({ phone })
		try {
			const user = await q.select('-__v').exec()
			ctx.body = { data: { user } }
		} catch (err) {
			throw err
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
		// const user = await User.findOne({ phone })
		await User.create({ nick, phone })
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