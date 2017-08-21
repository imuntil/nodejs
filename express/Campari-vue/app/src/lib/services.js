/**
 * Created by 斌 on 2017/3/14.
 */

import Vue from 'vue'
import config from './config'
// import _ from 'lodash'
import {AJAX_RESPONSE_CODE, AJAX_RESPONSE_RESULT, AJAX_RESPONSE_MSG} from './constant'

const __get = function (url, params, notDeal) {
  return Vue.http.get(url, {params: params})
    .then(response => {
      let data = response.body
      if (notDeal) {
        return Promise.resolve(data)
      }
      if (+data[AJAX_RESPONSE_CODE] === 1) {
        return Promise.resolve(data[AJAX_RESPONSE_RESULT])
      } else {
        return Promise.reject(data[AJAX_RESPONSE_MSG])
      }
    }, error => {
      console.info(error)
      return Promise.reject('出错了，请稍后重试')
    })
}
const __post = function (url, data) {
  return Vue.http.post(url, data)
    .then(response => {
      let data = response.body
      if (+data[AJAX_RESPONSE_CODE] === 1) {
        return Promise.resolve(data[AJAX_RESPONSE_RESULT])
      } else {
        return Promise.reject(data[AJAX_RESPONSE_MSG])
      }
    }, error => {
      console.info(error)
      return Promise.reject('出错了，请稍后重试')
    })
}

export const productAndOrder = {
  /**
   * 查询我的订单
   * @param params {Object} [flag, orderstatus]
   */
  queryOrders (params) {
    return __get(config.path + 'selectOrderStatusOdr.action', params)
  }
}

export const user = {
  /**
   * 登录
   * @param params {object} [phone, password]
   */
  signIn (params) {
    return __post(config.path + 'user/login', params)
  },
  /**
   * 获取登录状态
   */
  checkLogin () {
    return __get(config.path + 'user/login-status', {}, true)
  },
  /**
   * 注册
   * @param params {object} [nickname, phone, password]
   */
  login (params) {
    return __post(config.path + 'user/register', params)
  },
  /**
   * 获取验证码
   * @param params {object} [phone]
   */
  getCode (params) {
    return __get(config.path + 'user/get-code', params)
  },
  /**
   * 忘记密码
   * @param params {object} [phone, _new, _newRepeat]
   */
  forget (params) {
    return __post(config.path + 'user/forget', params)
  },
  logout () {
    return __get(config.path + 'user/logout')
  },
  /**
   * 修改昵称
   * @param params {object} [nickname]
   */
  modifyNick (params) {
    return __post(config.path + 'user/modify-nick', params)
  },
  /**
   * 修改密码
   * @param params {object} [old, _new, _newRepeat]
   */
  modifyPw (params) {
    return __post(config.path + 'user/modify-password', params)
  },
  /**
   * 修改头像
   * @param params {object} [imgfile(string or base64)]
   */
  modifyAvatar (params) {
    return __post(config.path + 'user/modify-avatar', params)
  },
  /**
   * 查询手机号是否注册
   * @param params {object} [phone]
   */
  validatePhone (params) {
    return __get(config.path + 'user/has-phone', params, true)
  }
}

export const cart = {
  /**
   * 获取用户购物车
   * @param params {object} [_id]
   */
  fetchCart (params) {
    return __get(config.path + 'cart', params)
  },
  /**
   * 向cart中添加商品
   * @param params {object} [sku, _id]
   */
  addToCart (params) {
    return __post(config.path + 'cart/add', params)
  },
  /**
   * update cart
   * @param params {object} [_id, sku, by || chosen]
   */
  updateCart (params) {
    return __post(config.path + 'cart/update', params)
  },
  /**
   * 删除购物车中的商品
   * @param params {object} [_id, sku:[-1, string, [string]]]
   * -1,删除全部；string，单个删除；[string]，批量删除
   */
  deleteCart (params) {
    return __post(config.path + 'cart/delete', params)
  },
  /**
   * 全选或者全不选
   * @param params {object} [_id, payload]
   */
  chooseAllOfCart (params) {
    return __post(config.path + 'cart/allChosen', params)
  },
  /**
   * 全部删除
   * @param params {object} [_id, payload]
   */
  deleteAllOfCart (params) {
    return __post(config.path + 'cart/allDelete', params)
  }
}

export const address = {
  /**
   * 查询地址
   * @param params {object} [_id]
   * @param id
   */
  fetchAddress (params, id = '') {
    return __get(config.path + `address/${id}`, params)
  },
  /**
   * 新增地址
   * @param params {object} [_id, name, nick, label, province, city, detail, isDefault]
   */
  addAddress (params) {
    return __post(config.path + 'address/0/add', params)
  },
  /**
   * 删除地址
   * @param params {object} [_id]
   * @param id
   */
  deleteAddress (params, id) {
    return __post(config.path + `address/${id}/delete`, params)
  },
  /**
   * 更新地址
   * @param params
   * @param id {object} [_id, name, nick, label, province, city, detail, isDefault]
   */
  updateAddress (params, id) {
    return __post(config.path + `address/${id}/update`, params)
  },
  /**
   * 设置默认地址
   * @param params {object} [_id]
   * @param id
   */
  setDefaultAdr (params, id) {
    return __post(config.path + `address/${id}/set-default`, params)
  }
}

export const order = {
  /**
   * 下单
   * @param params {object} [_id, sku:[], counts:[]]
   */
  placeOrder (params) {
    return __post(config.path + 'order/placeOrder', params)
  },
  /**
   * 查询订单
   * @param params {object} [_id, str: '', -1/xxxx, 0, 1, -2]
   */
  checkOrder (params) {
    return __get(config.path + `order/${params.str}`, {_id: params._id})
  }
}

export function query (url, params) {
  return Vue.http.get(config.path + url, {params: params})
    .then(data => {
      let body = data.body
      if (body.code === 1) {
        return body.result
      } else {
        return Promise.reject(body)
      }
    })
}

