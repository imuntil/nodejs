/**
 * Created by 斌 on 2017/2/19.
 */
var os = require('os');

console.log('CPU的字节序:' + os.endianness());
console.log('操作系统：' + os.type());
console.log('操作系统：' + os.platform());
console.log('系统内存总量：' + os.totalmem()/1024/1024/1024 + ' GB');
console.log('系统空闲内存量：' + os.freemem()/1024/1024/1024 + ' GB');
