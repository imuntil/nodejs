import createClient from '../../geekbang_play/client'
import * as protobuf from 'protocol-buffers'
import * as fs from 'fs'

const schema = protobuf(fs.readFileSync(__dirname + '/list.proto', 'utf-8'))

const client = createClient(4003, schema.ListRequest, schema.ListResponse)

export default (sortType = 0, filtType = 0) => {
  return new Promise((resolve, reject) => {
    client.write({ sortType, filtType }, (err, res) => {
      err ? reject(err) : resolve(res.columns)
    })
  })
}
