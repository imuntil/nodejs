const router = require('koa-router')()
const orderController = require('../../app/controllers/order-controller')

router
	.get('/:orderNumber', orderController.orderDetail)
	.put('/:orderNumber', orderController.modifyOrder)
	.get('/', orderController.listOrders)
	.post('/', orderController.placeOrder)

module.exports = router