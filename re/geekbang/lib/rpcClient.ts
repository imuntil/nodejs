import EasySock from 'easy_sock'
import { SchemaRes, SchemaReq } from './dataServer'


const encode = (requestSchema: SchemaReq) => (data: any, seq: number) => {
  const body = requestSchema.encode(data)
  const head = Buffer.alloc(8)
  head.writeInt32BE(seq)
  head.writeInt32BE(body.length, 4)

  return Buffer.concat([head, body])
}

const decode = (responseSchema: SchemaRes) => (res: Buffer) => {
  const seq = res.readInt32BE()
  const body = responseSchema.decode(res.slice(8))
  return { result: body, seq }
}

const isReceiveComplete = (buffer: Buffer) => {
  if (buffer.length < 8) return 0
  const bodyLength = buffer.readInt32BE(4)
  if (buffer.length >= bodyLength) {
    return bodyLength + 8
  }
  return 0
}

export default (port: number, schemaReq: SchemaRes, schemaRes: SchemaRes) => {
  const rpc = new EasySock({
    id: '127.0.0.1',
    port,
    timeout: 500,
    keepAlive: true,
  })

  rpc.encode = encode(schemaReq)
  rpc.deocde = decode(schemaRes)
  rpc.isReceiveComplete = isReceiveComplete

  return rpc
}
