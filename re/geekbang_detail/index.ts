import * as Koa from 'koa'
import * as mount from 'koa-mount'
import * as koaStatic from 'koa-static'

import rpcClient from './client'
import template from './template'

const detailTemp = template(__dirname + '/template/index.html')
const app = new Koa()

app.use(mount('/static', koaStatic(__dirname + '/source/static')))

app.use(
  mount('/detail', async (ctx) => {
    const columnid = ctx.query.columnid

    if (!columnid) {
      ctx.status = 400
      ctx.body = 'invalid columnid'
      return
    }

    // ctx.status = 200
    // ctx.body = `id is ${columnid}`
    const result = await new Promise((resolve, reject) => {
      rpcClient.write({ columnid }, function myCallback1bac(err, data) {
        err ? reject(err) : resolve(data)
      })
    })

    ctx.status = 200
    ctx.body = detailTemp(result)
  })
)

app.listen(3000, () => {
  console.log('client run at 3000')
})

export default app
