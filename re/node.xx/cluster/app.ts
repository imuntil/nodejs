import fs from 'fs'
import http from 'http'

const server = http
  .createServer((req, res) => {
    res.writeHead(200, { 'content-type': 'text/html' })
    setTimeout(() => {
      // 做一些错误的操作
      ;(window as any).__xx = 'xxx'
      res.end(fs.readFileSync(__dirname + '/index.htm', 'utf-8'))
    }, 100)
  })
  .listen(3000, () => {
    console.log('server runing  at 3000')
  })

export default server
