const router = require('koa-router')()
const adrController = require('../../app/controllers/address-controller')

router
	.put('/default/:adrID', adrController.setDefault)
	.post('/add', adrController.addAdr)
	.del('/:adrID', adrController.delAdr)
	.put('/:adrID', adrController.modifyAdr)
	.get('/:adrID', adrController.getAdr)
	.get('/', adrController.getAdrList)

module.exports = router