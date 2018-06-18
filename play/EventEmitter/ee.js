const util = require('util')
const EventEmitter = require('events').EventEmitter
const fs = require('fs')

// function InputChecker(name, file) { this.name = name this.writeStream =
// fs.createWriteStream(`./${file}.txt`, {   flags: 'a',   encoding: 'utf8',
// mode: 0666 }) }

class InputChecker {
  constructor(name, file) {
    this.name = name
    this.writeStream = fs.createWriteStream(`./${file}.txt`, {
      flags: 'a',
      encoding: 'utf8',
      mode: 0o666
    })
  }

  check(input) {
    const command = input
      .toString()
      .trim()
      .slice(0, 3)
    if (command === 'wr:') {
      this.emit('write', input.slice(3))
    } else if (command === 'en:') {
      this.emit('end')
    } else {
      this.emit('echo', input)
    }
  }

  static say () {
    // x
  }
}

util.inherits(InputChecker, EventEmitter)

// InputChecker.prototype.check = function (input) {   const command = input
// .toString()     .trim()     .slice(0, 3)   if (command === 'wr:') {
// this.emit('write', input.slice(3))   } else if (command === 'en:') {
// this.emit('end')   } else {     this.emit('echo', input)   } }

const ic = new InputChecker('zhin', 'output2')

ic.on('write', function (data) {
  this
    .writeStream
    .write(data, 'utf8')
})

ic.on('end', () => {
  process.exit()
})

ic.on('echo', function (data) {
  console.log(this.name + ' wrote ' + data)
})

// global.xx = 123 ic.on('echo', xx => {   console.log(xx) })

process
  .stdin
  .resume()
process
  .stdin
  .setEncoding('utf8')
process
  .stdin
  .on('data', input => {
    ic.check(input)
  })
