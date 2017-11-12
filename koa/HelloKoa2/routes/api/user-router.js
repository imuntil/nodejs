const router = require('koa-router')()
const userController = require('../../app/controllers/user-controller')

router
  // 发送短信验证码
  .get('/code', userController.getCode)
  // 注册
  .post('/register', userController.register)
  //	登录
  .post('/login', userController.login)
  // 上传头像
  // .post('/upload', userController.uploadAvatar)
  .put('/modify/password', userController.modifyPassword)
  .put('/modify/nick', userController.modifyNick)
  .put('/modify/avatar', userController.modifyAvatar)
  // 退出登录
  .get('/logout', userController.logout)
  /**
   * 获取用户信息，根据id或者phone
   * 没有信息返回null
   */
  .get('/:ip', userController.getUser)

module.exports = router