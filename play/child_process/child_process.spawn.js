// const spawn = require('child_process').spawn
// const pwd = spawn('pwd')

// pwd
//   .stdout
//   .on('data', data => console.log('stdout:', data))
// pwd
//   .stderr
//   .on('data', data => console.log('err:', data))
// pwd.on('exit', code => {
//   console.log('child process exited with code' + code)
// })


const spawn = require('child_process').spawn
const [find, grep] = [
  spawn('find', ['.', '-ls']),
  spawn('grep', ['exec.js'])
]

grep.stdout.setEncoding('utf8')

find.stdout.on('data', data => {
  grep.stdin.write(data)
})

grep.stdout.on('data', data => {
  console.log(data)
})

grep.stderr.on('data', data => {
  console.log('err:', data)
})
find.stderr.on('data', data => {
  console.log('err:', data)
})

find.on('exit', code => {
  if (code !== 0) {
    console.log('find process exited width code ' + code)
  }
  grep.stdin.end()
})

grep.on('exit', code => {
  if (code !== 0) {
    console.log(`grep process exited with code ${code}`)
  }
})

