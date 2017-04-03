/**
 * Created by 斌 on 2017/2/18.
 */
var fs = require('fs');
fs.readFile('input.txt', function (err, data) {
    if (err) return console.error(err);
    console.log(data.toString());
});
console.log('程序执行结束');