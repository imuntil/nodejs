const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')

exports.getUser = async (ctx, next) => {
    if (~~ctx.query.id !== 1) {
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    ctx.body = {
        username: 'zhin',
        age: '24'
    }
}

exports.registerUser = async (ctx, next) => {
    ctx.body = ctx.request.body
}