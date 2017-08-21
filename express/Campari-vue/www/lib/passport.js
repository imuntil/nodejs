/**
 * Created by 斌 on 2017/4/15.
 */
const passport = require('passport')
const User = require('../models/user')
const Cart = require('../models/cart')
const LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    if (err || !user) { return done(err, null) }
    done(null, user)
  })
})

passport.use('local.sign', new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password',
  passReqToCallback: true
}, (req, phone, password, done) => {
  req.checkBody('phone', 'invalid phone').isPhone()
  req.checkBody('password', 'invalid password').len32()
  req.checkBody('nick', 'invalid nick').len(2, 20)
  let errors = req.validationErrors()
  if (errors) {
    return done(null, false, {code: -1, msg: '密码或手机号码不合法', detail: errors})
  }

  User.findOne({'phone': phone}, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      return done(null, false, {code: -1, msg: '手机号码已被注册'})
    }
    let _user = new User()
    _user.phone = phone
    _user.password = _user.encryptPassword(password)
    _user.nick = req.body.nick
    _user.created = Date.now()
    _user.save()
      .then((doc) => {
        new Cart({
          _owner: _user._id,
          lastDate: Date.now(),
          products: []
        }).save(function (err) {
          console.log(err)
        })
        done(null, _user, {code: 1, msg: 'success'})
      })
      .catch(err => done(err, false, {code: 2, msg: '数据库出错'}))
  })
}))

passport.use('local.login', new LocalStrategy({
  usernameField: 'phone',
  passwordField: 'password',
  passReqToCallback: true
}, (req, phone, password, done) => {
  req.checkBody('phone', 'invalid phone').isPhone()
  req.checkBody('password', 'invalid password').len32()
  let errors = req.validationErrors()
  if (errors) {
    return done(null, false, {code: -1, msg: '手机号码或密码不合法', detail: errors})
  }
  User.findOne({'phone': phone}, (err, user) => {
    if (err) {
      return done(err, false, {code: 2, msg: '数据库出错', detail: err})
    }
    if (!user) {
      return done(null, false, {code: -1, msg: '用户不存在'})
    }
    if (!user.validPassword(password)) {
      return done(null, false, {code: -1, msg: '密码有误'})
    }
    return done(null, user, {code: 1, msg: 'success'})
  })
}))

// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     User.findOne({ username: username }, function (err, user) {
//       if (err) { return done(err) }
//       if (!user) {
//         return done(null, false, { message: 'Incorrect username.' })
//       }
//       if (!user.validPassword(password)) {
//         return done(null, false, { message: 'Incorrect password.' })
//       }
//       return done(null, user)
//     })
//   }
// ))
