const router = require('koa-router')()
const userController = require('../../app/controllers/user-controller')

router
	.get('/:id', userController.getUser)
	.get('/p/:phone', userController.getUser)
	.get('/code', userController.getCode)
	.post('/register', userController.register)
	.post('/login', userController.login)

module.exports = router