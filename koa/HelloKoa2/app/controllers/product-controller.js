const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const Product = require('../../models/product')

class ProductController {
	/**
	 * GET
	 * 获取产品列表(筛选)
	 * query ? = { price, sales }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getProList (ctx, next) {
		console.log('list')
	}

	/**
	 * GET
	 * 获取产品详细
	 * params = { sku || pid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getProDetail (ctx, next) {
		const { sku } = ctx.params
		if (!sku) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const adr = await Product.findOne({ sku }).select('-__v').lean().exec()
		if (!adr) throw new ApiError(ApiErrorNames.PRODUCT_NOT_EXIST)
		ctx.body = {
			data: adr
		}
	}
	/**
	 * GET
	 * 猜你喜欢
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async maybeLike (ctx, next) {
		console.log('like')
	}

	// sys
	// 增，删，改
	/**
	 * POST
	 * 新增产品
	 * body = { sku... }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async addPro (ctx, next) {
		const { sku, en, cn, price, _type, ...rest } = ctx.request.body
		if (!sku || !en || !cn || !price || !_type) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const date = new Date()
		const pro = await Product.create({ sku, en, cn, price, _type, date, update: date, ...rest })
		console.log(pro)
		ctx.body = {
			data: _.omit(pro.toObject(), '__v')
		}
	}
	static async modifyPro (ctx, next) {
		console.log('update')
	}
	static async delPro (ctx, next) {
		console.log('delete')
	}
}

module.exports = ProductController