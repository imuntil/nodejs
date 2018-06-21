const router = require('koa-router')()
const UserController = require('../../app/controllers/user-controller')

router
  .post('/login', UserController.login)
  .post('/create', UserController.createAccount)
  .put('/register', UserController.register)
  .get('/test', UserController.test)

module.exports = router