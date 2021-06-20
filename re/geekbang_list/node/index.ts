import * as koa from 'koa'
import * as mount from 'koa-mount'
import * as statics from 'koa-static'
import ReactDOMServer from 'react-dom/server'
import babelRegister from '@babel/register'

import App from './app'
import template from './template'
import getData from './get-data'

babelRegister({ presets: ['react'] })

const tpl = template(__dirname + '/index.htm')
const app = new koa()

app.use(mount('/static', statics(__dirname, '/source')))
app.use(
  mount('/data', async (ctx) => {
    const { sort = 0, filt = 0 } = ctx.query
    ctx.body = await getData(+sort, +filt)
  })
)

app.use(async (ctx) => {
  ctx.status = 200
  const { filt = 0, sort = 0 } = ctx.query
  const data = await getData(+sort, +filt)

  ctx.body = tpl({
    reactString: ReactDOMServer.renderToString(App(data as any[])),
    reactData: data,
    filtType: +filt,
    sortType: +sort,
  })
})

app.listen(3000, () => {
  console.log('client run at 3000')
})

export default app
