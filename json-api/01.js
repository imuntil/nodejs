/**
 * Created by 斌 on 2017/3/8.
 */
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type':'application/json'});
    res.end('{"name":"jack","age":"11",}');
}).listen(3000, '127.0.0.1');