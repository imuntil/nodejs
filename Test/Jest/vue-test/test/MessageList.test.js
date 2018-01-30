import Vue from 'vue'
import { shallow, mount } from 'vue-test-utils'
import MessageList from '../src/components/MessageList.vue'
import Message from '../src/components/Message.vue'

describe('MessageList.test.js', () => {
  let cmp

  beforeEach(() => {
    const messageWrapper = {
      render (h) {
        return h(Message, { props: { message: 'hey boy' } })
      }
    }
    cmp = mount(MessageList, {
      slots: {
        default: messageWrapper
      }
    })
  })

  it('Messages are inserted in a ul.list-messages element', () => {
    expect(cmp.is('div.list-wrapper')).toBe(true)
    // expect(cmp.find(MessageList).isVueInstance()).toBe(true)
    expect(cmp.is(MessageList)).toBe(true)
    expect(cmp.find(Message).isVueInstance()).toBe(true)
    // expect(cmp.contains(Message)).toBe(true)
    // expect(cmp.contains(MessageList)).toBe(true)
  })

  it('Header slot renders a default header text', () => {
    const header = cmp.find('.list-header')
    expect(header.text().trim()).toBe('This is a default header')
  })

  it('Header slot is rendered withing .list-header', () => {
    const component = mount(MessageList, {
      slots: {
        header: '<div>What an awesome header</div>'
      }
    })
    const header = component.find('.list-header')
    expect(header.text().trim()).toBe('What an awesome header')
  })

  it('Message length is higher than 5', () => {
    const messages = cmp.findAll(Message)
    messages.wrappers.forEach(c => {
      expect(c.vm.message.length).toBeGreaterThan(5)
    });
  })
})