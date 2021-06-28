import koa, { Context } from 'koa'
import mount from 'koa-mount'
import statics from 'koa-static'
import ReactDOMServer from 'react-dom/server'
import babelRegister from '@babel/register'

import App from './app'
import template from './template'
import getData from './getData'

babelRegister({ presets: ['react'] })

const tpl = template(`${__dirname}/index.htm`)
const app = new koa()

app.use(mount('/static', statics(`${__dirname}/source`)))
app.use(
  mount<any, Context>('/data', async (ctx) => {
    const { sort = 0, filt = 0 } = ctx.query
    ctx.body = await getData(+sort, +filt)
  })
)

app.use(
  mount<any, Context>('/', async (ctx) => {
    ctx.status = 200
    const { filt = 0, sort = 0 } = ctx.query
    const data = await getData(+sort, +filt)
    const columns = (data as any).columns as any[]

    // console.log(`Array.isArray(data.columns)`, Array.isArray((data as any).columns))

    ctx.body = tpl({
      reactString: ReactDOMServer.renderToString(App(columns)),
      reactData: columns,
      filtType: +filt,
      sortType: +sort,
    })
  })
)

export default app
