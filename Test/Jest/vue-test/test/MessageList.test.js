import Vue from 'vue'
import { shallow, mount } from 'vue-test-utils'
import MessageList from '../src/components/MessageList.vue'
import Message from '../src/components/Message.vue'

describe('MessageList.test.js', () => {
  let cmp

  beforeEach(() => {
    const messageWrapper = {
      render (h) {
        return h(Message, { props: { message: 'hey' } })
      }
    }
    cmp = mount(MessageList, {
      slots: {
        default: messageWrapper
      }
    })
  })

  it('Messages are inserted in a ul.list-messages element', () => {
    expect(cmp.is('ul.list-messages')).toBe(true)
    // expect(cmp.find(MessageList).isVueInstance()).toBe(true)
    expect(cmp.is(MessageList)).toBe(true)
    expect(cmp.find(Message).isVueInstance()).toBe(true)
    // expect(cmp.contains(Message)).toBe(true)
    // expect(cmp.contains(MessageList)).toBe(true)
  })
})