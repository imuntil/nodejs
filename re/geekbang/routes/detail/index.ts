import koa, { Context } from 'koa'
// import mount from 'koa-mount'
import statics from 'koa-static'
import fs from 'fs'
import protobuf from 'protocol-buffers'
import engine from '../../lib/tplengine'
import rpcClient from '../../lib/rpcClient'

const schema = protobuf(
  fs.readFileSync(`${__dirname}/proto/detail.proto`, 'utf-8')
)
// rpc 服务器
const rpc = rpcClient(4000, schema.ColumnRequest, schema.ColumnResponse)

// 渲染引擎
const tpl = engine(`${__dirname}/template/index.html`)

const app = new koa()

app.use(statics(__dirname + '/source/ '))

app.use(async (ctx) => {
  const id = ctx.query.columnid

  if (!id || Array.isArray(id)) {
    ctx.status = 400
    ctx.body = 'invalid columnid'
    return
  }

  const result = await new Promise((resolve, reject) => {
    // 与data server通信，获取id对应数据
    rpc.write({ columnid: +id }, (err: Error, data: any) => {
      err ? reject(err) : resolve(data)
    })
  })

  ctx.status = 200
  // 通过模板渲染数据
  ctx.body = tpl(result)
})

export default app
