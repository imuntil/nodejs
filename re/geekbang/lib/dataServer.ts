import * as net from 'net'

export interface Callback {
  (
    req: { body: any; socket: net.Socket },
    res: { end: (data: any) => void }
  ): any
}

type Ed = {
  decode: (buf: Buffer) => any
  encode: (data: any) => Buffer
}

export interface SchemaSeq extends Pick<Ed, 'decode'> {}
export interface SchemaRes extends Pick<Ed, 'encode'> {}

class DataServer {
  constructor(public schemaSeq: SchemaSeq, public schemaRes: SchemaRes) {}

  isCompleteRequest = (buffer: Buffer) => {
    return buffer.readInt32BE(4) + 8
  }

  decodeRequest = (buffer: Buffer) => {
    return {
      seq: buffer.readInt32BE,
      result: this.schemaSeq.decode(buffer.slice(8)),
    }
  }

  encodeResponse = (data: any, seq: number) => {
    const body = this.schemaRes.encode(data)
    const head = Buffer.alloc(8)
    head.writeInt32BE(seq)
    head.writeInt32BE(body.length, 4)
    return Buffer.concat([head, body])
  }
}

export default DataServer
