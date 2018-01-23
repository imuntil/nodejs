const { sum, forEach } = require('../sum')
test('adds 1 + 2 to equals 3', () => {
  expect(sum(1, 2)).toEqual(3)
})

test('object assigenment', () => {
  const data = { one: 1 }
  data['two'] = 2
  expect(data).toEqual({ one: 1, two: 2 })
})

test('zero', () => {
  const z = 0
  expect(z).not.toBeNull()
  expect(z).toBeDefined()
  expect(z).not.toBeUndefined()
  expect(z).not.toBeTruthy()
  expect(z).toBeFalsy()
})
test('adding floating point numbers', () => {
  const value = 0.1 + 0.2
  expect(value).not.toBe(0.3)
  expect(value).toBeCloseTo(0.3)
})

test('mock', () => {
  const mockCb = jest.fn()
  forEach([0, 1], mockCb)
  expect(mockCb.mock.calls.length).toBe(2)
})