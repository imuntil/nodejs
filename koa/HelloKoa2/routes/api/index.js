const router = require('koa-router')()
const userRouter = require('./user-router')

router.prefix('/api')
router.use('/users', userRouter.routes(), userRouter.allowedMethods())

module.exports = router