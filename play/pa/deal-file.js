const fs = require('fs')

fs.readFile('./magnet.txt', 'utf8', (err, data) => {
  const db = data
    .slice(1, -1)
    .replace(/\}\]\[\{/g, '}___{')
    .replace(/\},\{/g, '}___{')
    .split('___')
    .reverse()
  fs.writeFile('db.txt', db.join(''), err => {
    if (err) {
      console.log(err)
      return
    }
    console.log('success')
  })
})