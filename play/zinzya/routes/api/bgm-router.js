const router = require('koa-router')()
const BgmController = require('../../app/controllers/bangumi-controller')

router.get('/search', BgmController.searchBGMs)
router.get('/range', BgmController.getDateRange)
router.get('/detail', BgmController.fetchDetail)
router.get('/daily', BgmController.fetchDaily)
router.get('/:year', BgmController.getList)
router.post('/', BgmController.addBangumi)
router.put('/:bid', BgmController.modifyBangumi)
router.del('/:bid', BgmController.deleteBangumi)

module.exports = router