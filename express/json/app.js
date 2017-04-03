var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mongoose = require('mongoose');
var Task = require('Task');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
app.listen(8080);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
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
app.use('/users', users);

app.get('/api/v1/tasks', function (req, res, next) {
    Task.find({}, function (err, docs) {
        res.send(docs);
    });
});
app.post('/api/v1/tasks', function (req, res, nex) {
    var doc = new Task(req.body);
    doc.save(function (err) {
        if (!err) {
            res.send(doc);
        } else {
            res.send(err, 422);
        }
    });
});
// app.get('/api/v1/tasks/:id', function (req, res, next) {
//     Task.findById(req.params.id, function (err, doc) {
//         if (!err) {
//             res.send(doc);
//         } else  {
//             res.send(err, 404);
//         }
//     });
// });
app.get('/api/v1/tasks/task', function (req, res, next) {
    console.log(req.query);
    Task.findById(req.query.id, function (err, doc) {
        if (!err) {
            res.send(doc);
        } else  {
            res.send(err, 404);
        }
    });
});
app.put('/api/v1/tasks/:id', function (req, res, next) {
    Task.findById(req.params.id, function (err, doc) {
        if (!doc) {
            res.json(404);
        } else  {
            doc.updated_at = new Date();
            doc.task = req.body.task;
            doc.save(function (err) {
                if (!err) {
                    res.send(doc);
                } else {
                    res.send(err, 422);
                }
            })
        }
    });
});
app.delete('/api/v1/tasks/:id', function (req, res, next) {
    Task.findById(req.params.id, function (err, doc) {
        if (doc) {
            doc.remove(function () {
                res.send(200);
            });
        } else {
            res.json(404);
        }
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

module.exports = app;
