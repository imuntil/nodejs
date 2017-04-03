/**
 * Created by 斌 on 2017/2/19.
 */
var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Hello World');
});

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('应用实例，访问地址 http://%s:%s', host, port);
});