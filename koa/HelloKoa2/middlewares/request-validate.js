const reg = require('../lib/common').regs
const ApiError = require('../app/error/ApiError')
const ApiErrorNames = require('../app/error/ApiErrorNames')
async function validate (ctx, next) {
	console.log(ctx.params)
	console.log(ctx.req.params);
	const { params = {}, request: { body = {} } } = ctx
	console.log('params:', params)
	const phone = params.phone || body.phone
	const userId = params.userId || body.userId
	// 手机号码不合法
	if (phone && !reg.phone.reg.test(phone)) {
		throw new ApiError(ApiErrorNames.WRONG_PHONE_NUMBER)
	}
	// userId不是ObjectId
	if (userId && !reg.objectId.reg.test(userId)) {
		throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
	}
	// userId为必传参数，未传
	if (/^\/api\/adr/.test(ctx.originalUrl)) {
		const owner = ctx.query.userId
		const { adrID } = params
		console.log('adrId:', adrID);
		if (owner && !reg.objectId.reg.test(owner)) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
		if (adrID && !reg.objectId.reg.test(adrID)) {
			throw new ApiError(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR)
		}
	}
	await next()
}

module.exports = validate