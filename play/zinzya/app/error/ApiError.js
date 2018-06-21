const errorMap = new Map()
const ApiErrorNames = {
  USER_NOT_EXIST: 'user_not_exist',
  MISSING_OR_WRONG_PARAMETERS: 'missing_or_wrong_parameters',
  WRONG_PHONE_NUMBER: 'wrong_phone_number',
  WRONG_PHONE_OR_PWD: 'wrong_phone_or_pwd',
  FIELD_IS_ILLEGAL: 'field_is_illegal',
  UNKNOWN_ERROR: 'unknown_error',
  THE_PHONE_CANT_REG: 'the_phone_cant_register',
  PERMISSION_DENIED: 'permission_denied',
  PHONE_IS_EXIST: 'phone_is_exist',
  

  getErrorInfo: errorName => {
    const errorInfo = errorName
      ? errorMap.get(errorName)
      : null
    return errorInfo || errorMap.get(ApiErrorNames.UNKNOWN_ERROR)
  }
}

/*
-2 未被捕获的未知错误
-1 未知错误
101 用户不存在（不存在手机号等情况）
102 缺少必要参数或者参数格式有误
103 数据重复错误
104 权限不足
110 数据库错误
120 其他错误
*/

errorMap.set(ApiErrorNames.UNKNOWN_ERROR, {
  code: -1,
  message: '未知错误'
})

errorMap.set(ApiErrorNames.USER_NOT_EXIST, {
  code: 101,
  message: '用户不存在'
})

errorMap.set(ApiErrorNames.MISSING_OR_WRONG_PARAMETERS, {
  code: 102,
  message: '缺少参数或者参数有误'
})
errorMap.set(ApiErrorNames.WRONG_PHONE_NUMBER, {
  code: 1021,
  message: '手机号码格式有误'
})
errorMap.set(ApiErrorNames.WRONG_PHONE_OR_PWD, {
  code: 1022,
  message: '账号或密码有误'
})
errorMap.set(ApiErrorNames.FIELD_IS_ILLEGAL, {
  code: 1023,
  message: '字段不合法'
})

errorMap.set(ApiErrorNames.PHONE_IS_EXIST, {
  code: 1031,
  message: '该手机号码已被注册'
})

errorMap.set(ApiErrorNames.PERMISSION_DENIED, {
  code: 104,
  message: 'Permission denied'
})

errorMap.set(ApiErrorNames.THE_PHONE_CANT_REG, {
  code: 1201,
  message: '该手机号不能注册'
})

class ApiError extends Error {
  constructor(errorName) {
    super()
    const errorInfo = ApiErrorNames.getErrorInfo(errorName)
    this.name = errorName
    this.code = errorInfo.code
    this.message = errorInfo.message
  }
}

module.exports = {
  ApiError,
  ApiErrorNames,
  errorMap
}