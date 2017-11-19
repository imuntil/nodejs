const router = require('koa-router')()
const cartController = require('../../app/controllers/cart-controller')

router
	.post('/add', cartController.addToCart)
	.put('/:cid', cartController.modifyCart)
	.delete('/:cid', cartController.deleteFromCart)
	.get('/', cartController.getCart)
	.delete('/', cartController.clearCart)
	.put('/', cartController.toggleChoose)

module.exports = router