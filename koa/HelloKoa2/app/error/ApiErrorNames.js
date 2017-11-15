const ApiErrorNames = {}

ApiErrorNames.UNKNOWN_ERROR = 'unknownError'
ApiErrorNames.USER_NOT_EXIST = 'userNotExist'
ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD = 'wrongAccountOrPassword'
ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD = 'needAccountAndPassword'
ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR = 'missingParameterOrParameterError'
ApiErrorNames.THE_PHONE_WAS_REGISTERED = 'thePhoneWasRegistered'
ApiErrorNames.WRONG_PHONE_NUMBER = 'wrongPhoneNumber'
ApiErrorNames.WRONG_ID = 'wrongID'
ApiErrorNames.ADDRESS_NOT_EXIST = 'addressNotExist'

const errorMap = new Map()
errorMap.set(ApiErrorNames.UNKNOWN_ERROR, { code: -1, message: '未知错误' })
errorMap.set(ApiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' })
errorMap.set(ApiErrorNames.ADDRESS_NOT_EXIST, { code: 1011, message: '请求的地址信息不存在' })
errorMap.set(ApiErrorNames.THE_PHONE_WAS_REGISTERED, { code: 105, message: '该手机号码已被注册' })
errorMap.set(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD, { code: 102, message: '账号或密码有误' })
errorMap.set(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD, { code: 103, message: '账号密码不能为空' })
errorMap.set(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR, { code: 104, message: '缺少参数或参数有误' })
errorMap.set(ApiErrorNames.WRONG_PHONE_NUMBER, { code: 1041, message: '手机号码格式有误' })
errorMap.set(ApiErrorNames.WRONG_ID, { code: 1043, message: '缺少id或者id格式有误' })

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
