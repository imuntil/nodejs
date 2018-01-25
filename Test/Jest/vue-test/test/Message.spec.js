import Message from '../src/components/Message.vue'
import { mount } from 'vue-test-utils'

describe('Message.test.js', () => {
  let cmp
  const createCmp = propsData => mount(Message, { propsData })
  describe('Events', () => {
    beforeEach(() => {
      cmp = createCmp({ message: 'Cat' })
    })
    it ('call handleClick when click on message', () => {
      // const spy = spyOn(cmp.vm, 'handleClick')
      // cmp.update()
      // const el = cmp.find('.message').trigger('click')
      // expect(cmp.vm.handleClick).toBeCalled()

      // cmp.vm.handleClick = jest.fn()
      // cmp.update()
      // const el = cmp.find('.message').trigger('click')
      // expect(cmp.vm.handleClick).toBeCalled()

      const stub = jest.fn()
      cmp.setMethods({ handleClick: stub })
      const el = cmp.find('.message').trigger('click')
      expect(stub).toBeCalled()
    })
  
    it('triggers a message-clicked event when a handClick method is called', () => {
      const stub = jest.fn()
      cmp.vm.$on('message-clicked', stub)
      cmp.vm.handleClick()
      
      expect(stub).toBeCalledWith('Cat')
    })
  })
})