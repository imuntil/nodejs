const {ApiError, ApiErrorNames} = require('../app/error/ApiError')
const User = require('../models/user')

const regs = {
  phone: {
    str: '^(1[3|4|5|7|8])[0-9]{9}$',
    reg: /^(1[3|4|5|7|8])[0-9]{9}$/
  },
  password: {
    str: '^[A-z0-9_\!]{6,20}$',
    reg: /^[A-z0-9_\!]{6,20}$/
  },
  code: {
    str: '^[0-9]{6}$',
    reg: /^[\d]{6}$/
  },
  objectId: {
    reg: /^[0-9a-fA-F]{24}$/
  },
  email: {
    reg: /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/
  }
}

/**
 * 获取当前用户
 * @param {ctx} ctx
 */
async function getCurrentUser(ctx) {
  const token = ctx
    .cookies
    .get('_li', {signed: true})
  if (!token) {
    throw new ApiError(ApiErrorNames.UNKNOWN_ERROR)
  }
  const who = await User.findOne({token})
  return who
}

/**
 * 判断对象是否为空
 * @param {obj} obj 
 */
function isEmptyObj(obj) {
  if (typeof obj !== 'object') {
    return false
  }
  return !Object
    .keys(obj)
    .length
}

module.exports = {
  getCurrentUser,
  isEmptyObj,
  regs
}