import Server from '../../geekbang_play/__server/server'
import * as protobuf from 'protocol-buffers'
import * as fs from 'fs'
import mockData from '../../geekbang_detail/__server/column'

const schema = protobuf(
  fs.readFileSync(__dirname + '/../node/list.proto', 'utf-8')
)
const server = new Server(schema.ListRequest, schema.ListResponse)

server
  .createServer((req, res) => {
    const { sortType, filtType } = req.body
    console.log(`xxx typeof sortType, sortType`, typeof sortType, sortType)

    res.end({
      columns: mockData
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
  .listen(4003, () => {
    console.log('the server run at 4003')
  })
