const fs = require('fs')
const protobuf = require('protocol-buffers')
const schema = fs.readFileSync(__dirname + '/schema.proto', 'utf-8')

const ptb = protobuf(schema)

const buffer = ptb.Column.encode({
  id: 1,
  name: 'zhin',
  price: 100.45,
})

console.log(`buffer`, buffer)

console.log(`ptb.Column.decode(buffer)`, ptb.Column.decode(buffer))
