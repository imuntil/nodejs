import Server from './server'
import * as protobuf from 'protocol-buffers'
import * as fs from 'fs'
import listData from './mockdata'

const schema = protobuf(fs.readFileSync(__dirname + '/../schema/comment.proto'))
const server = new Server(schema.CommentListRequest, schema.CommentListResponse)

server
  .createServer((req, res) => {
    res.end({ comments: listData })
  })
  .listen(4000)
