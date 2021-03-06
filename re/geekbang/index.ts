import koa from 'koa'
import mount from 'koa-mount'
import bodyParser from 'koa-bodyparser'
import { URL } from 'url'

import downloadService from './routes/download'
import detailService from './routes/detail'
import playService from './routes/play'
import listService from './routes/list'

import apiService from './api'

const app = new koa()
app.use(bodyParser())

const paths = ['/download', '/detail', '/play']
app.use(async (ctx, next) => {
  const url = new URL(ctx.href)
  // console.log(`url.pathname`, url.pathname)
  if (paths.indexOf(url.pathname) > -1) {
    url.pathname += '/'
    ctx.redirect(url.toString())
    return
  }
  await next()
})

app.use(mount('/detail', detailService))
app.use(mount('/download', downloadService))
app.use(mount('/play', playService))
app.use(mount('/list', listService))

app.use(mount('/api', apiService))

app.listen(3000, () => {
  console.log('server listened 3000')
})
