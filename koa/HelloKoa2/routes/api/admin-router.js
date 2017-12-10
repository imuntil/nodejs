const router = require('koa-router')()
const adminController = require('../../app/controllers/admin-controller')
const orderController = require('../../app/controllers/order-controller')

router
  .post('/login', adminController.login)
  .get('/register', adminController.register)
	.get('/orders', orderController.getOrderList)
	.put('/orders/:on/deliver-goods', orderController.deliverGoods)
	.get('/logout', adminController.logout)

module.exports = router