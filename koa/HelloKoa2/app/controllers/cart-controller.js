const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const Cart = require('../../models/cart')
const User = require('../../models/user')
const { iv } = require('../../lib/cc')

class CartController {
	/**
	 * GET
	 * 获取购物车
	 * params = { uid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getCart (ctx, next) {
		console.log('get cart')
		const { uid } = ctx.params
		iv(uid)
		const cart = await Cart
			.findOne({ _owner: uid })
			.exec()
		// 购物车中的产品详情
		const pros = await cart.getCart()
		ctx.body = {
			data: { ...cart.toObject(), products: pros }
		}
	}

	/**
	 * POST
	 * 向购物车中添加商品
	 * params = { uid }
	 * body = { sku }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async addToCart (ctx, next) {
		console.log('add to cart')
		const { uid } = ctx.params
		const { sku } = ctx.request.body
		iv(uid)
		if (!sku) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const cart = await Cart.findOne({ _owner: uid }).exec()
		if (!cart) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		const pros = cart.products
		const date = new Date()
		const has = _.find(pros, { sku })
		if (!has) {
			pros.push({ sku, count: 1, chosen: true, date })
		} else {
			has.count += 1
		}
		const _new = await cart.save()
		ctx.body = {
			data: _.omit(_new.toObject(), ['__v', 'date'])
		}
	}

	/**
	 * PUT
	 * 修改购物车中的商品（数量，选中）
	 * params = { uid, cid }
	 * body = { count, chosen }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async modifyCart (ctx, next) {
		console.log('update cart')
		const { uid, cid } = ctx.params
		iv(uid, cid)
		const { count ,chosen } = ctx.request.body
		if (count === undefined && chosen === undefined) {
			return
		}
		const cart = await Cart.findOne({ _owner: uid }).exec()
		if (!cart) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		if (count !== undefined) {
			cart.products.id(cid).count = ~~count
		}
		if (chosen !== undefined) {
			cart.products.id(cid).chosen = !!chosen
		}
		const _new = await cart.save()
		ctx.body = {
			data: _.omit(_new.toObject(), ['__v', 'date'])
		}
	}

	/**
	 * DELETE
	 * 删除cart中的商品
	 * params = { uid, cid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async deleteFromCart (ctx, next) {
		console.log('delete')
		const { uid, cid } = ctx.params
		iv(uid, cid)
		const cart = await Cart.findOne({ _owner: uid }).exec()
		if (!cart) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		await cart.products.id(cid).remove()
		const _new = await cart.save()
		ctx.body = {
			data: _.omit(_new.toObject(), ['__v', 'date'])
		}
	}

	/**
	 * DELETE
	 * params = { uid }
	 * 清空购物车
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async clearCart (ctx, next) {
		console.log('clear cart')
		const { uid } = ctx.params
		iv(uid)
		const cart = await Cart.findOne({ _owner: uid }).exec()
		if (!cart) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		cart.products = []
		const _new = await cart.save()
		ctx.body = {
			data: _.omit(_new.toObject(), ['__v', 'date'])
		}
	}

	/**
	 * PUT
	 * 全选或者全不选商品
	 * params = { uid }
	 * body = { chosen }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async toggleChoose (ctx, next) {
		console.log('toggle choose')
		const { uid } = ctx.params
		iv(uid)
		const cart = await Cart.findOne({ _owner: uid }).exec()
		if (!cart) throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		const chosen = !!ctx.request.body.chosen
		cart.products.forEach(p => {
			p.chosen = chosen
		})
		const _new = await cart.save()
		ctx.body = {
			data: _.omit(_new.toObject(), ['__v', 'date'])
		}
	}
}

module.exports = CartController