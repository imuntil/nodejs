import cp from 'child_process'
const child_process = cp.fork(__dirname + '/child.ts')

child_process.on('message', (msg: any) => {
  console.log('msg from child process:', msg)
})

child_process.send('msg from main process')
