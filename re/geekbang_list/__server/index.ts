import Server from '../../geekbang_play/__server/server'
import * as protobuf from 'protocol-buffers'
import * as fs from 'fs'
import mockData from '../../geekbang_detail/__server/column'

const schema = protobuf(
  fs.readFileSync(__dirname + '/../node/list.proto', 'utf-8')
)
const server = new Server(schema.ListRequest, schema.ListResponse)

server
  .createServer((req, res) => {
    // __todo
  })
  .listen(4003, () => {
    console.log('the server run at 4003')
  })
