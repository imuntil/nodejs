import Server from '../../../lib/dataServer'
import protobuf from 'protocol-buffers'
import fs from 'fs'
import data from './mock'

const schema = protobuf(fs.readFileSync(`${__dirname}/../proto/play.proto`))
const server = new Server(schema.CommentListRequest, schema.CommentListResponse)

server
  .createServer((req, res) => {
    res.end({
      comments: data,
    })
  })
  .listen(4001, () => {
    console.log('play data server listend on 4001')
  })
