const execfile = require('child_process').execFile
const child = execfile('./exec.js', (err, stdout, stderr) => {
  console.log('err:', err)
  console.log('stdout:', stdout)
  console.log('stderr:', stderr)
})