const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const koaBody = require('koa-body')
const session = require('koa-session')
const jwt = require('koa-jwt')
const credentials = require('./lib/credentials')

const responseFormatter = require('./middlewares/response-formatter')
const phoneValidate = require('./middlewares/request-validate')
const jwtMid = require('./middlewares/jwt')
require('./lib/auth')

const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.keys = ['session-key']
app.use(session({
  maxAge: 1000 * 60 * 30
}, app))
app.use(json())
app.use(logger())
// app.use(koaBody({ multipart: true }))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
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
app.use(
  jwt({ cookie: '_token', secret: credentials.cookieSecret })
    .unless({ path: [/^\/api\/users\/[code|register|login]/] })
)
app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

mongoose.Promise = global.Promise

mongoose.connect('mongodb://localhost:27017/start',{
    useMongoClient: true
})

module.exports = app
