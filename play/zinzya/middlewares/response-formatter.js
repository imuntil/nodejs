const {ApiError, errorMap, ApiErrorNames} = require('../app/error/ApiError')
const mongoose = require('mongoose')

const responseFormatter = ctx => {

  const body = ctx.body || {}
  ctx.body = {
    code: 1,
    message: 'success',
    ...body
  }
}

const URLFiler = (pattern = '^/shizuku') => {
  return async(ctx, next) => {
    const reg = new RegExp(pattern)
    try {
      await next()

    } catch (err) {
      if (reg.test(ctx.originalUrl)) {

        if (err instanceof ApiError) {
          ctx.body = {
            code: err.code,
            message: err.message
          }
        } else if (err instanceof mongoose.Error.ValidationError) {
          /* 数据库抛出的错误，字段不合法 */
          const e1 = Object.values(err.errors)[0]
          const errorInfo = errorMap.get(ApiErrorNames.FIELD_IS_ILLEGAL)
          ctx.body = {
            code: errorInfo.code,
            message: e1.message || errorInfo.message
          }
        } else {
          ctx.body = {
            code: -2,
            message: err.message || '未知错误2'
          }
        }
      }
      // if (ctx.status === 404) {   ctx.body = {     code: 0,     message: 'Not
      // Found'   } }
    }
    if (reg.test(ctx.originalUrl)) {
      responseFormatter(ctx)
    }
  }
}

module.exports = URLFiler