const net = require('net')

const client = new net.Socket()
client.setEncoding('utf8')

client.connect('8124', 'localhost', () => {
  console.log('connected to server')

  client.write('Who needs a browser to communicate?')
})

process.stdin.resume()

process.stdin.on('data', data => {
  client.write(data)
})

client.on('data', data => {
  console.log(data)
})

client.on('close', () => console.log('connection is closed'))