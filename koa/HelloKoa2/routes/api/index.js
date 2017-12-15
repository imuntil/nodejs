const router = require('koa-router')()
const userRouter = require('./user-router')
const adrRouter = require('./adr-router')
const proRouter = require('./pro-router')
const cartRouter = require('./cart-router')
const orderRouter = require('./order-router')
const adminRouter = require('./admin-router')
const likeRouter = require('./like-router')
const couponRouter = require('./coupon-router')
// const v = process.env.npm_package_version

router.prefix(`/api`)
router.use('/users/:uid/cart', cartRouter.routes(), cartRouter.allowedMethods())
router.use('/users/:uid/order', orderRouter.routes(), orderRouter.allowedMethods())
router.use('/(sys)?/users', userRouter.routes(), userRouter.allowedMethods())
router.use('/users/:uid/adrs', adrRouter.routes(), adrRouter.allowedMethods())
router.use('/users/:uid/like', likeRouter.routes(), likeRouter.allowedMethods())
router.use('/sys/coupon', couponRouter.routes(), couponRouter.allowedMethods())
router.use('/pros', proRouter.routes(), proRouter.allowedMethods())
router.use('/sys', adminRouter.routes(), adminRouter.allowedMethods())

module.exports = router