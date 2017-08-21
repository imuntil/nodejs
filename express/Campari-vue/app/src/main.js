// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VeeValidate from 'vee-validate'

import App from './App'
import {router} from './router/index'
import {currency, formatPhone} from './lib/custom-filter'
import store from './store/index'

import { ToastPlugin, AlertPlugin, ConfirmPlugin } from 'vux'
import { InfiniteScroll } from 'mint-ui'

import './lib/some-other'
import 'animate.css'
import 'mint-ui/lib/palette-button/style.css'

Vue.use(VeeValidate)
Vue.use(VueRouter)
Vue.use(VueResource)

Vue.use(InfiniteScroll)
Vue.use(ToastPlugin)
Vue.use(AlertPlugin)
Vue.use(ConfirmPlugin)

Vue.filter('currency', currency)
Vue.filter('phone', formatPhone)

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app-box')

