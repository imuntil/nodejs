const passport = require('koa-passport')
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
    const { nick, phone } = ctx.request.body
    const user = new User({ nick, phone })
    const res = await user.save()
    console.log(res)
    ctx.body = res
}

exports.login = async (ctx, next) => {
    return passport.authenticate('local.login', (err, user, info, status) => {
        console.log('xxxxxxxxxx')
        console.log(err)
        console.log(user)
        console.log('xxxxxxxxxx')
        if (user) {
            ctx.body = 'welcome'
        } else {
            ctx.body = 'something wrong'
            // return ctx.login(user)
        }
    })(ctx)
}
