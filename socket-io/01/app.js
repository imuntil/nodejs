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

var io = require('socket.io')(server, {
  // 提供socket.js给前端
  serveClient: true
});
const ns = io.of('/namespace1')
var count = 0;
let sid = null
ns.on('connection', function (socket) {
  console.log('socket.id:', socket.id);
  console.log('"namespace1" connected');

  socket.on('ns-msg', msg => {
    // 发给所有在namespace1中的客户端
    io.of('/namespace1').emit('ns-msg', msg)
  })

});

io.sockets.on('connection', function (socket) {
  console.log('io connected, and socket.id is ' + socket.id);
  count ++;
  io.emit('users', {number: count});
  sid = socket.id

  let room = 'odd'
  if (count % 2 === 0) {
    room = 'even'
  }
  socket.join(room)

  // 仅发给sender
  socket.on('to-self', msg => {
    socket.emit('msg', msg)
  })
  // 发给除了sender以外的客户端
  socket.on('to-others', msg => {
    socket.broadcast.emit('msg', msg)
  })
  // 发给在odd中除了自己以外的所有客户端
  socket.on('to-others-odd', msg => {
    socket.to('odd').emit('msg', msg)
  })
  // 发给在even或odd中除了自己以外的所有客户端
  socket.on('to-others-odd-even', msg => {
    socket.in('odd').to('even').emit('msg', msg)
  })
  // 发给所有在even中的客户端(包括自己)
  socket.on('to-all-even', msg => {
    io.to('even').emit('msg', msg)
  })
  // 发给指定的socket id客户端
  socket.on('to-one', msg => {
    socket.to(sid).emit('msg', `发给指定的socket id为"${sid}"客户端`)
  })

  // with acknowledgement
  socket.on('acknowledgement', msg => {
    socket.emit('msg', 'how are you?', ans => {
      console.log(ans)
    })
  })
  // 不压缩数据包
  socket.on('uncompressed', msg => {
    socket.compress(false).emit('msg', msg)
  })
  // (server)发送一个可能被丢弃的消息
  socket.on('volatile', msg => {
    socket.volatile.emit('msg', msg)
  })

  socket.on('disconnect', function () {
    console.log('User disconnected');
    count --;
    socket.broadcast.emit('users', {number: count});
  });
})