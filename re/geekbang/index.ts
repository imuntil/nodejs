import koa from 'koa'
import mount from 'koa-mount'
import { URL } from 'url'

import downloadService from './routes/download'
import detailService from './routes/detail'
console.log(`detailService`, detailService)
console.log(`downloadService`, downloadService)
const app = new koa()

const paths = ['/download', '/detail']
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

app.listen(3000, () => {
  console.log('server listened 3000')
})
