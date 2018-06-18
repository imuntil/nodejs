const http = require('http')
const path = require('path')
const fs = require('fs')
// console.log(__dirname)

http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html')
  res.statusCode = 200

  const file = fs.createReadStream('./index.html')
  res.setHeader('Content-Type', 'text/html')
  res.statusCode = 200
  file.on('open', () => {
    file.pipe(res)
  })
  file.on('error', (err) => {
    res.end('not found')
  })
}).listen(8124)

console.log('Server running at 8124')