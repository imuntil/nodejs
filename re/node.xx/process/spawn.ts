// const { spawn } = require('child_process')
import cp from 'child_process'
const ls = cp.spawn('ls', ['-lh', '/usr'])

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`)
})

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`)
})

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})
