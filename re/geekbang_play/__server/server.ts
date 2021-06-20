import * as net from 'net'
// import * as Buffer from 'buffer'

export interface Callback {
  (
    arg1: { body: any; socket: net.Socket },
    arg2: { end: (data: any) => void }
  ): any
}

class RPC {
  constructor(public schemaReq, public schemaRes) {}

  isCompleteRequest = (buffer: Buffer) => {
    const contentLength = buffer.readInt32BE(4)
    return contentLength + 8
  }

  decodeRequest = (buffer: Buffer) => {
    const seq = buffer.readInt32BE()

    return { seq, result: this.schemaReq.decode(buffer.slice(8)) }
  }

  encodeResponse = (data: any, seq: number) => {
    const body: Buffer = this.schemaRes.encode(data)
    const head = Buffer.alloc(8)
    head.writeInt32BE(seq)
    head.writeInt32BE(body.length, 4)
    return Buffer.concat([head, body])
  }

  createServer = (callback: Callback) => {
    let buffer: Buffer = null
    const tcpServer = net.createServer((socket) => {
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

          // console.log(`xxx requestBuffer`, requestBuffer, requestBuffer.toString())
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
      listen(...rest) {
        tcpServer.listen.apply(tcpServer, rest)
      },
    }
  }
}

export default RPC
