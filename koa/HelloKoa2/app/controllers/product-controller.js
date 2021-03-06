const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const Product = require('../../models/product')
// const fs = require('fs')
// const path = require('path')

class ProductController {
	/**
	 * GET
	 * 获取产品列表(筛选)
	 * query ? = { flag = { price, sales } type sort = { desc, asc } action = { recommend, hot } }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getProList (ctx, next) {
    console.log('产品列表	')
		const { flag, type, sort = 'desc', action } = ctx.request.query
		if (action && action.indexOf(['recommend', 'hot']) > -1) {
    	const pros = await Product.find({ [action]: true })
				.select('-__v')
				.limit(action === 'hot' ? 2 : 10)
				.exec()
			ctx.body = {
    		data: pros.length ? pros.map(p => p.toObject({ virtuals: true })) : []
			}
			return
		}
		let q = (type && type !== 'null') ? Product.find({ _type: type }) : Product.find()
		const s = sort === 'asc' ? '' : '-'
		const f = (flag && flag !== 'null') ? `${flag} date` : 'date'
		const pros = await q
			.sort(`${s}${f}`)
			.select('-__v')
			.exec()
    ctx.body = {
			data: pros.map(p => p.toObject({ virtuals: true }))
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
    console.log('产品详情')
    const { sku } = ctx.params
		if (!sku) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const pro = await Product
			.findOne({ sku: sku.toUpperCase() })
			.select('-__v')
			.exec()
		if (!pro) throw new ApiError(ApiErrorNames.PRODUCT_NOT_EXIST)
		ctx.body = {
			data: { ...pro.toObject({ virtuals: true }), truePrice: pro.truePrice }
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
			.exec()
		if (pros.length < 2) {
			pros = await Product
				.find()
				.nor([{ sku: sku.toUpperCase() }])
				.select('-__v')
				.exec()
		}
		const mb = _.shuffle(pros).slice(0, 2).map(p => p.toObject({ virtuals: true }))
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
		const { sku, ...rest } = ctx.request.body
		if (!sku) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const date = new Date()
		const pro = await Product
			.create({ sku: sku.toUpperCase(), date, update: date, ...rest })
		ctx.body = {
			data: _.omit(pro.toObject(), '__v')
		}
	}


	/**
	 * PUT
	 * 更新产品
	 * params = { sku }
	 * body = { en, cn, price, type, ...rest }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async modifyPro (ctx, next) {
		const body = ctx.request.body
		const sku = ctx.params.sku
		if (_.isEmpty(body)) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const old = await Product
			.findOne({ sku: sku.toUpperCase() })
			.exec()
		const ableUpdate = _.omit(body, ['_id', 'sku', 'date', 'update', 'sales', 'like', 'cart', 'truePrice'])
		if (!old) throw new ApiError(ApiErrorNames.PRODUCT_NOT_EXIST)
		for (let k in ableUpdate) {
			if (body[k] === undefined) continue
			old[k] = body[k]
		}
		old.update = new Date()
		const _new = await old.save()
		ctx.body = {
			data: _.omit(_new.toObject({ virtuals: true }), '__v')
		}
	}

	/**
	 * DELETE
	 * 删除产品
	 * params = { sku }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async delPro (ctx, next) {
		const sku = ctx.params.sku
		if (!sku) throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		const { result } = await Product
			.remove({ sku: sku.toUpperCase() })
		ctx.body = {
			message: '删除成功',
			data: `已删除${result.n}条数据`
		}
	}

	/**
	 * POST
	 * 上传图片
	 * 仅仅处理图片的io，不会修改数据库。所有的图片都是post，不会存在覆盖的现象。
	 * 数据的更新由后续的接口来处理。
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async productImage (ctx, next) {
		if ('POST' !== ctx.method) return await next()
		const { sku } = ctx.params
		const path = `/images/pro-pics/${sku.toUpperCase()}/${ctx.req.file.filename}`
		// const path = ctx.req.files.map(f => `/images/pro-pics/${sku.toUpperCase()}/${f.filename}`)
		ctx.body = {
			data: path
		}
	}
}

module.exports = ProductController