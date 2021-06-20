import * as fs from 'fs'
import * as koa from 'koa'
import * as mount from 'koa-mount'
import * as statics from 'koa-static'
import * as graphqlHttp from 'koa-graphql'
import schema from './schema'

const app = new koa()

app.use(mount('/api', graphqlHttp({ schema })))

app.use(mount('/static', statics(__dirname + '/source/static')))

app.use(
  mount('/', async (ctx) => {
    ctx.status = 200
    ctx.body = fs.readFileSync(__dirname + '/source/index.htm', 'utf-8')
  })
)

app.listen(3000, () => {
  console.log('the play server run at 3000 ')
})

export default app
