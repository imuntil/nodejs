const passport = require('koa-passport')
const ApiError = require('../error/ApiError')
const ApiErrorNames = require('../error/ApiErrorNames')
const User = require('../../models/user')

exports.getUser = async (ctx, next) => {
    if (~~ctx.query.id !== 1) {
        throw new ApiError(ApiErrorNames.USER_NOT_EXIST)
    }
    const user = await User.findById("5a00574e57cbc3036abe86fc").exec()
    console.log('————————————————————————————', user)
    ctx.body = {
        username: 'zhin',
        age: '24'
    }
}

exports.registerUser = async (ctx, next) => {
    const { nick, phone } = ctx.request.body
    const user = new User({ nick, phone })
    const res = await user.save()
    console.log(res)
    ctx.body = res
}

exports.login = async (ctx, next) => {
    const { phone, password } = ctx.request.body
    if (!password || !phone) {
        throw new ApiError(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD)
    }
    return passport.authenticate('local.login', (err, user, info, status) => {
        const { msg } = info
        if (!user) {
            throw new ApiError(msg)
        }
    })(ctx)
}
