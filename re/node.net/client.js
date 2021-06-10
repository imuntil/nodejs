const net = require('net');

const socket = new net.Socket({});

socket.connect({
  host: '127.0.0.1',
  port: 4000,
});

// socket.write('hello world');

const lessonids = [
  '136797',
  '136798',
  '136799',
  '136800',
  '136801',
  '136803',
  '136804',
  '136806',
  '136807',
  '136808',
  '136809',
  '141994',
  '143517',
  '143557',
  '143564',
  '143644',
  '146470',
  '146569',
  '146582',
];

let seq = 0;

const sendReq = () => {
  const buffer = Buffer.alloc(6);
  const lid = lessonids[Math.floor(Math.random() * lessonids.length)];
  buffer.writeInt32BE(lid);
  buffer.writeInt16BE(seq, 4);
  socket.write(buffer);
  console.log(`client side: seq, lid`, seq, lid);
  seq++;
};
// sendReq();

socket.on('data', (buffer) => {
  const idBuffer = buffer.slice(0, 4);
  const seqBuffer = buffer.slice(4, 6);
  const conentBuffer = buffer.slice(6);
  console.log(
    `seq, id, buffer.toString()`,
    seqBuffer.readUInt16BE(),
    idBuffer.readInt32BE(),
    conentBuffer.toString()
  );
  // sendReq();
});

setInterval(() => {
  sendReq();
}, 50);
