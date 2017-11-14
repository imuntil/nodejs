const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')
const Adr = require('../../models/address')

class AddressController {
	// 获取所有address
	static async getAdrList (ctx, next) {
		console.log('all')
	}
	// 获取某个address
	static async getAdr (ctx, next) {
		console.log('get one')
	}
	// 新增address
	static async addAdr (ctx, next) {
		console.log('add')
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