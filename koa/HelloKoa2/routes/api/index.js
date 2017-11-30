const router = require('koa-router')()
const userRouter = require('./user-router')
const adrRouter = require('./adr-router')
const proRouter = require('./pro-router')
const cartRouter = require('./cart-router')
const orderRouter = require('./order-router')
// const v = process.env.npm_package_version

router.prefix(`/api`)
router.use('/users/:uid/cart', cartRouter.routes(), cartRouter.allowedMethods())
router.use('/users/:uid/order', orderRouter.routes(), orderRouter.allowedMethods())
router.use('/users', userRouter.routes(), userRouter.allowedMethods())
router.use('/adrs', adrRouter.routes(), adrRouter.allowedMethods())
router.use('/pros', proRouter.routes(), proRouter.allowedMethods())

module.exports = router