import { shallow, mount } from 'vue-test-utils'
import MessageList from '../src/components/MessageList.vue'

describe('MessageList.test.js', () => {
  let cmp

  beforeEach(() => {
    cmp = mount(MessageList, {
      slots: {
        default: '<div class="fake-msg"></div>'
      }
    })
  })
})