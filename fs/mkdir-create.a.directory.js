/**
 * Created by 斌 on 2017/2/19.
 */
var fs = require('fs');
console.log('创建目录 ./tmp');

fs.mkdir('./tmp', function (error) {
    if (error) {
        return console.error(error);
    }
    console.log('目录创建成功');
});

fs.readdir('../fs', function (err, files) {
    if (err) {
        return console.error(err);
    }
    files.forEach(function (file) {
        console.log(file);
    });
});