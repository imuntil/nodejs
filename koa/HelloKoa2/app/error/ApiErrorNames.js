const ApiErrorNames = {}

ApiErrorNames.UNKNOWN_ERROR = 'unknownError'
ApiErrorNames.USER_NOT_EXIST = 'userNotExist'
ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD = 'wrongAccountOrPassword'
ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD = 'needAccountAndPassword'
ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR = 'missingParameterOrParameterError'

const errorMap = new Map()
errorMap.set(ApiErrorNames.UNKNOWN_ERROR, { code: -1, message: '未知错误' })
errorMap.set(ApiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' })
errorMap.set(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD, { code: 102, message: '账号或密码有误' })
errorMap.set(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD, { code: 103, message: '账号密码不能为空' })
errorMap.set(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR, { code: 104, message: '缺少参数或参数有误' })

ApiErrorNames.getErrorInfo = errorName => {
    let errorInfo
    if (errorName) {
        errorInfo = errorMap.get(errorName)
    }
    if (!errorInfo) {
        errorName = ApiErrorNames.UNKNOWN_ERROR
        errorInfo = errorMap[errorName]
    }
    return errorInfo
}

module.exports = ApiErrorNames
