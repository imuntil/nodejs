const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
// const koaBody = require('koa-body')
const session = require('koa-session')
const jwt = require('koa-jwt')
const cors = require('koa2-cors')
const orderCtrl = require('./app/controllers/order-controller')

const credentials = require('./lib/credentials')

const https = require('https')
// const http = require('http')
const enforceHttps = require('koa-sslify')
const fs = require('fs')
const os = require('os')

const responseFormatter = require('./middlewares/response-formatter')
const phoneValidate = require('./middlewares/request-validate')
const jwtMid = require('./middlewares/jwt')
require('./lib/auth')

const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')

// Force HTTPS on all page
app.use(enforceHttps())

// error handler
onerror(app)

// middlewares
// app.use(koaBody({ multipart: true }))
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.keys = ['session-key']
app.use(session({
  maxAge: 1000 * 60 * 60
}, app))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

app.use(cors({
  origin: function (ctx) {
    // return 'http://localhost:8000'
    return 'https://localhost:3000'
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// format response
app.use(responseFormatter('^/api'))
app.use(phoneValidate)
app.use(jwtMid)

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
// admin
app.use(
  jwt({
    cookie: '_st',
    secret: credentials.sysCookieSecret
  })
  .unless({
    custom({
      originalUrl: url
    }) {
      console.log(url)
      if (url === '/api/sys/login' || url === '/api/sys/register') return true
      if (url.indexOf('/sys') >= 0) return false
      return true
    }
  })
)
// user
app.use(
  jwt({
    cookie: '_token',
    secret: credentials.cookieSecret
  })
  .unless({
    path: [
      /^\/api\/users\/[code|register|login|is\-exist]/,
      /^\/api\/pros/,
      /^\/api\/sys\/[login|register]/,
      /^\/api\/sys\/coupon/
    ]
  })
)
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});


mongoose.Promise = global.Promise
mongoose.connect('mongodb://zhin:13140054yyz@106.14.8.246:27017/start', {
  useMongoClient: true
})

// ssl options
const {
  key,
  cert
} = credentials.ssl[os.type().toLowerCase()] || {}
if (!key) {
  throw new Error('未知的操作系统')
}
const options = {
  key: fs.readFileSync(key),
  cert: fs.readFileSync(cert)
}

// http.createServer(app.callback()).listen(3003)
const sslServer = https.createServer(options, app.callback()).listen(3002)

const io = require('socket.io')(sslServer)
const gi = require('./utils/socket')
const nsp = gi.nsp = io.of('/socket')
nsp.on('connection', socket => {
  console.log('socket connected....')
  nsp.emit('msg', 'socket connected...')
  orderCtrl.toBeDelevred()
    .then(res => {
      nsp.emit('msg', {
        count: res
      })
    })
    .catch(e => {
      nsp.emit('msg', {
        count: 0
      })
    })
  // socket.emit('msg', '11')
  // socket.broadcast.emit('msg', '22')
  // socket.to('test').emit('msg', '33')
})

module.exports = app