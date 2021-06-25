import koa from 'koa'
import mount from 'koa-mount'
import rpcClient from './lib/rpcClient'
import protobuf from 'protocol-buffers'
import fs from 'fs'

const app = new koa()
const schema = protobuf(fs.readFileSync(`${__dirname}/routes/play/proto/play.proto`))

const client = rpcClient(
  4001,
  schema.CommentListRequest,
  schema.CommentListResponse
)
app.use(mount<any, koa.Context>('/comment', async (ctx) => {
  const id = (ctx.query.id as string).split(',')
  console.log(`id`, id)
  // const result = await new Promise((resolve, reject) => {
  //   client.write()
  // })
  ctx.body = id
}))

export default app
