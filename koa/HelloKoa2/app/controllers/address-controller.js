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
	 * params = { uid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getAdrList (ctx, next) {
		console.log('获取所有地址')
		const { uid } = ctx.params
		iv(uid)
		const list = await Adr.find({ _owner: uid })
			.sort('-date')
			.select('-__v')
			.lean()
			.exec()
		ctx.body = {
			data: list
		}
	}

	/**
	 * GET
	 * 获取地址详细信息
	 * params = { aid, uid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async getAdr (ctx, next) {
		const { aid, uid } = ctx.params
		iv(aid, uid)
		const adr = await Adr.findById(aid).select('-__v -date').lean().exec()
		console.log(adr)
		ctx.body = {
			data: adr
		}
	}

	/**
	 * POST
	 * 新增地址
	 * body = { province, city, detail, name, phone, label(optional), isDefault(optional) }
	 * params = { uid }
	 * @param ctx
	 * @param next
	 * @return {Promise.<void>}
	 */
	static async addAdr (ctx, next) {
		console.log('新增地址')
		const { province, city, detail, name, phone, label = '', isDefault = false } = ctx.request.body
		const { uid: _owner } = ctx.params
		iv(_owner)
		if (!province || !city || !detail || !name || !phone) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const user = await User.findById(_owner).exec()
		if (!user) {
			throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		}
		const date = new Date()
		if (isDefault) {
      const res = await Adr.where({ _owner, isDefault: true })
				.setOptions({ multi: true, overwrite: true })
				.update({ isDefault: false })
				.exec()
      console.log(res)
    }
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
		const { aid, uid } = ctx.params
		iv(aid, uid)
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
	 * params = { aid, uid }
	 * @param ctx
	 * @param next
	 * @returns {Promise.<void>}
	 */
	static async setDefault (ctx, next) {
    console.log('更新默认地址')
    const { aid, uid } = ctx.params
		iv(aid, uid)
		const { isDefault } = ctx.request.body
    await Adr
      .where({ _owner: uid, isDefault: true }).update({ isDefault: false }).exec()
    const adr = await Adr
			.where({ _id: aid }).update({ isDefault: !isDefault }).exec()
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
		const { aid, uid } = ctx.params
		iv(aid, uid)
		const adr = await Adr.findByIdAndRemove(aid).exec()
		if (!adr) throw new ApiError(ApiErrorNames.ADDRESS_NOT_EXIST)
		ctx.body = {
			data: 'ok'
		}
	}
}

module.exports = AddressController