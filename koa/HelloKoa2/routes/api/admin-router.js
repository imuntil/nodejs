const router = require('koa-router')()
const adminController = require('../../app/controllers/admin-controller')
const orderController = require('../../app/controllers/order-controller')

router
  .post('/login', adminController.login)
  .get('/register', adminController.register)
	.get('/orders', orderController.getOrderList)

module.exports = router