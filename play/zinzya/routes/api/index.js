const router = require('koa-router')()
const liRouter = require('./li-router')

router.prefix('/api')
router.use('/li', liRouter.routes(), liRouter.allowedMethods())

module.exports = router