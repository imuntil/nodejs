import * as Koa from 'koa'
import * as logger from 'koa-logger'
import * as bodyParser from 'koa-bodyparser'
import index from './routes/index'

const app = new Koa()
app.use(bodyParser({
	enableTypes: ['json', 'form', 'text']
}))
app.use(logger())
app.use(index.routes())

app.listen(3000)
