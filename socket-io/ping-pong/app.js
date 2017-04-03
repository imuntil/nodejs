/**
 * Created by 斌 on 2017/2/28.
 */
var http = require('http'),
    fs = require('fs');

var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', function (err, data) {
        res.writeHead(200, {'Content-Type':'text/html'});
        res.end(data, 'utf-8');
    });
}).listen(3000, '127.0.0.1');

var io = require('socket.io').listen(server);

var time;
io.sockets.on('connection', function (socket) {
    socket.on('ping-from-client', function (data) {
        console.log('server received ping, sending pong..');
        socket.emit('pong-from-server', {text: 'pongggg'});
    });
    socket.on('pong-from-client', function (data) {
        console.log('server received pong, record pong..');
    });

    if (time) {
        clearInterval(time);
    }
    time = setInterval(function () {
        console.log('server send ping to client..');
        socket.emit('ping-from-server', {text:'pinggggg'});
    }, 10*1000);
});