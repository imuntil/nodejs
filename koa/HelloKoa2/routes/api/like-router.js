const router = require('koa-router')()
const LikeController = require('../../app/controllers/likes-controller')

router
	.get('/', LikeController.listLikes)
	.put('/', LikeController.addLike)
	.delete('/', LikeController.deleteLike)

module.exports = router