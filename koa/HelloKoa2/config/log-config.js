const path = require('path')

const errorLogPath = path.resolve(__dirname, '../logs/error/error')
const responseLogPath = path.resolve(__dirname, '../logs/response/response')

module.exports = {
    'appenders':
    [
        // 错误日主
        {
            'category': 'errorLogger',
            'type': 'dateFile',
            'filename': errorLogPath,
            'alwaysIncludePattern': true,
            'pattern': '-yyyy-MM-dd-hh.log'
        },
        // 相应日志
        {
            'category': 'resLogger',
            'type': 'dateFile',
            'filename': responseLogPath,
            'alwaysIncludePattern': true,
            'patter': '-yyyy-MM-dd-hh.log'
        }
    ],
    'levels': {
        'errorLogger': 'ERROR',
        'resLogger': 'ALL'
    }
}
