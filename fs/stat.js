/**
 * Created by 斌 on 2017/2/19.
 */
var fs = require('fs');
console.log('准备打开文件');
fs.stat('../start/input.txt', function (err, stats) {
    if (err) {
        return console.error(err);
    }
    console.log(stats);
    console.log('读取文件信息');

    console.log('isFile?' + stats.isFile());
    console.log('isDirectory?' + stats.isDirectory());
});