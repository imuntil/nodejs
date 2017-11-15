// current project common tools
const reg = require('./common').regs
const ApiError = require('../app/error/ApiError')
const ApiErrorNames = require('../app/error/ApiErrorNames')

function iv (id) {
	const v = !id || !reg.objectId.reg.test(id)
	if (v) throw new ApiError(ApiErrorNames.WRONG_ID)
	return true
}

module.exports = {
	iv
}