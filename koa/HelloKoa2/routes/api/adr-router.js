const router = require('koa-router')()
const adrController = require('../../app/controllers/address-controller')

router
	.put('/default/:id', adrController.setDefault)
	.post('/add', adrController.addAdr)
	.del('/:id', adrController.delAdr)
	.put('/:id', adrController.modifyAdr)
	.get('/:id', adrController.getAdr)
	.get('/', adrController.getAdrList)

module.exports = router