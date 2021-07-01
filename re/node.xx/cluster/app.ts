import fs from 'fs'
import http from 'http'

const server = http
  .createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.end(fs.readFileSync(__dirname + '/index.htm', 'utf-8'))
  })
  .listen(3000, () => {
    console.log('server runing at 3000')
  })

export default server
