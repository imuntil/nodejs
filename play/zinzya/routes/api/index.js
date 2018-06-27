const router = require('koa-router')()
const liRouter = require('./li-router')
const userRouter = require('./user-router')
const bgmRouter = require('./bgm-router')

router.prefix('/shizuku')
router.use('/li', liRouter.routes(), liRouter.allowedMethods())
router.use('/bangumi', bgmRouter.routes(), bgmRouter.allowedMethods())
router.use('/user', userRouter.routes(), userRouter.allowedMethods())

module.exports = router