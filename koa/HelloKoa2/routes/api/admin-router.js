const router = require('koa-router')()
const adminController = require('../../app/controllers/admin-controller')

router
  .post('/login', adminController.login)
  .get('/register', adminController.register)

module.exports = router