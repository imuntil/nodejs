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
ApiErrorNames.ADR_NOT_EXIST_OR_NOT_MATCH_USER = 'addressNotExistOrNotMatchToUser'
ApiErrorNames.PRODUCT_NOT_EXIST = 'productNotExist'
ApiErrorNames.ORDER_NOT_EXIST = 'orderNotExist'
ApiErrorNames.WRONG_CODE = 'wrongCode'
ApiErrorNames.CODE_EXPIRED = 'codeExpired'
ApiErrorNames.LACK_OF_STOCK = 'lackOfStock'

const errorMap = new Map()
errorMap.set(ApiErrorNames.UNKNOWN_ERROR, { code: -1, message: '未知错误' })
errorMap.set(ApiErrorNames.USER_NOT_EXIST, { code: 101, message: '用户不存在' })
errorMap.set(ApiErrorNames.ADDRESS_NOT_EXIST, { code: 1011, message: '请求的地址信息不存在' })
errorMap.set(ApiErrorNames.ADR_NOT_EXIST_OR_NOT_MATCH_USER, { code: 1013, message: '地址信息不存在或地址同当前用户不匹配' })
errorMap.set(ApiErrorNames.PRODUCT_NOT_EXIST, { code: 1012, message: '请求的产品不存在' })
errorMap.set(ApiErrorNames.ORDER_NOT_EXIST, { code: 1014, message: '订单不存在' })
errorMap.set(ApiErrorNames.THE_PHONE_WAS_REGISTERED, { code: 105, message: '该手机号码已被注册' })
errorMap.set(ApiErrorNames.WRONG_ACCOUNT_OR_PASSWORD, { code: 102, message: '账号或密码有误' })
errorMap.set(ApiErrorNames.NEED_ACCOUNT_AND_PASSWORD, { code: 103, message: '账号密码不能为空' })
errorMap.set(ApiErrorNames.MISSING_PARAMETER_OR_PARAMETER_ERROR, { code: 104, message: '缺少参数或参数有误' })
errorMap.set(ApiErrorNames.WRONG_PHONE_NUMBER, { code: 1041, message: '手机号码格式有误' })
errorMap.set(ApiErrorNames.WRONG_ID, { code: 1043, message: '缺少id或者id格式有误' })
errorMap.set(ApiErrorNames.WRONG_CODE, { code: 107, message: '验证码有误' })
errorMap.set(ApiErrorNames.CODE_EXPIRED, { code: 1071, message: '验证码已过期' })
errorMap.set(ApiErrorNames.LACK_OF_STOCK, { code: 108, message: '库存不足' })

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
