const {ApiError, ApiErrorNames} = require('../app/error/ApiError')
const User = require('../models/user')

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
  isEmptyObj
}