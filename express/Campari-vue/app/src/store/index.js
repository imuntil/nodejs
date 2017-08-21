/**
 * Created by 斌 on 2017/4/19.
 */
import Vue from 'vue'
import Vuex from 'vuex'

import loading from './modules/loading'
import user from './modules/user'
import cart from './modules/cart'
import address from './modules/address'
import order from './modules/order'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    loading,
    user,
    cart,
    address,
    order
  }
})
