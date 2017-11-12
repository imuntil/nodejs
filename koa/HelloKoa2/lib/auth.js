const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const User = require('../models/user')
const ApiErrorNames = require('../app/error/ApiErrorNames')

passport.serializeUser((user, done) => {
	done(null, user.id)
})
passport.deserializeUser(async (id, done) => {
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
	if (!username || !password) {
		return done(null, false, { msg: ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD })
	}
	const user = await User.findOne({ phone: username })
	user
		? done(null, user, { code: 1, msg: 'success' })
		: done(null, false, { msg: ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD })
}))

passport.use('local.register', new LocalStrategy({
	usernameField: 'phone',
	passwordField: 'password'
}, async (...rest) => {
	console.log(rest)
	// console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx')
	// const user = await User.findOne({ phone: username }).exec()
	// if (user) {
	// 	// 该手机号已被注册
	// }
	// console.log(req)
	// done(null, user)
}))