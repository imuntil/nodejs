const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')
const Adr = require('../../models/address')

class AddressController {
	// 获取所有address
	static async getAdrList (ctx, next) {
		const { userId } = ctx.query
		if (!userId) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const list = await Adr.find({ _owner: userId }).select('-__v').exec()
		ctx.body = {
			data: list
		}
	}
	// 获取某个address
	static async getAdr (ctx, next) {
		console.log('get one')
	}
	// 新增address
	static async addAdr (ctx, next) {
		const { userId: _owner, province, city, detail, name, phone, label = '', isDefault = false } = ctx.request.body
		if (!province || !city || !detail || !name || !phone) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		const user = await User.findById(_owner).exec()
		if (!user) {
			throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
		}
		const date = new Date()
		const adr = {
			_owner, province, city, detail, name, phone, label, isDefault, date
		}
		await Adr.create(adr)
		ctx.body = {
			data: adr
		}
	}
	// 更新address
	static async modifyAdr (ctx, next) {
		console.log('modify')
	}
	// 更新default
	static async setDefault (ctx, next) {
		console.log('default')
	}
	// 删除address
	static async delAdr (ctx, next) {
		console.log('del')
	}
}

module.exports = AddressController