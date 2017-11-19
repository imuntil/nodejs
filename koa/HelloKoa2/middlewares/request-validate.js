const reg = require('../lib/common').regs
const ApiError = require('../app/error/ApiError')
const ApiErrorNames = require('../app/error/ApiErrorNames')
async function validate (ctx, next) {
	const params = ctx.method === 'GET' ? ctx.query : ctx.request.body
	// 手机号码，用户id，地址id，产品id，订单id，购物车中产品的id
	const { phone, uid, aid, pid, oid, cid } = params
	// /api/adr 路径下的接口必须传递uid
	// if (/^\/api\/adr/.test(ctx.originalUrl)) {
	// 	if (!uid || !reg.objectId.reg.test(uid)) {
	// 		throw new ApiError(ApiErrorNames.WRONG_ID)
	// 	}
	// }
	const ids = [uid, aid, pid, oid, cid].filter(item => item)
	// 手机号码不合法
	if (phone && !reg.phone.reg.test(phone)) {
		throw new ApiError(ApiErrorNames.WRONG_PHONE_NUMBER)
	}
	// id不是ObjectId
	ids.forEach(item => {
		if (item && !reg.objectId.reg.test(item)) {
			throw new ApiError(ApiErrorNames.WRONG_ID)
		}
	})
	await next()
}

module.exports = validate