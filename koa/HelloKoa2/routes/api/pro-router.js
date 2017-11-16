const router = require('koa-router')()
const proController = require('../../app/controllers/product-controller')

router
	.post('/add', proController.addPro)
	.get('/maybe', proController.maybeLike)
	.get('/:sku', proController.getProDetail)
	.put('/:sku', proController.modifyPro)
	.delete('/:sku', proController.delPro)
	.get('/', proController.getProList)

module.exports = router