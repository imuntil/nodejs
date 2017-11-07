const router = require('koa-router')()
const userController = require('../../app/controllers/user-controller')

router.get('/getUser', userController.getUser)
router.post('/registerUser', userController.registerUser)
router.post('/login', userController.login)

module.exports = router