import koa from 'koa'
import mount from 'koa-mount'

import downloadService from './routes/download'

const app = new koa()

const paths = ['/download']
app.use(async (ctx, next) => {
  if (paths.indexOf(ctx.url) > -1) {
    ctx.redirect(ctx.url + '/')
    return
  }
  await next()
})

app.use(mount('/download', downloadService))

app.listen(3000, () => {
  console.log('server listened 3000')
})
