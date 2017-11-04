var Koa = require('koa')
var app = new Koa()
app.use(function *(next) {
  var start = new Date()
  yield next
  var ms = new Date() - start
  this.set('X-response-Time', ms + 'ms')
})
app.use(function *() {
  this.body = 'Hello World'
})
app.listen(3000)