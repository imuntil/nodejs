import  fs from 'fs'
import  Koa from 'koa'
import  mount from 'koa-mount'
import  statics from 'koa-static'

const app = new Koa()

app.use(statics(__dirname + '/source/'))

app.use(
  mount<any, any>('/', async (ctx) => {
    ctx.body = fs.readFileSync(__dirname + '/source/index.htm', 'utf-8')
  })
)

export default app
