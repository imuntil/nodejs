/**
 * Created by 斌 on 2017/2/19.
 */
var http = require('http');

var options = {
    host:'localhost',
    port:'8081',
    path:'/index.html'
};

var callback = function (response) {
    var body = '';

    response.on('data', function (data) {
        body += data;
    });

    response.on('end', function () {
        console.log(body);
    });
};

var req = http.request(options, callback);
req.end();