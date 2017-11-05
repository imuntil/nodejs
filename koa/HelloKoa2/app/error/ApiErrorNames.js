const ApiErrorNames = {}

ApiErrorNames.UNKNOWN_ERROR = 'unknownError'
ApiErrorNames.USER_NOT_EXIST = 'userNotExist'

const errorMap = new Map()
errorMap.set(ApiErrorNames.UNKNOWN_ERROR, { code: -1, message: '未知错误' })
errorMap.set(ApiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' })

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
