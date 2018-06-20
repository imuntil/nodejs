const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const mongoose = require('mongoose')
const jwt = require('koa-jwt')

const index = require('./routes/index')
const users = require('./routes/users')
const api = require('./routes/api')

const spider = require('./utils/spider')
const credentials = require('./utils/credentials')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.keys = ['li-keys']
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {extension: 'pug'}))

// logger
app.use(async(ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())

/* token */
app.use((ctx, next) => {
  return next().catch(err => {
    if (401 === err.status) {
      ctx.status = 401
      ctx.body = {
        msg: 'Authentication Error'
      }
    } else {
      throw err
    }
  })
})
app.use(jwt({cookie: '_li', secret: credentials.cookieSecret}).unless({path: [/^\/api\/user\/[login|create]/]}))

app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

/* 连接数据库 */
mongoose.connect('mongodb://zhin:13140054yyz@106.14.8.246:27017/zinzya')

/* 爬虫 */
// spider.run()

module.exports = app