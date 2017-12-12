/**
 * Created by 斌 on 2017/2/28.
 */
var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
  fs.readFile('./index.html', function(error, data) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(data, 'utf-8');
  });
}).listen(3000);
console.log('Server running at http://127.0.0.1:3000/');

var io = require('socket.io')(server);
var count = 0;

io.sockets.on('connection', function (socket) {
  console.log('socket.id:', socket.id);
  console.log('User connected');
  count ++;
  socket.emit('users', {number: count});
  socket.broadcast.emit('users', {number: count});
  socket.on('msg', msg => {
    // io.emit('msg', msg)
    socket.emit('msg', msg)
  })
  socket.on('disconnect', function () {
    console.log('User disconnected');
    count --;
    socket.broadcast.emit('users', {number: count});
  });
});