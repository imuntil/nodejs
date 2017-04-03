/**
 * Created by 斌 on 2017/2/19.
 */
var express = require('express');
var app = express();
var res = undefined;

app.use(express.static('public'));

app.get('/index2.html', function (request, response) {
    response.sendFile(__dirname + '/' + 'index2.html');
});

app.get('/process_get', function (request, response) {

    res = {
        first_name: request.query.first_name,
        last_name: request.query.last_name
    };

    console.log(res);
    response.end(JSON.stringify(res));
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('应用实例，访问地址为 http://%s:%s', host, port);
});