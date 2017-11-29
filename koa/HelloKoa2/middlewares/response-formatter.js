const ApiError = require('../app/error/ApiError')
const mongoose = require('mongoose')

const responseFormatter = (ctx) => {
  if (ctx.body) {
    ctx.body = {
      code: 0,
      message: 'success',
      ...ctx.body
    }
  } else {
    ctx.body = {
      code: 0,
      message: 'success'
    }
  }
}
const urlFilter = pattern => {
  return async (ctx, next) => {
    const reg = new RegExp(pattern)
    try {
      await next()
    } catch (err) {
      console.log(err)
      if (reg.test(ctx.originalUrl)) {
        if (err instanceof ApiError) {
          ctx.status = 200
          ctx.body = {
            code: err.code,
            message: err.message,
          }
        } else if (err instanceof mongoose.Error.ValidationError) {
          const { errors } = err
          const e1 = Object.values(errors)[0]
          ctx.status = 200
          ctx.body = {
            code: 210,
            message: e1.message || '字段不合法'
          }
        }else if (err instanceof mongoose.Error) {
          ctx.status = 200
          ctx.body = {
            code: 200,
            message: 'database-error: ' + err.message
          }
        }  else {
					ctx.status = 200
          ctx.body = {
            code: 211,
            message: '->' + err.message || '其他',
          }
        }
      }
      // throw err
    }
    if (reg.test(ctx.originalUrl)) {
      responseFormatter(ctx)
    }
  }
}

module.exports = urlFilter