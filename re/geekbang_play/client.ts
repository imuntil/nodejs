import * as fs from 'fs'
import * as EasySock from 'easy_sock'
import * as protobuf from 'protocol-buffers'

const encode = (requestSchema) => (data, seq) => {
  const body = requestSchema.encode(data)

  const head = Buffer.alloc(8)
  head.writeInt32BE(seq)
  head.writeInt32BE(body.length, 4)

  return Buffer.concat([head, body])
}
const decode = (responseSchema) => (buffer) => {
  const seq = buffer.readInt32BE()
  const body = responseSchema.decode(buffer.slice(8))

  return {
    result: body,
    seq,
  }
}
const isReceiveComplete = function (buffer) {
  if (buffer.length < 8) {
    return 0
  }
  const bodyLength = buffer.readInt32BE(4)

  if (buffer.length >= bodyLength + 8) {
    return bodyLength + 8
  } else {
    return 0
  }
}

export default (port: number, schemaReq, schemaRes) => {
  const easySock = new EasySock({
    ip: '127.0.0.1',
    port,
    timeout: 500,
    keepAlive: true,
  })

  easySock.encode = encode(schemaReq)
  easySock.decode = decode(schemaRes)
  easySock.isReceiveComplete = isReceiveComplete

  return easySock
}
