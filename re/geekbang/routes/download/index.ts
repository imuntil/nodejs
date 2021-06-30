import fs from 'fs'
import Koa from 'koa'
// import mount from 'koa-mount'
import statics from 'koa-static'

const app = new Koa()

app.use(statics(__dirname + '/source/'))

const buf = fs.readFileSync(__dirname + '/source/index.htm')
app.use(async (ctx) => {
  ctx.status = 200
  ctx.type = 'html'
  ctx.body = buf
})

export default app
