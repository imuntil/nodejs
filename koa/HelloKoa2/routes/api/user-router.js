const router = require('koa-router')()
const userController = require('../../app/controllers/user-controller')

router
	.get('/p/:phone', userController.getUser)
	.get('/code', userController.getCode)
	.post('/register', userController.register)
	.post('/login', userController.login)
	.post('/test', userController.uploadAvatar)
	.get('/:id', userController.getUser)

module.exports = router