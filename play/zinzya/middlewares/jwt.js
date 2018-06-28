const { ApiError, ApiErrorNames } = require('../app/error/ApiError')
const jwtAuth = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (~~err.status === 401) {
      ctx.status = 401
      throw new ApiError(ApiErrorNames.UNAUTHORIZED)
    } else {
      throw err
    }
  }
}

module.exports = jwtAuth