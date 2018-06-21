const regs = {
  phone: {
    str: '^(1[3|4|5|7|8])[0-9]{9}$',
    reg: /^(1[3|4|5|7|8])[0-9]{9}$/
  },
  password: {
    str: '^[A-z0-9_\!]{6,20}$',
    reg: /^[A-z0-9_\!]{6,20}$/
  },
  code: {
    str: '^[0-9]{6}$',
    reg: /^[\d]{6}$/
  },
  objectId: {
    reg: /^[0-9a-fA-F]{24}$/
  }
}
const {ApiError, ApiErrorNames} = require('../app/error/ApiError')
const validate = async(ctx, next) => {
  const params = ctx.method === 'GET'
    ? ctx.query
    : ctx.request.body
  const {phone, password} = params
  if (phone && !regs.phone.reg.test(phone)) {
    throw new ApiError(ApiErrorNames.WRONG_PHONE_NUMBER)
  }
  if (password && !regs.password.reg.test(password)) {
    throw new ApiError(ApiErrorNames.WRONG_PHONE_OR_PWD)
  }
  await next()
}

module.exports = validate