import koa from 'koa'
import statics from 'koa-static'
import mount from 'koa-mount'
import fs from 'fs'

const app = new koa()

app.use(mount('/static', statics(__dirname + '/source/static/')))

app.use(async (ctx) => {
  ctx.status = 200
  ctx.body = fs.readFileSync(__dirname + '/source/index.htm', 'utf-8')
})

export default app
