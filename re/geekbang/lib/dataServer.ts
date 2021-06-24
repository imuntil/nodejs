import  net from 'net'

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

export interface  SchemaReq extends Ed {}
export interface SchemaRes extends Ed {}

class DataServer {
  constructor(public schemaReq:  SchemaReq, public schemaRes: SchemaRes) {}

  isCompleteRequest = (buffer: Buffer) => {
    return buffer.readInt32BE(4) + 8
  }

  decodeRequest = (buffer: Buffer) => {
    return {
      seq: buffer.readInt32BE(),
      result: this.schemaReq.decode(buffer.slice(8)),
    }
  }

  encodeResponse = (data: any, seq: number) => {
    const body = this.schemaRes.encode(data)
    const head = Buffer.alloc(8)
    head.writeInt32BE(seq)
    head.writeInt32BE(body.length, 4)
    return Buffer.concat([head, body])
  }

  createServer = (callback: Callback) => {
    let buffer: Buffer = null
    const dataServer = net.createServer((socket) => {
      socket.on('data', (data) => {
        buffer = buffer && buffer.length ? Buffer.concat([buffer, data]) : data

        let checkLength: number = null

        while (buffer && (checkLength = this.isCompleteRequest(buffer))) {
          let requestBuffer: Buffer = null

          if (checkLength === buffer.length) {
            requestBuffer = buffer
            buffer = null
          } else {
            requestBuffer = buffer.slice(0, checkLength)
            buffer = buffer.slice(checkLength)
          }

          const request = this.decodeRequest(requestBuffer)

          callback(
            {
              body: request.result,
              socket,
            },
            {
              end: (data) => {
                const buffer = this.encodeResponse(data, request.seq)
                socket.write(buffer)
              },
            }
          )
        }
      })
    })

    return {
      listen(...rest: any[]) {
        dataServer.listen.apply(dataServer, rest)
      },
    }
  }
}

export default DataServer
