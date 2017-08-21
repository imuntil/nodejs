var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var index = require('./routes/index');
//var users = require('./routes/users');
var register = require('./routes/register');

var app = express();

var http = require('http').Server(app);
var io = require('socket.io')(http);

var router = express.Router();
var port = process.env.PORT || 23333;
// save user's nickname
var nicknames = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'html');
//app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/', index);
//app.use('/users', users);
app.use('/register', register);


io.on('connection', function (socket) {
  console.log('一个新连接');
  socket.emit('welcome', {text:'hello, user'});
  socket.on('nickname', function (data, callback) {

    data = data.replace(/(^\s*)|(\s*$)/g,"");
    if (data && data.length) {

      if (nicknames.indexOf(data) > -1) {
        console.log('nickname has been used');
        callback(false);
      } else {
        console.log('server received new user ' + data);

        callback(true);
        nicknames.push(data);
        socket.nickname = data;
        console.log(nicknames);

        io.sockets.emit('pull-nicknames', {
            nicknames:nicknames,
            _in:true,
            changeChatter: data
        });
        // socket.broadcast.emit('pull-nicknames', nicknames);
        // socket.emit('pull-nicknames', nicknames);

      }
    } else {
      console.log('error:nickname is empty');
      callback(0)
    }


  });
  socket.on('disconnect', function () {
    if (!socket.nickname) {return;}
    if (nicknames.indexOf(socket.nickname) > -1) {
      nicknames.splice(nicknames.indexOf(socket.nickname), 1);
      console.log(nicknames);

      io.sockets.emit('pull-nicknames', {
          nicknames:nicknames,
          _in:false,
          changeChatter:socket.nickname
      });
      // socket.broadcast.emit('pull-nicknames', nicknames);
      // socket.emit('pull-nicknames', nicknames);
    }
  });

  socket.on('chatting-content', function (data) {
      io.sockets.emit('chatting-content', {
          nick: socket.nickname,
          message: data
      });
  });

});


http.listen(port, function () {
  console.log('正在监听8080端口');
});
app.use('/', router);

router.get('/', function (req, res, next) {
  res.render('index', {title:'Express & Socket.io'});
});
router.get('/user/:pageIndex', function (req, res, next) {
  res.render('user', {title:'Express & Socket.io'});
  console.log('get in');
  var index = req.params.pageIndex;
  io.sockets.emit('change', {pageIndex: index});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
