import * as fs from 'fs'
import * as Koa from 'koa'
import * as mount from 'koa-mount'
import * as statics from 'koa-static'

const app = new Koa()

app.use(statics(__dirname + '/source/'))

app.use(
  mount<any, any>('/', async (ctx) => {
    ctx.body = fs.readFileSync(__dirname + '/source/index.htm', 'utf-8')
  })
)

export default app
