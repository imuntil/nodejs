import * as fs from 'fs'
import * as EasySock from 'easy_sock'
import * as protobuf from 'protocol-buffers'

console.log(`xxx fs`, fs)

const schema = protobuf(fs.readFileSync(__dirname + '/detail.proto', 'utf-8'))

const easySock = new EasySock({
  ip: '127.0.0.1',
  port: 4000,
  timeout: 60000,
  keepAlive: true,
})

easySock.encode = (data, seq) => {
  const body = schema.ColumnRequest.encode(data)
  console.log(`xxx seq encode`, seq)
  const head = Buffer.alloc(8)
  head.writeInt32BE(seq)
  head.writeInt32BE(body.length, 4)
  return Buffer.concat([head, body])
}

easySock.decode = (buffer) => {
  const seq = buffer.readInt32BE()
  console.log(`xxx seq decode`, seq)
  const body = schema.ColumnResponse.decode(buffer.slice(8))
  // console.log(`xxx body`, body)
  return { seq, result: body }
}

easySock.isReceiveComplete = (buffer) => {
  // console.log(`xxx buffer.length`, buffer.length)
  if (buffer.length < 8) return 0
  const contentLength = buffer.readInt32BE(4)
  // console.log(`xxx contentLength`, contentLength)
  if (buffer.length >= contentLength + 8) {
    return contentLength + 8
  }
  return 0
}

// module.exports = easySock
export default easySock
