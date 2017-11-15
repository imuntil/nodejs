const _ = require('lodash')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')
const Adr = require('../../models/address')
const { iv } = require('../../lib/cc')

class AddressController {
	/**
	 * GET
	 * 获取所有地址
	 * query = { uid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getAdrList (ctx, next) {
		const { uid } = ctx.query
		iv(uid)
		const list = await Adr.find({ _owner: uid }).select('-__v').lean().exec()
		ctx.body = {
			data: list
		}
	}

	/**
	 * GET
	 * 获取地址详细信息
	 * params = { aid }
	 * query = { uid }  //仅用于验证
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getAdr (ctx, next) {
		const { aid } = ctx.params
		iv(aid)
		const adr = await Adr.findById(aid).select('-__v -date').lean().exec()
		console.log(adr)
		ctx.body = {
			data: adr
		}
	}

	/**
	 * POST
	 * 新增地址
	 * body = { uid, province, city, detail, name, phone, label(optional), isDefault(optional) }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async addAdr (ctx, next) {
		const { uid: _owner, province, city, detail, name, phone, label = '', isDefault = false } = ctx.request.body
		iv(_owner)
		if (!province || !city || !detail || !name || !phone) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const user = await User.findById(_owner).exec()
		if (!user) {
			throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		}
		const date = new Date()
		const adr = await Adr.create({ _owner, province, city, detail, name, phone, label, isDefault, date })
		ctx.body = {
			data: _.omit(adr.toObject(), '__v')
		}
	}

	/**
	 * PUT
	 * 更新地址
	 * body = { province, city, detail, name, phone, label(optional), isDefault(optional) }
	 * params = { aid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async modifyAdr (ctx, next) {
		const { aid } = ctx.params
		iv(aid)
		const { province, city, detail, name, phone, label = '', isDefault = false } = ctx.request.body
		if (!province || !city || !detail || !name || !phone) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const adr = await Adr.findByIdAndUpdate(aid, {
			province, city, detail, name, phone, label, isDefault
		}).select('-__v -date').lean().exec()
		// const adr = await Adr.findById(aid).exec()
		if (!adr) {
			throw new ApiError(ApiErrorNames.ADDRESS_NOT_EXIST)
		}
		ctx.body = {
			data: { ...adr, province, city, detail, name, phone, label, isDefault }
		}
	}

	/**
	 * PUT
	 * 更新default
	 * body = { isDefault }
	 * params = { aid }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async setDefault (ctx, next) {
		const { aid } = ctx.params
		iv(aid)
		const { isDefault } = ctx.request.body
		const adr = await Adr.where({ _id: aid }).update({ isDefault: !!isDefault }).exec()
		if (!adr) throw new ApiError(ApiErrorNames.ADDRESS_NOT_EXIST)
		ctx.body = {
			data: 'ok'
		}
		// Adr.findByIdAndUpdate(aid, { isDefault: !!isDefault }, (err, doc) => {
		// 	console.log(err);
		// 	console.log(doc);
		// })
	}

	/**
	 * DELETE
	 * 删除地址
	 * params = { aid }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async delAdr (ctx, next) {
		const { aid } = ctx.params
		iv(aid)
		const adr = await Adr.findByIdAndRemove(aid).exec()
		if (!adr) throw new ApiError(ApiErrorNames.ADDRESS_NOT_EXIST)
		ctx.body = {
			data: 'ok'
		}
	}
}

module.exports = AddressController