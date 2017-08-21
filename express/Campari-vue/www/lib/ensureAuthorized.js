/**
 * Created by 斌 on 2017/5/4.
 */
module.exports = function ensureAuthorized (req, res, next) {
  let cookie = req.signedCookies['token']
  if (!cookie) {
    res.json({code: -5, msg: '请登录'})
    return
  }
  req.token = cookie
  next()
}
