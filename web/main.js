/**
 * Created by 斌 on 2017/2/19.
 */
var http = require('http');
var url = require('url');
var fs = require('fs');

http.createServer(function (request, response) {
    var pathname = url.parse(request.url).pathname;

    console.log('Request for ' + pathname + ' received');

    fs.readFile(pathname.substr(1), function (err, data) {
        if (err) {
            console.log(err);

            response.writeHead(404, {'Content-Type': 'text/html'});
        } else {

            response.writeHead(200, {'Content-Type': 'text/html'});
            response.write(data.toString());
        }

        response.end();
    });
}).listen(8081);

console.log('Server running at http://127.0.0.1:8081/');