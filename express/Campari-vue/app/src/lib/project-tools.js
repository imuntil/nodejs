/**
 * Created by 斌 on 2017/5/1.
 */
import { user } from './services'
import { THE_USER_KEY, USER_INFO, USER_LOCAL_USER_M } from './constant'
import { Ss } from './common-tools'
import store from '../store/index'

export function checkLogin () {
  //  首先检查store
  let status = store.getters[USER_INFO]
  if (status && status.phone) {
    return Promise.resolve(true)
  }
  //  检查本地sessionStorage
  status = Ss.getValue(THE_USER_KEY)
  if (status && status.phone) {
    // 将session中的信息同步到store
    store.commit(USER_LOCAL_USER_M, status)
    return Promise.resolve(true)
  }
  return user.checkLogin()
    .then(data => {
      console.log(data)
      // 将信息同步到session和store
      if (data.code === 1) {
        Ss.putValue(THE_USER_KEY, data.msg)
        store.commit(USER_LOCAL_USER_M, data.msg)
        return true
      }
      return false
    })
    .catch(err => {
      console.log(err)
      return false
    })
}
