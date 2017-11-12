const reg = require('../lib/common').regs
const ApiError = require('../app/error/ApiError')
const ApiErrorNames = require('../app/error/ApiErrorNames')
async function phoneValidate (ctx, next) {
	const { params, request: { body } } = ctx
	const phone = (params && params.phone) || (body && body.phone)
	const userId = (params && params.userId) || (body && body.userId)
	if (phone && !reg.phone.reg.test(phone)) {
		throw new ApiError(ApiErrorNames.WRONG_PHONE_NUMBER)
	}
	if (userId && !reg.objectId.reg.test(userId)) {
		throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
	}
	await next()
}

module.exports = phoneValidate