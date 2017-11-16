const router = require('koa-router')()
const userRouter = require('./user-router')
const adrRouter = require('./adr-router')
const proRouter = require('./pro-router')

router.prefix('/api')
router.use('/users', userRouter.routes(), userRouter.allowedMethods())
router.use('/adrs', adrRouter.routes(), adrRouter.allowedMethods())
router.use('/pros', proRouter.routes(), proRouter.allowedMethods())

module.exports = router