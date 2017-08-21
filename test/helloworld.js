/**
 * Created by 斌 on 2017/4/18.
 */
var http = require('http')
var server = http.createServer(function (request, response) {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello zhinner\n')
});
server.listen(3032)
