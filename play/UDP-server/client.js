const dgram = require('dgram')
const client = dgram.createSocket('udp4')

process
  .stdin
  .resume()

process
  .stdin
  .on('data', data => {
    console.log(data.toString('utf8'))
    client.send(data, 0, data.length, 8124, 'imuntil.com', (err, bytes) => {
      if (err) 
        console.log('error:' + err)
      else 
        console.log('successful')
    })
  })