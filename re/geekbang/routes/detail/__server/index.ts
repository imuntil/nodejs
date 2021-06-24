import Server from '../../../lib/dataServer'
import protobuf from 'protocol-buffers'
import fs from 'fs'
import data from './mock'

const schema = protobuf(fs.readFileSync(`${__dirname}/../proto/detail.proto`))

const server = new Server(schema.ColumnRequest, schema.ColumnResponse)

server
  .createServer((req, res) => {
    const columnid = req.body

    res.end({
      column: data[0],
      recommendColumns: data.slice(0, 3),
    })
  })
  .listen(4000, () => {
    console.log('detail data server listened on 4000')
  })
