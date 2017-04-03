/**
 * Created by 斌 on 2017/2/18.
 */
var fs = require('fs');
var data = '';

var readerStream = fs.createReadStream('input.txt');
readerStream.setEncoding = 'UTF8';

readerStream.on('data', function (chunk) {
    console.log(chunk.toString());
    data += chunk;
});

readerStream.on('end', function () {
    console.log(data);
});

readerStream.on('error', function (error) {
    console.log(error.stack);
});

console.log('程序执行完毕');


