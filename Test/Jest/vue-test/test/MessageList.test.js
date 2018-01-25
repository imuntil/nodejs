import { shallow, mount } from 'vue-test-utils'
import MessageList from '../src/components/MessageList.vue'
import Message from '../src/components/Message.vue'

describe('Message.test.js', () => {
  let cmp

  beforeEach(() => {
    cmp = mount(MessageList, {
      propsData: {
        messages: ['Cat']
      }
    })
  })
  // beforeEach(() => {
  //   cmp = shallow(MessageList, {
  //     propsData: {
  //       messages: ['Cat']
  //     }
  //   })
  // })

  it('has received ["Cat"] as the message property', () => {
    expect(cmp.vm.messages).toEqual(['Cat'])
  })

  it('has the expected html structure', () => {
    expect(cmp.element).toMatchSnapshot()
  })

  it('Calls handleMessageClick when @message-click happens', () => {
    const stub = jest.fn()
    cmp.setMethods({ handleMessageClick: stub })
    cmp.update()

    cmp.find(Message).vm.$emit('message-clicked', 'cat')
    expect(stub).toBeCalledWith('cat')
  })

  it('console "cat" when handleMessageClick method is called', () => {
    const spy = jest.spyOn(console, 'log')
    // cmp.find(Message).vm.$emit('message-clicked', 'cat')    
    cmp.vm.handleMessageClick('cat')
    expect(spy).toBeCalledWith('cat')
    spy.mockReset()
  })
})