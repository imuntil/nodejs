import Server from '../../../lib/dataServer'
import protobuf from 'protocol-buffers'
import fs from 'fs'
import data from './mock'

const schema = protobuf(fs.readFileSync(`${__dirname}/../proto/play.proto`))
const server = new Server(schema.PraiseRequest, schema.PraiseResponse)

server
  .createServer((req, res) => {
    const { commentid } = req.body
    const item = data.find((v) => v.id === +commentid)
    item && item.praiseNum++

    res.end(item)
  })
  .listen(4002)
