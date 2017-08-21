/**
 * Created by 斌 on 2017/5/5.
 */
import * as type from '../../lib/constant'
import { cart } from '../../lib/services'
import _ from 'lodash'

export default {
  state: {
    cart: [],
    //  数据库的原因，导致查询cart返回的其实只有商品的sku，count，chosen三个数据，其他的商品信息需要再去查询product表，
    //  而再向cart中添加商品的时候，会不不知道时添加商品还是增加商品的情况，导致前台不方便更新store的cart数据。
    //  因而增加needUpdate变量，当向cart中添加商品成功后，将needUpdate设为true。并在下次强制从server fetch cart,
    //  fetch之后再将值设置为false
    needUpdate: false,
    //  立即购买
    buyNow: {}
  },
  mutations: {
    [type.CART_SET_CART_M] (state, cart) {
      state.cart = cart
    },
    [type.CART_UPDATE_CART] (state, payload) {
      if (_.isNumber(payload)) {
        state.cart.splice(payload, 1)
        return
      }
      let updator = state.cart[payload.index]
      if (payload.by !== undefined) {
        updator.count += payload.by
      } else {
        updator.chosen = payload.chosen
      }
    },
    [type.CART_NEED_UPDATE_M] (state, update) {
      state.needUpdate = update
    },
    [type.CART_CHOOSE_ALL] (state, payload) {
      _.forEach(state.cart, item => {
        item.chosen = payload
      })
    },
    [type.CART_DELETE_ALL] (state) {
      state.cart = []
    },
    [type.CART_ADD_BUY_NOW] (state, payload) {
      state.buyNow = payload
    },
    [type.CART_UPDATE_BUY_NOW] (state, payload) {
      state.buyNow = _.assign(state.buyNow, {count: payload})
    }
  },
  actions: {
    //  获取购物车
    [type.CART_FETCH_CART_A] (context, params) {
      //  获取购物车数据
      return cart.fetchCart(params)
        .then(data => {
          console.log(data)
          if (!data.length) {
            data = [{id: 1}, {id: 2}]
          }
          context.commit(type.CART_SET_CART_M, data)
          //  fetched cart，将needUpdate设置为false
          context.commit(type.CART_NEED_UPDATE_M, false)
          return true
        })
        .catch(err => {
          console.log(err)
          return err
        })
    },
    //  向购物车中添加商品
    [type.CART_ADD_ITEM_A] (context, params) {
      //  加入购物车
      return cart.addToCart(params)
        .then(data => {
          context.commit(type.CART_NEED_UPDATE_M, true)
          return true
        })
        .catch(err => {
          console.log(err)
          return false
        })
    },
    //  修改cart中商品的选中状态
    [type.CART_CHOOSE_A] (context, params) {
      cart.updateCart(params.item)
        .then(() => {
          context.commit(type.CART_UPDATE_CART, {index: params.index, chosen: !!params.item.chosen})
          return true
        })
        .catch(err => {
          console.log(err)
        })
    },
    //  修改cart中商品的数量
    [type.CART_EDIT_COUNT_A] (context, params) {
      cart.updateCart(params.item)
        .then(() => {
          context.commit(type.CART_UPDATE_CART, {index: params.index, by: +params.item.by})
        })
        .catch(err => {
          console.log(err)
        })
    },
    //  删除购物车中的商品
    [type.CART_DELETE_ITEM_A] (context, params) {
      cart.deleteCart(params.item)
        .then(() => {
          if (params.lazy) {
            context.commit(type.CART_NEED_UPDATE_M, true)
            return
          }
          context.commit(type.CART_UPDATE_CART, +params.index)
        })
        .catch(err => {
          console.log(err)
        })
    },
    //  废弃
    [type.CART_DELETE_ALL_A] (context, params) {
      cart.deleteAllOfCart(params)
        .then(() => {
          context.commit(type.CART_DELETE_ALL)
        })
        .catch(err => {
          console.log(err)
        })
    },
    [type.CART_CHOOSE_ALL_A] (context, params) {
      cart.chooseAllOfCart(params)
        .then(() => {
          context.commit(type.CART_CHOOSE_ALL, params.payload)
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  getters: {
    //  chosen pro
    [type.CART_ALL_CHOSEN] (state) {
      return state.cart.filter(item => item.chosen)
    },
    [type.CART_THE_MONEY] (state, getters) {
      let _chosen = getters[type.CART_ALL_CHOSEN]
      if (!_chosen.length) return 0
      let _money = 0
      _.forEach(_chosen, item => {
        _money += item.price * item.count
      })
      return _money
    },
    [type.CART_IS_ALL_CHOSEN] (state, getters) {
      return (state.cart.length === getters[type.CART_ALL_CHOSEN].length) && state.cart.length > 0
    }
  }
}
