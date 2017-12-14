const buffer = new ArrayBuffer(12)
const x = new Int32Array(buffer)
console.log(x.length);
x[1] = 1234
const slice = buffer.slice(4)
const y = new Int32Array(slice)
console.log(x);
console.log(x[1]);
console.log(y[0]);
x[1] = 2345
console.log(x[1]);
console.log(y[0]);

const t = new Int8Array(2)
t[0] = 11111111
console.log(t);

const bf2 = new ArrayBuffer(12)
const i = new Float32Array(bf2, 0, 2)
console.log(i.byteLength);
