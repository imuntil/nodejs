var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var cookieSession = require('cookie-session');
var Task = require('Task');

var index = require('./routes/index');
var users = require('./routes/users');
var tasks = require('./routes/tasks');
var newTask = require('./routes/new');
var edit = require('./routes/edit');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({ secret:'OZhCLfxlGp9TtzSXmJtq' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method;
    delete req.body._method;
    return method
  }
}));

app.use('/', index);
//app.use('/users', users);
app.use('/tasks', tasks);
app.use('/tasks/new', newTask);
app.use('/tasks/', edit);

app.post('/tasks', function (req, res) {
  //console.log(req.body);
  //console.log({task:req.body.task});
  //var task = new Task({task:req.body.task});
  var task = new Task(req.body);

  task.save(function (err) {
    if (!err) {
      flash = {info: 'Task created'};
      res.redirect('/tasks');
    } else {
      flash = {warning: err};
      res.redirect('/tasks/new')
    }
  });
});

app.delete('/tasks/:id', function (req, res, next) {
  Task.findById(req.params.id, function (err, doc) {
    if (!doc) {
      return next(new NotFound('Document not found!'));
    }
    doc.remove(function () {
      flash = {info: 'Task deleted'};
      res.redirect('/tasks');
    });
  });
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

mongoose.connect('mongodb://localhost:27017/todo_development', function (error) {
  if (!error) {
    console.log('connected to mongodb');
  } else {
    throw error;
  }
});
mongoose.connection.on('connected', function(){
  console.log('Connection success!');
});
mongoose.connection.on('error', function(err){
  console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Connection disconnected');
});

module.exports = app;
