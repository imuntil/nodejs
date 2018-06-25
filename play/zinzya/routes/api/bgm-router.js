const router = require('koa-router')()
const BgmController = require('../../app/controllers/Bangumi-controller')

router.get('/', BgmController.getList)

module.exports = router