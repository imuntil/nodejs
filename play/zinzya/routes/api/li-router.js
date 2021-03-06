const router = require('koa-router')()
const liController = require('../../app/controllers/li-controller')

router
  .get('/', liController.getList)
  .post('/', liController.addLi)
  .get('/force', liController.forceRefresh)
  .get('/search', liController.searchLi)

module.exports = router