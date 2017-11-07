const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')
const ApiErrorNames = require('../app/error/ApiErrorNames')

passport.serializeUser((user, done) => {
    console.log('111111111111')
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    console.log(22222222222222)
    try {
        const user = await User.findById(id).exec()
        done(null, user)
    } catch (err) {
        done(err)
    }
})

passport.use('local.login', new LocalStrategy({
    usernameField: 'phone',
    passwordField: 'password'
}, async (req, username, password, done) => {
    if (!username || !password) {
        return done(null, false, { msg: ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD })
    }
    const user = await User.findOne({ phone: username })
    user
        ? done(null, user, { code: 1, msg: 'success' })
        : done(null, false, { msg: ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD })
}))