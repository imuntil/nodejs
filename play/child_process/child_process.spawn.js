const spawn = require('child_process').spawn
const pwd = spawn('pwd')

pwd
  .stdout
  .on('data', data => console.log('stdout:', data))
pwd
  .stderr
  .on('data', data => console.log('err:', data))
pwd.on('exit', code => {
  console.log('child process exited with code' + code)
})