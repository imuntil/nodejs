import http from 'http'
import { URL } from 'url'
import qs from 'querystring'
import chalk from 'chalk'

http
  .createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)

    // get
    const queryObj = qs.parse(url.searchParams.toString())
    console.log(`queryObj`, queryObj)

    res.end('ok')
  })
  .listen(3000, () => {
    console.log(chalk.green('get server run at 3000'))
  })

http
  .createServer((req, res) => {
    // post
    let body = ''
    // 根据content-type的不同，body会有差异
    console.log(chalk.bgGray(req.headers['content-type']))
    req.on('data', (thunk) => {
      body += thunk
    })

    req.on('end', () => {
      console.log(chalk.yellow('post data is:', body))
      res.end('ok')
    })
  })
  .listen(4000, () => {
    console.log(chalk.green('post server run at 4000'))
  })
