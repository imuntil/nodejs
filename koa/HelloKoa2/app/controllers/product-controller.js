const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const Product = require('../../models/product')

class ProductController {
	/**
	 * GET
	 * 获取产品列表(筛选)
	 * query ? = { flag = { price, sales } _type sort = { desc, asc } }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getProList (ctx, next) {
		const { flag, type, sort = 'desc' } = ctx.request.query
		let q = type ? Product.find({ _type: type }) : Product.find()
		const s = sort === 'asc' ? '' : '-'
		const f = flag ? `${flag} date` : 'date'
		const pros = await q.sort(`${s}${f}`).select('-__v').lean().exec()
		ctx.body = {
			data: pros
		}
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
		const pro = await Product.findOne({ sku: sku.toUpperCase() }).select('-__v').lean().exec()
		if (!pro) throw new ApiError(ApiErrorNames.PRODUCT_NOT_EXIST)
		ctx.body = {
			data: pro
		}
	}
	/**
	 * GET
	 * 猜你喜欢
	 * query = { type, sku }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async maybeLike (ctx, next) {
		const { type, sku } = ctx.request.query
		let pros = await Product
			.find({ _type: type })
			.nor([{ sku: sku.toUpperCase() }])
			.select('-__v')
			.lean()
			.exec()
		if (pros.length < 2) {
			pros = await Product
				.find()
				.nor([{ sku: sku.toUpperCase() }])
				.select('-__v')
				.lean()
				.exec()
		}
		const mb = _.shuffle(pros).slice(0, 2)
		ctx.body = {
			data: mb
		}
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