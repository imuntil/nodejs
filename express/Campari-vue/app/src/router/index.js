import Vue from 'vue'
import Router from 'vue-router'
// import Hello from '@/components/Hello'
// import Layout from '@/layout/Layout'
import Home from '@/pages/Home'
import {UPDATE_LOADING_STATUS, DESTINATION, USER_CHECK_LOGIN_A} from '../lib/constant'
import store from '../store/index'

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    { path: '', name: 'index', component: Home },
    { path: '/home', name: 'home', component: Home },
    { path: '/products', name: 'products', component () { return System.import('@/pages/Products') } },
    { path: '/products2', name: 'products2', component () { return System.import('@/pages/Products2') } },
    { path: '/cocktail', name: 'cocktail', component () { return System.import('@/pages/Cocktail') } },
    { path: '/cart', name: 'cart', component () { return System.import('@/pages/Cart.vue') } },
    { path: '/order/list', name: 'order-list', component () { return System.import('@/pages/order/Order-list') } },
    { path: '/order/my-order', name: 'my-order', component () { return System.import('@/pages/order/My-order') } },
    { path: '/order/detail/:on', name: 'order-detail', component () { return System.import('@/pages/order/Order-detail') } },
    { path: '/order/:from?', name: 'order', component () { return System.import('@/pages/Order.vue') } },
    { path: '/detail/:sku', name: 'detail', component () { return System.import('@/pages/Detail') } },
    { path: '/login', name: 'login', component () { return System.import('@/pages/Login') } },
    { path: '/register', name: 'register', component () { return System.import('@/pages/Register') } },
    { path: '/register2', name: 'register2', component () { return System.import('@/pages/Register-2') } },
    { path: '/user', name: 'user', component () { return System.import('@/pages/User') } },
    { path: '/safe', name: 'safe', component () { return System.import('@/pages/safe/Safe') } },
    { path: '/safe/modify-password', name: 'mp', component () { return System.import('@/pages/safe/Modify-password') } },
    { path: '/safe/forget', name: 'forget', component () { return System.import('@/pages/safe/Forget') } },
    { path: '/address', name: 'address', component () { return System.import('@/pages/address/Address') } },
    { path: '/address/edit/:index?', name: 'edit-adr', component () { return System.import('@/pages/address/Edit-address') } }
  ]
})

const needLoginPage = [
  'user',
  'cart',
  'safe',
  'mp',
  'address',
  'edit-adr',
  'order',
  'my-order',
  'order-detail'
]

router.beforeEach((to, from, next) => {
  store.commit(UPDATE_LOADING_STATUS, {isLoading: true})
  console.log(to.name)
  if (needLoginPage.indexOf(to.name) > -1) {
    store.dispatch(USER_CHECK_LOGIN_A)
      .then(auto => {
        if (!auto) {
          store.commit(DESTINATION, {name: to.name})
          next({name: 'login'})
          return
        }
        next()
      })
      .catch(() => {
        store.commit(DESTINATION, {name: to.name})
        next({name: 'login'})
      })
    return
  }
  next()
})
router.afterEach((to, from, next) => {
  store.commit(UPDATE_LOADING_STATUS, {isLoading: false})
})

export {router}
