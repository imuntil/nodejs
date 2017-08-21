/**
 * Created by 斌 on 2017/5/1.
 */
import * as type from '../../lib/constant'
import { Ls, Ss } from '../../lib/common-tools'
import { user } from '../../lib/services'
import _ from 'lodash'

const key = type.THE_USER_KEY
export default {
  state: {
    user: {},
    loginTemData: {
      phone: '',
      code: ''
    }
  },
  mutations: {
    [type.USER_LOCAL_USER_M] (state, user) {
      state.user = user
    },
    [type.USER_SET_USER_M] (state, user) {
      state.user = _.assign(state.user, user)
    },
    [type.USER_MODIFY_AVATAR_M] (state, avatar) {
      state.user.avatar = avatar
      state.user.imgname = avatar
      Ls.putValue(key, state.user)
    },
    [type.USER_SAVE_PHONE_CODE_M] (state, data) {
      state.loginTemData = data
    },
    [type.USER_DELETE_PHONE_CODE_M] (state) {
      state.loginTemData = {}
    }
  },
  actions: {
    [type.USER_LOCAL_USER_A] (context) {
      context.commit(type.USER_LOCAL_USER_M)
      if (context.state.user) {
        // context.commit(type.CART_FETCH_CART)
        // context.commit(type.ADR_FETCH_ADDRESSES)
      }
    },
    [type.USER_SET_USER_A] (context, user) {
      context.commit(type.USER_SET_USER_M, user)
      // context.commit(type.CART_FETCH_CART)
      // context.commit(type.ADR_FETCH_ADDRESSES)
    },
    //  检测登录
    [type.USER_CHECK_LOGIN_A] (context) {
      if (context.state.user && context.state.user.phone) {
        return Promise.resolve(true)
      }
      let _user = Ss.getValue(key)
      if (_user && _user.phone) {
        context.commit(type.USER_LOCAL_USER_M, _user)
        return Promise.resolve(true)
      }
      return user.checkLogin()
        .then(data => {
          if (data.code === 1) {
            Ss.putValue(key, data.result)
            context.commit(type.USER_LOCAL_USER_M, data.result)
            return true
          }
          throw new Error(data.msg)
        })
    },
    //  退出登录
    [type.USER_LOGOUT_A] (context) {
      // 除去token （cookie）
      user.logout()
      // 清除session
      Ss.remove(key)
      // 清除store
      context.commit(type.USER_LOCAL_USER_M, {})
    },
    [type.USER_MODIFY_NICK_A] (context, modify) {
      return user.modifyNick(modify)
        .then(data => {
          //  修改成功
          //  更新session和store
          context.commit(type.USER_SET_USER_A, modify)
          console.log(context.state.user)
          Ss.putValue(key, context.state.user)
          console.log('xxx')
          return true
        })
        .catch(err => {
          console.log(err)
          //  修改失败
          return false
        })
    },
    [type.USER_MODIFY_AVATAR_A] (context, modify) {
      return user.modifyAvatar(modify)
        .then(data => {
          //  修改成功
          //  更新session和store
          context.commit(type.USER_SET_USER_A, {avatar: data + '?' + Math.random()})
          Ss.putValue(key, context.state.user)
          return true
        })
        .catch(err => {
          return err
        })
    }
  },
  getters: {
    [type.USER_INFO] (state) {
      return state.user
    }
  }
}
