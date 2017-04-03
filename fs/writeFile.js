/**
 * Created by 斌 on 2017/2/19.
 */
var fs = require('fs');
console.log('准备写入文件');
fs.writeFile('input.txt', '我是通过写入的文件内容', function (err) {
    if (err) {
        return console.error(err);
    }
    console.log('写入数据成功');
    console.log('---------------------xxxx-------------');
    console.log('读取写入数据');
    fs.readFile('input.txt', function (err, data) {
        if (err) {
            return console.error(err);
        }
        console.log('异步读取文件数据：' + data.toString());
    });
});