const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const expressValidator = require('express-validator')
const passport = require('passport')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const credentials = require('./lib/credentials')
const fs = require('fs')
// const ueditor = require('ueditor')
const _ = require('lodash')

require('./lib/passport')

const userApi = require('./api/user')
const productApi = require('./api/product')
const cartApi = require('./api/cart')
const addressApi = require('./api/address')
const orderApi = require('./api/order')

// 替换mongoose的promise
mongoose.Promise = global.Promise

const index = require('./routes/index')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', process.env.port || 3000)

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cookieParser(credentials.cookieSecret))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(expressValidator({
  customValidators: {
    isPhone (value) {
      return /^0?(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/.test(value)
    },
    len32 (value) {
      return _.trim(value).length === 32
    },
    isArray (value) {
      return Array.isArray(value)
    }
  }
}))

app.use('/', index)

app.use('/ueditor', require('./sys/ueditor'))
app.use('/sys/', require('./sys/sys'))

app.use(session({
  store: new RedisStore({
    port: '6379',
    ttl: 60 * 60 * 24 * 7 * 1000,
    db: 1
  }),
  secret: credentials.cookieSecret,
  cookie: {
    maxAge: 60 * 1000,
    httpOnly: true
  }
}))

app.use('/api', require('cors')())

app.use('/api/user', userApi)
app.use('/api/product', productApi)
app.use('/api/cart', cartApi)
app.use('/api/address', addressApi)
app.use('/api/order', orderApi)

app.post('/test/uploads', (req, res, next) => {
  console.log(req.body)
  res.json({code: 1})
})

let autoViews = {}
app.use((req, res, next) => {
  let path = req.path.toLowerCase()
  if (autoViews[path]) return res.render(autoViews[path])
  if (fs.existsSync(`${__dirname}/views${path}.jade`)) {
    autoViews[path] = path.replace(/^\//, '')
    return res.render(autoViews[path])
  }
  next()
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

mongoose.connect(credentials.mongodb.dev.path, err => {
  if (!err) {
    console.log('connected to mongodb')
  } else {
    throw err
  }
})

module.exports = app

