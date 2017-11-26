const router = require('koa-router')()
const proController = require('../../app/controllers/product-controller')
const koaBody = require('koa-body')
router
	.post('/add', proController.addPro)
	.post('/upload', proController.productImage)
	.get('/maybe', proController.maybeLike)
	.get('/:sku', proController.getProDetail)
	.put('/:sku', proController.modifyPro)
	.delete('/:sku', proController.delPro)
	.get('/', proController.getProList)

module.exports = router