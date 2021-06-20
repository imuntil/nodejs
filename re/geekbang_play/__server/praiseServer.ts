import Server from './server'
import * as protobuf from 'protocol-buffers'
import * as fs from 'fs'
import mockData from './mockdata'

const schema = protobuf(
  fs.readFileSync(__dirname + '/../schema/comment.proto', 'utf-8')
)

const server = new Server(schema.PraiseRequest, schema.PraiseResponse)

server
  .createServer((req, res) => {
    const { commentid } = req.body
    const comment = mockData.find((v) => v.id === commentid)
    if (comment) {
      comment.praiseNum++
    }
    console.log(`xxx server comment`, comment)
    // res.end({
    //   commentid,
    //   praiseNum: comment.praiseNum,
    // })
    res.end(comment)
  })
  .listen(4001)
