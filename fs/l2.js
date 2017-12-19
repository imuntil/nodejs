const buffer = Buffer.alloc(1024)
const fs = require('fs')
const { promisify } = require('util')

console.time('async')
fs.open('message.txt', 'r+', (err, fd) => {
  if (err) throw err
  fs.read(fd, buffer, 0, buffer.length, 0, (err, bytesRead, buf) => {
    if (err) throw err
    console.log(bytesRead)
    console.log(buf.toString());
    console.timeEnd('async')
  })
})

promisify(fs.open)('input.txt', 'r+')
  .then(async fd => {
    const { bytesRead, buffer } = await promisify(fs.read)(fd, Buffer.alloc(1024), 0, 1024, 0)
    console.log(bytesRead)
    console.log(buffer.toString('utf-8'));
    // await promisify(fs.appendFile)(fd, buffer)
    await promisify(fs.write)(fd, buffer, 0, buffer.length, 0)
    // const res = await promisify(fs.access)('new.txt')
    // console.log('access:', res);
    await promisify(fs.writeFile)('new.txt', 'lalalalala')
    await promisify(fs.close)
  })
  .catch(e => {
    console.log(e)
  })

promisify(fs.readFile)('message.txt')
  .then(data => {
    console.log(data.toString())
  })
  .catch(err => {
    console.log(err);
  })

promisify(fs.realpath)('message.txt')
  .then(link => {
    console.log('link:', link)
  })
  .catch(err => {
    console.log('err:', err);
  })