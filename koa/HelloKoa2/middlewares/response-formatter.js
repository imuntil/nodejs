const ApiError = require('../app/error/ApiError')

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
            if (err instanceof ApiError && reg.test(ctx.originalUrl)) {
                ctx.status = 200
                ctx.body = {
                    code: err.code,
                    message: err.message
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