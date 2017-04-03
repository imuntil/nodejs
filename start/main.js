/**
 * Created by �� on 2017/2/18.
 */
var fs = require('fs');
var data = fs.readFileSync('input.txt');
console.log(data.toString());
console.log('程序执行结束');

console.log(__filename);