const router = require('koa-router')()
const userRouter = require('./user-router')
const adrRouter = require('./adr-router')
const proRouter = require('./pro-router')

router.prefix('/api')
router.use('/users', userRouter.routes(), userRouter.allowedMethods())
router.use('/adr', adrRouter.routes(), adrRouter.allowedMethods())
router.use('/pro', proRouter.routes(), proRouter.allowedMethods())

module.exports = router