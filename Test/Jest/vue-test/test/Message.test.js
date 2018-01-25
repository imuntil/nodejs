import Message from '../src/components/Message.vue'
import { mount } from 'vue-test-utils'

describe('Message.test.js', () => {
  // let cmp
  const createCmp = propsData => mount(Message, { propsData })
  describe('Properties', () => {
    it('has a message property', () => {
      const cmp = createCmp({ message: 'hey' })
      expect(cmp.props('message', 'hey')).toBeTruthy()
    })
    it('has no cat property', () => {
      const cmp = createCmp({ cat: 'key' })
      expect(cmp.props('cat', 'hey')).toBeTruthy()
    })
    it('Zhin is the defalut author', () => {
      const cmp = createCmp({ message: 'key' })
      expect(cmp.props('author', 'Zhin')).toBeTruthy()
    })
    // it('message is of type string', () => {
    //   const spy = jest.spyOn(console, 'error')
    //   const cmp = createCmp({ message: 1 })
    //   expect(spy).toBeCalledWith(
    //     expect.stringContaining('[Vue warn]: Invalid prop')
    //   )
    //   spy.mockReset()
    // })
    describe('Validation', () => {
      const message = createCmp().vm.$options.props.message
      it('message is of type string', () => {
        expect(message.type).toBe(String)
      })
    })
  })
})
