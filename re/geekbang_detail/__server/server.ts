// const net = require('net')
import * as net from 'net'

class RPC {

  schemaReq: any = null;
  schemaRes: any = null;

  constructor(schemaReq, schemaRes) {
    this.schemaReq = schemaReq
    this.schemaRes = schemaRes
  }

  isCompleteRequest = (buffer) => {
    const contentLength = buffer.readInt32BE(4)
    return contentLength + 8
  }

  decodeRequest = (buffer) => {
    const seq = buffer.readInt32BE()
    console.log(`xxxx seq server`, seq)
    return {
      seq,
      result: this.schemaReq.decode(buffer.slice(8)),
    }
  }

  encodeResponse = (data, seq) => {
    const body = this.schemaRes.encode(data)
    const head = Buffer.alloc(8)
    head.writeInt32BE(seq)
    head.writeInt32BE(body.length, 4)
    return Buffer.concat([head, body])
  }

  createServer(cb) {
    let buffer = null
    const tcpServer = net.createServer((socket) => {
      socket.on('data', (data) => {
        buffer = buffer && buffer.length ? Buffer.concat([buffer, data]) : data

        let checkLength = null
        while (buffer && (checkLength = this.isCompleteRequest(buffer))) {
          let requestBuffer = null
          if (checkLength === buffer.length) {
            requestBuffer = buffer
            buffer = null
          } else {
            requestBuffer = buffer.slice(0, checkLength)
            buffer = buffer.slice(checkLength)
          }

          const request = this.decodeRequest(requestBuffer)

          cb(
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

// module.exports = RPC
export default RPC
