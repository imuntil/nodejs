const router = require('koa-router')()
const BgmController = require('../../app/controllers/bangumi-controller')

router.get('/', BgmController.getList)
router.post('/', BgmController.addBangumi)
router.put('/', BgmController.modifyBangumi)
router.del('/', BgmController.deleteBangumi)

module.exports = router