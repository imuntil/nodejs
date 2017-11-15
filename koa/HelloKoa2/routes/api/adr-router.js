const router = require('koa-router')()
const adrController = require('../../app/controllers/address-controller')

router
	.put('/default/:aid', adrController.setDefault)
	.post('/add', adrController.addAdr)
	.del('/:aid', adrController.delAdr)
	.put('/:aid', adrController.modifyAdr)
	.get('/:aid', adrController.getAdr)
	.get('/', adrController.getAdrList)

module.exports = router