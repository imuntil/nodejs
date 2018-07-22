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

// 琉璃神社
const ruri = require('./utils/ruri')
// 代理ip
const proxy = require('./utils/proxy')
// 动漫大风堂
const bangumi = require('./utils/bangumi')
// 动漫花园
const dmhy = require('./utils/dmhyCrawler')
const credentials = require('./utils/credentials')

/* middle */
const jwtAuth = require('./middlewares/jwt')
const rfMiddle = require('./middlewares/response-formatter')
const validMiddle = require('./middlewares/request-validate')

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

/* 自定义中间件 */
app.use(rfMiddle())
app.use(validMiddle)
app.use(jwtAuth)

app.use(jwt({cookie: '_li', secret: credentials.cookieSecret}).unless({path: [/^\/shizuku\/user\/[test|login|register]/]}))

app.use(api.routes(), api.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

/* 连接数据库 */
mongoose.connect('mongodb://zhin:13140054yyz@106.14.8.246:27017/zinzya')

/* 爬虫 */
/* 神社数据 */
ruri.crawlPer2h()
/* ip池 */
// proxy.fetchIpPool()
/* 番剧列表 */
// bangumi.runQueue()
// bangumi.forceUpdate()
// dmhy.runQueue()

module.exports = app
