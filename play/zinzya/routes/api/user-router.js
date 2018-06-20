const router = require('koa-router')()
const UserController = require('../../app/controllers/user-controller')

router
  .post('/login', UserController.login)
  .post('/create', UserController.createAccount)

module.exports = router