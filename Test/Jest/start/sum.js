function sum (a, b) {
  return a + b
}

function forEach(items, cb) {
  for (let index = 0; index < items.length; index++) {
    cb(items[index])
  }
}

const filterTestFn = jest.fn()
filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false)
console.log(filterTestFn())
console.log(filterTestFn())
const result = [11, 12].filter(filterTestFn)
console.log(result)

const myMockFn = jest
  .fn(() => 'default')
  .mockImplementationOnce(() => 'first call')
  .mockImplementationOnce(() => 'second call')

console.log(myMockFn(), myMockFn(), myMockFn())

const mm = jest
  .fn()
  .mockReturnValue('default')
  .mockImplementation(scalar => 42 + scalar)
  .mockName('add42')

console.log(mm(1), mm(2), mm(3))

exports.sum = sum
exports.forEach = forEach
