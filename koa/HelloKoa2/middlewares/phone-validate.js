async function phoneValidate (ctx, next) {
	const { phone } = ctx.request.body
	if (phone && !/^\d{11}$/.test(phone)) {
		ctx.body = {
			code: 1041,
			message: '手机号码格式有误'
		}
		return
	}
	await next()
}

module.exports = phoneValidate