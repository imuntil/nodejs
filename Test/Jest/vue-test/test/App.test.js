import Vue from 'vue'
import App from '../src/App'
import { shallow } from 'vue-test-utils'

// describe('App.test.js', () => {
//   let cmp, vm

//   beforeEach(() => {
//     cmp = Vue.extend(App)
//     vm = new cmp({
//       data: {
//         messages: ['Cat']
//       }
//     }).$mount()s
//   })

//   it('equals messages to ["Cat"]', () => {
//     expect(vm.messages).toEqual(['Cat'])
//   })
//   it('has the expected html structure', () => {
//     expect(vm.$el).toMatchSnapshot()
//   })
// })
describe('App.test.js', () => {
  let cmp

  beforeEach(() => {
    cmp = shallow(App, {
      data: {
        messages: ['Cat']
      }
    })
  })

  it('equals messages to be ["Cat"]', () => {
    expect(cmp.vm.messages).toEqual(['Cat'])
  })

  it('has the expected html structure', () => {
    expect(cmp.element).toMatchSnapshot()
  })
})