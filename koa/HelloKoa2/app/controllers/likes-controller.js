const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')
const Product = require('../../models/product')
const { iv } = require('../../lib/cc')

const t = [1, 2, 3]
console.log(_.remove(t, n => n === 1))
console.log(t)

class LikeController {
	static async addLike (ctx, next) {
		console.log('添加收藏')
		const { uid } = ctx.params
		const { sku } = ctx.request.body
		iv(uid)
		if (!sku) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const user = await User.findById(uid).exec()
		if (!user) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		const p = await Product.findOne({ sku }).select('_id').lean().exec()
		if (!p) throw new ApiError(ApiErrorNames.PRODUCT_NOT_EXIST)
		const list = [...user.likes]
		if (!list.includes(sku)) {
			list.unshift(sku)
			user.likes = list
			await user.save()
		}
		ctx.body = {
			msg: '添加成功'
		}
	}
	static async deleteLike (ctx, next) {
		console.log('删除收藏')
		const { uid } = ctx.params
		const { sku } = ctx.request.body
		iv(uid)
		if (!sku) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const user = await User.findById(uid).exec()
		if (!user) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		const list = [...user.likes]
		const d = _.remove(list, s => s === sku)
		if (d.length) {
			user.likes = list
			await user.save()
			ctx.body = {
				msg: '删除完成'
			}
		} else {
			ctx.body = {
				msg: `收藏中没有sku为${sku}的产品`
			}
		}
	}

	/**
	 * GET
	 * 获取收藏列表
	 * params = { uid }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async listLikes (ctx, next) {
		console.log('获取全部收藏')
		const { uid } = ctx.params
		iv(uid)
		const user = await User.findById(uid).exec()
		if (!user) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		const list = await user.getLikes()
		ctx.body = {
			data: list
		}
	}
}

module.exports = LikeController