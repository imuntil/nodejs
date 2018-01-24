import { shallow, mount } from 'vue-test-utils'
import MessageList from '../src/components/MessageList.vue'

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
})