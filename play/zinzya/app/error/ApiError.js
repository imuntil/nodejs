const errorMap = new Map()
const ApiErrorNames = {
  USER_NOT_EXIST: 'user_not_exist',
  MISSING_OR_WRONG_PARAMETERS: 'missing_or_wrong_parameters',
  WRONG_PHONE_NUMBER: 'wrong_phone_number',
  WRONG_ACCOUNT_OR_PWD: 'WRONG_ACCOUNT_OR_PWD',
  INVALID_EMAIL: 'invalid_email',
  WRONG_ID: 'wrong_id',
  FIELD_IS_ILLEGAL: 'field_is_illegal',
  UNKNOWN_ERROR: 'unknown_error',
  THE_EMAIL_CANT_REG: 'THE_EMAIL_CANT_REGister',
  PERMISSION_DENIED: 'permission_denied',
  UNAUTHORIZED: 'Unauthorized',
  EMAIL_IS_EXIST: 'email_is_exist',
  NO_PROXY_AVAILABLE: 'no_proxy_available',
  

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
119 代理相关
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
errorMap.set(ApiErrorNames.WRONG_ACCOUNT_OR_PWD, {
  code: 1022,
  message: '账号或密码有误'
})
errorMap.set(ApiErrorNames.FIELD_IS_ILLEGAL, {
  code: 1023,
  message: '字段不合法'
})
errorMap.set(ApiErrorNames.WRONG_ID, {
  code: 1024,
  message: 'ID有误'
})
errorMap.set(ApiErrorNames.INVALID_EMAIL, {
  code: 1025,
  message: '邮箱账号不合法'
})

errorMap.set(ApiErrorNames.EMAIL_IS_EXIST, {
  code: 1031,
  message: '该邮箱已被注册'
})

errorMap.set(ApiErrorNames.UNAUTHORIZED, {
  code: 104,
  message: 'Unauthorized'
})
errorMap.set(ApiErrorNames.PERMISSION_DENIED, {
  code: 1041,
  message: 'Permission denied'
})

errorMap.set(ApiErrorNames.NO_PROXY_AVAILABLE, {
  code: 1191,
  message: '没有可用的代理'
})

errorMap.set(ApiErrorNames.THE_EMAIL_CANT_REG, {
  code: 1201,
  message: '该邮箱不能注册'
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