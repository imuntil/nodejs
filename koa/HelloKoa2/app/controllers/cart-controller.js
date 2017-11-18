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
		const pros = await cart.getCart()
		console.log(pros)
		ctx.body = {
			data: cart
		}
	}

	/**
	 * POST
	 * 向购物车中添加商品
	 * params = { uid }
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
		if (!pros.length) {
			pros.push({ sku, count: 1, chosen: true })
			await cart.save()
		}
	}

	/**
	 * PUT
	 * 修改购物车中的商品（数量，选中）
	 * params = { uid, sku }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async modifyCart (ctx, next) {
		console.log('update cart')
	}

	/**
	 * DELETE
	 * 删除cart中的商品
	 * params = { uid, sku }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async deleteFromCart (ctx, next) {
		console.log('delete')
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
	}

	/**
	 * PUT
	 * 全选或者全不选商品
	 * params = { uid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async toggleChoose (ctx, next) {
		console.log('toggle choose')
	}
}

module.exports = CartController