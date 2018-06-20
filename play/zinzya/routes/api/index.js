const router = require('koa-router')()
const liRouter = require('./li-router')
const userRouter = require('./user-router')

router.prefix('/api')
router.use('/li', liRouter.routes(), liRouter.allowedMethods())
router.use('/user', userRouter.routes(), userRouter.allowedMethods())

module.exports = router