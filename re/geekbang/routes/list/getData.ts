import rpcClient from '../../lib/rpcClient'
import protobuf from 'protocol-buffers'
import fs from 'fs'

const schema = protobuf(fs.readFileSync(`${__dirname}/proto/list.proto`))
const client = rpcClient(4004, schema.ListRequest, schema.ListResponse)

export default (sortType = 0, filtType = 0) =>
  new Promise((resolve, reject) => {
    client.write({ sortType, filtType }, (err: Error, res: any) => {
      err ? reject(err) : resolve(res)
    })
  })
