process.on('message', (msg: string) => {
  console.log(`xxx msg`, msg)

  process.send({ name: 'xxx', value: 123 })
})
