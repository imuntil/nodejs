const {regs} = require('../utils').ct

const {ApiError, ApiErrorNames} = require('../app/error/ApiError')
const validate = async(ctx, next) => {
  const params = ctx.method === 'GET'
    ? ctx.query
    : ctx.request.body
  /*
  bid: bangumi id
  */
  const {password, bid, email} = params
  if (password && !regs.password.reg.test(password)) {
    throw new ApiError(ApiErrorNames.WRONG_ACCOUNT_OR_PWD)
  }
  if (email && !regs.email.reg.test(email)) {
    throw new ApiError(ApiErrorNames.INVALID_EMAIL)
  }
  const ids = [bid].filter(v => v)
  ids.forEach(v => {
    if (!regs.objectId.reg.test(v)) {
      throw new ApiError(ApiErrorNames.WRONG_ID)
    }
  })
  await next()
}

module.exports = validate