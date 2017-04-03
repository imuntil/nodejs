/**
 * Created by 斌 on 2017/2/18.
 */
buf = new Buffer(26);
for (var i = 0; i < 26; i++) {
    buf[i] = i + 97;
}

console.log(buf.toString('ascii'));
console.log(buf.toString('ascii', 0, 5));

var buf3 = new Buffer('百度一下');
var buf2 = new Buffer('www.baidu.com');
var json = buf2.toJSON(buf2);

console.log(json);
var buf4 = new Buffer('www.baidu.com');
var buf5 = Buffer.concat([buf3, buf4]);
console.log(buf5);
console.log(buf5.toString());

console.log('...........');

console.log(buf2.compare(buf3));

var b1 = new Buffer('A');
var b2 = new Buffer('B');
console.log(b1.compare(b2));
console.log(b2.compare(b1));

console.log(buf3.length);
console.log(buf2.length);

console.log('__________**__________');
var b3 = new Buffer(18);
b3.write('abcdefghijklmnopqrstuvwxyz', 0, 18, 'utf8');
console.log(b3.toString());
console.log(b3[1]);
console.log(buf.slice(0, 5).toString());