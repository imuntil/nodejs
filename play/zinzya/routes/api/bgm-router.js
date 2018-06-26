const router = require('koa-router')()
const BgmController = require('../../app/controllers/bangumi-controller')

router.get('/:year', BgmController.getList)
router.post('/', BgmController.addBangumi)
router.put('/:bid', BgmController.modifyBangumi)
router.del('/:bid', BgmController.deleteBangumi)

module.exports = router