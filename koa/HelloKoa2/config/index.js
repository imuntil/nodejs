const devEnv = require('./development')
const testEnv = require('./test')

module.exports = {
    development: devEnv,
    test: testEnv
}[process.env.NODE_ENV || 'development']