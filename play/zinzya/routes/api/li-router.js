const router = require('koa-router')()
const liController = require('../../app/controllers/li-controller')

router.get('/', liController.getList)
router.post('/', liController.addLi)

module.exports = router