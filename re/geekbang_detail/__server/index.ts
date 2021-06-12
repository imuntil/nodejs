// const Server = require('./server')
// const protobuf = require('protocol-buffers')
// const fs = require('fs')
import Server from './server'
import * as protobuf from 'protocol-buffers'
import * as fs from 'fs'

const shcema = protobuf(fs.readFileSync(__dirname + '/../detail.proto'))
const server = new Server(shcema.ColumnRequest, shcema.ColumnResponse)

import mockData from './column'

server
  .createServer((req, res) => {
    const columnid = req.body
    console.log(`xxx columnid`, columnid)

    // todo read database
    res.end({
      column: mockData[0],
      recommendColumns: mockData.slice(1, 3),
    })
  })
  .listen(4000, () => {
    console.log('the rpc server listened on port: 4000')
  })
