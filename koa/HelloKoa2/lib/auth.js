const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')

passport.serializeUser((user, done) => {
    console.log('-------------serializeUser————————————————————')
    done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
    console.log('-------------deserializeUser————————————————————')
    console.log(id)
    console.log('-------------deserializeUser————————————————————')
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
}, async (username, password, done) => {
    console.log('-------------------local.login')
    console.log(username)
    console.log(password)
    console.log('------------------end')
    if (!username || !password) {
        return done(null, false)
    }
    const user = await User.findOne({ phone: username })
    console.log(user)
    done(null, user)
}))