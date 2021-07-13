import http from 'http'
import zlib from 'zlib'
import chalk from 'chalk'
import path from 'path'

import fs from 'fs'

const filePath = path.resolve(__dirname, '../assets/example.html')

http
  .createServer((req, res) => {
    const acceptEncoding = req.headers['accept-encoding']
    console.log(chalk.green(acceptEncoding))

    let gzip
    if (acceptEncoding.indexOf('gzip') > -1) {
      gzip = zlib.createGzip()

      res.writeHead(200, {
        'Content-Encoding': 'gzip',
      })

      fs.createReadStream(filePath).pipe(gzip).pipe(res)
    } else {
      fs.createReadStream(filePath).pipe(res)
    }
  })
  .listen(3000, () => {
    console.log(chalk.green('server run at 3000'))
  })
