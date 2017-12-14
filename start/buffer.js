// const buf = Buffer.from('runoob', 'ascii')
// console.log(buf.toString('hex'))
// console.log(buf.toString('base64'))
// const buf3 = Buffer.alloc(256)
// const len = buf3.write('lalalala')
// console.log(buf3.toString('ascii'));
// console.log(buf3.toString('utf8'));
// console.log(buf3.length);
// console.log(len);
// const buf2 = Buffer.from([1,2,3])
// console.log(buf2.toJSON());
// const buf4 = Buffer.from('啦啦啦')
// console.log(buf4.toString('ascii'));
// console.log(buf4.toString('utf8'));
// const buf5 = Buffer.concat([buf3, buf4])
// console.log(buf5.toString());
// const buf6 = Buffer.from(('keke'))
// const buf7 = Buffer.from(('xixi'))
// const buf8 = Buffer.concat([buf6, buf7])
// console.log(buf8.toString());
// console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxx');
// buf7.copy(buf6, 2)
// console.log(buf6.toString());
// buf7.copy(buf3, len)
// console.log(buf3.toString());

const buf1 = Buffer.allocUnsafe(26)
const buf2 = Buffer.allocUnsafe(26).fill('!')
for (let i = 0; i < 26; i++) {
  buf1[i] =i + 97;
}
buf1.copy(buf2, 8, 2, 4)
console.log(buf2.toString());
buf1.copy(buf1, 4, 0, 4)
console.log(buf1.toString());

const buf3 = Buffer.allocUnsafe(100)
console.log(buf3);
const buf3f = buf3.fill(0)
console.log(buf3f);

console.log(Buffer.alloc(5));
console.log(Buffer.alloc(5, 'a'));
console.log(Buffer.alloc(6, '好', 'utf8'));
console.log(Buffer.poolSize);
console.time('a')
Buffer.alloc(5000)
console.timeEnd('a')
console.time('b')
Buffer.allocUnsafe(5000)
console.timeEnd('b')
console.log(Buffer.from('号').length);
console.log(Buffer.from('あ').length);

const str = '你好啊'
console.log(str.length);
console.log(Buffer.byteLength(str, 'utf8'));
console.log(Buffer.compare(Buffer.from('123'), Buffer.from('234')));

const buf4 = Buffer.concat([Buffer.alloc(10), Buffer.alloc(22)])
console.log(buf4.length);

// http://nodejs.cn/api/buffer.html#buffer_class_method_buffer_from_arraybuffer_byteoffset_length