const fs = require('fs')
fs.appendFile('message.txt', 'data to append', err => {
  if (err) throw err;
  console.log('success');
})
try {
  console.time('t1')
  fs.appendFileSync('message.txt', '\nother data to append')
  console.timeEnd('t1')
  console.log('scs')
} catch (e) {
  console.log(e);
  throw e
}

console.log(fs.constants);

fs.copyFile('message.txt', 'copy.txt', fs.constants.COPYFILE_EXCL, err => {
  if (err) throw err
  console.log('copy success');
})

fs.watch('input.txt', (eventType, filename) => {
  console.log(eventType);
  console.log(filename);
})