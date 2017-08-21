/**
 * Created by 斌 on 2017/4/15.
 */
const api = require('express').Router()
const passport = require('passport')
// const upload = require('../lib/storage')
const User = require('../models/user')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const credentials = require('../lib/credentials')
const ensureAuthorized = require('../lib/ensureAuthorized')

/**
 * 注册
 * phone， password
 */
api.post('/register', (req, res, next) => {
  passport.authenticate('local.sign', (err, user, info) => {
    console.log(err)
    if (user) {
      let token = jwt.sign({id: user.id}, credentials.cookieSecret, {
        expiresIn: '7d'
      })
      user.token = token
      user.save()
      res.cookie('token', token, {
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
      })
    }
    res.json(info)
  })(req, res, next)
})

/**
 * 获取验证码
 */
api.get('/get-code', (req, res, next) => {
  req.checkQuery('phone', 'invalid phone number').isPhone()
  let errors = req.validationErrors()
  if (errors) {
    return res.json({code: -1, result: '手机号码有误', detail: errors})
  }
  let code = Math.floor(Math.random() * 10000)
  console.log(code)
  req.session.tempData = {phone: req.body.phone, code: code}
  res.json({code: 1, msg: 'success', result: code})
})

/**
 * 查询手机号码是否在数据库中，用于注册等情形
 */
api.get('/has-phone', (req, res, next) => {
  req.checkQuery('phone', 'invalid phone number').isPhone()
  let errors = req.validationErrors()
  if (errors) {
    return res.json({code: -1, result: '手机号码有误', detail: errors})
  }
  User.findOne({phone: req.query.phone}, (err, doc) => {
    if (err) {
      return res.json({code: 2, msg: '数据库出错', detail: err})
    }
    console.log(doc)
    if (doc) {
      return res.json({code: 1, msg: 'success', result: 'has'})
    } else {
      return res.json({code: 1, msg: 'success', result: 'no'})
    }
  })
})

/**
 * 登录
 * phone， password
 */
api.post('/login', (req, res, next) => {
  passport.authenticate('local.login', (err, user, info) => {
    // 生成token
    if (err) {
      console.log(err)
    }
    if (user) {
      let token = jwt.sign({id: user.id}, credentials.cookieSecret, {
        expiresIn: '7d'
      })
      user.token = token
      user.save()
      res.cookie('token', token, {
        signed: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
      })
    }
    res.json(Object.assign(info))
  })(req, res, next)
})

/**
 * 获取登录状态
 */
api.get('/login-status', (req, res, next) => {
  let token = req.signedCookies['token']
  console.log(token)
  if (!token) {
    return res.json({code: 0, msg: 'logout'})
  }
  User.findOne({token: token})
    .select('phone nick avatar')
    .lean()
    .exec((err, doc) => {
      if (err) {
        return res.json({code: 2, msg: '数据库出错', detail: err})
      }
      if (!doc) {
        return res.json({code: -1, msg: '没有数据'})
      }
      return res.json({code: 1, msg: 'success', result: doc})
    })
})

// 登出
api.get('/logout', (req, res, next) => {
  res.clearCookie('token')
  res.json({code: 1})
})

/**
 * 修改密码
 * params
 * old, _new, _newRepeat
 */
api.post('/modify-password', ensureAuthorized, (req, res, next) => {
  if (req.body._new !== req.body._newRepeat) {
    return res.json({code: -1, msg: '两次输入的密码不一致'})
  }
  req.checkBody('old', 'invalid pass').len32()
  req.checkBody('_new', 'invalid pass').len32()
  let errors = req.validationErrors()
  if (errors) {
    console.error(errors)
    return res.json({
      code: -1,
      msg: '密码格式有误'
    })
  }
  if (req.body.old === req.body._new) {
    return res.json({
      code: -1,
      msg: '新旧密码不能一样'
    })
  }

  User.findOne({token: req.token}, (err, doc) => {
    if (err) {
      console.error(err)
      return res.json({code: 3, msg: '未知错误', detail: err})
    }
    if (!doc) {
      return res.json({code: -4, msg: 'token失效'})
    }
    if (!doc.validPassword(req.body.old)) {
      return res.json({code: 0, msg: '原密码有误'})
    }

    doc.password = doc.encryptPassword(req.body._new)
    doc.save()
      .then(() => res.json({code: 1, msg: '修改成功'}))
      .catch(err => {
        console.error(err)
        res.json({code: -1, msg: '修改失败', detail: err})
      })
  })
})

/**
 * 忘记密码
 * _new, _newRepeat
 */
api.post('/forget', (req, res, next) => {
  if (req.body._new !== req.body._newRepeat) {
    return res.json({code: -1, msg: '两次输入的密码不一致'})
  }
  req.checkBody('_new', 'invalid pass').len32()
  req.checkBody('phone', 'invalid phone').isPhone()
  let errors = req.validationErrors()
  if (errors) {
    return res.json({code: -1, msg: errors})
  }

  User.findOne({phone: req.body.phone}, (err, doc) => {
    if (err || !doc) {
      console.error(err)
      return res.json({code: 3, msg: '未知错误', detail: err})
    }
    doc.password = doc.encryptPassword(req.body._new)
    doc.save()
      .then(() => res.json({code: 1, msg: '修改成功'}))
      .catch(err => {
        console.error(err)
        res.json({code: 2, msg: '修改失败', detail: err})
      })
  })
})

/**
 * 修改昵称
 * nick
 */
api.post('/modify-nick', ensureAuthorized, (req, res, next) => {
  req.checkBody('nick', 'invalid nick').len(2, 30)
  if (req.validationErrors()) {
    return res.json({code: -1, msg: '昵称长度为2-30个字符'})
  }
  User.findOne({token: req.token}, (err, doc) => {
    if (err || !doc) {
      console.error(err)
      return res.json({code: 3, msg: '未知错误', detail: err})
    }
    doc.nick = req.body.nick
    doc.save()
      .then(() => res.json({code: 1, msg: '修改成功'}))
      .catch(err => {
        console.error(err)
        res.json({code: 2, msg: '修改失败', detail: err})
      })
  })
})

/**
 * 修改头像
 * FormData
 */
api.post('/modify-avatar', ensureAuthorized, (req, res, next) => {
  let imgData = req.body.avatar
  let base64 = imgData.replace(/^data:image\/\w+;base64,/, '')
  let dataBuffer = Buffer.from(base64, 'base64')

  User.findOne({token: req.token}, (err, doc) => {
    if (err || !doc) {
      console.error(err)
      return res.json({code: 3, msg: '未知错误', detail: err})
    }
    fs.writeFile('public/uploads/avatar/' + doc._id + '.jpg', dataBuffer, err => {
      if (err) {
        return res.json({code: -1, msg: '上传失败', detail: err})
      }
      doc.avatar = '/uploads/avatar/' + doc._id + '.jpg'
      doc.save()
        .then(() => res.json({code: 1, msg: 'success', result: doc.avatar}))
        .catch(err => {
          console.error(err)
          res.json({code: 2, msg: '修改失败', detail: err})
        })
    })
  })
})

module.exports = api
