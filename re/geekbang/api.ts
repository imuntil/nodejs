import koa from 'koa'
import mount from 'koa-mount'
import rpcClient from './lib/rpcClient'
import protobuf from 'protocol-buffers'
import fs from 'fs'

const app = new koa()
const schema = protobuf(
  fs.readFileSync(`${__dirname}/routes/play/proto/play.proto`)
)

const client = rpcClient(
  4001,
  schema.CommentListRequest,
  schema.CommentListResponse
)

const praiseClient = rpcClient(
  4002,
  schema.PraiseRequest,
  schema.PraiseResponse
)

app.use(
  mount<any, koa.Context>('/comment', async (ctx) => {
    const id = (ctx.query.id as string).split(',')
    console.log(`id`, id)
    const result = await new Promise((resolve, reject) => {
      client.write({ id }, (err: Error, data: any) => {
        err ? reject(err) : resolve(data)
      })
    })
    ctx.status = 200
    ctx.body = result
  })
)

app.use(
  mount<any, koa.Context>('/praise', async (ctx) => {
    const { id } = ctx.request.body as Record<string, any>
    if (!id) {
      ctx.status = 400
      ctx.body = 'invalid praise id'
      return
    }
    const result = await new Promise((resolve, reject) => {
      praiseClient.write({ commentid: id }, (err: Error, data: any) => {
        err ? reject(err) : resolve(data)
      })
    })

    ctx.status = 200
    ctx.body = result
  })
)

export default app
