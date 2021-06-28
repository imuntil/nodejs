import Server from '../../../lib/dataServer'
import protobuf from 'protocol-buffers'
import fs from 'fs'
import data from '../../detail/__server/mock'

const schema = protobuf(fs.readFileSync(`${__dirname}/../proto/list.proto`))
const server = new Server(schema.ListRequest, schema.ListResponse)

server
  .createServer((req, res) => {
    const { sortType, filtType } = req.body

    res.end({
      columns: data
        .sort((a, b) => {
          if (sortType == 1) {
            return a.id - b.id
          } else if (sortType == 2) {
            return a.sub_count - b.sub_count
          } else if (sortType == 3) {
            return a.column_price - b.column_price
          }
        })
        .filter((item) => {
          if (filtType == 0) {
            return item
          } else {
            return item.type == filtType
          }
        }),
    })
  })
  .listen(4004, () => {
    console.log('the list server run an 4004')
  })
