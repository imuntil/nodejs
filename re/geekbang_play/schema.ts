import { buildSchema } from 'graphql'
import * as fs from 'fs'
import * as protobuf from 'protocol-buffers'
import createClient from './client'

const schema = buildSchema(
  fs.readFileSync(__dirname + '/schema/comment.gql', 'utf-8')
)

const ptSchemas = protobuf(
  fs.readFileSync(__dirname + '/schema/comment.proto', 'utf-8')
)

const commentClient = createClient(
  4000,
  ptSchemas.CommentListRequest,
  ptSchemas.CommentListResponse
)
const praiseClient = createClient(
  4001,
  ptSchemas.PraiseRequest,
  ptSchemas.PraiseResponse
)

schema.getQueryType().getFields().comment.resolve = () => {
  return new Promise((resolve, reject) => {
    commentClient.write({ columnid: 0 }, (err, res) => {
      err ? reject(err) : resolve(res.comments)
    })
  })
}

schema.getMutationType().getFields().praise.resolve = (arg0, { id }) => {
  return new Promise((resolve, reject) => {
    praiseClient.write({ commentid: id }, (err, res) => {
      err ? reject(err) : resolve(res.praiseNum)
    })
  })
}

export default schema
