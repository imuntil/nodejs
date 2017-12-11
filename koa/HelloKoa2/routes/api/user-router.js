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
  .put('/:uid/password', userController.modifyPassword)
  .put('/:uid/nick', userController.modifyNick)
  .put('/:uid/avatar', userController.modifyAvatar)
  .put('/:uid/forget', userController.forget)
  // 退出登录
  .get('/logout', userController.logout)
  .get('/is-exist', userController.isExist)
  /**
   * 获取用户信息，根据id或者phone
   * 没有信息返回null
   */
  .get('/sys', userController.getUserList)
  .get('/:ip', userController.getUser)
  .get('/sys/filter', userController.filterUsers)

module.exports = router

