/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router()

router.get('/', (req, res) => {
  // res.cookie('test', 'xxxx', {signed:true})
  // console.log('signed:', req.signedCookies['test']);
  // console.log('cookies:',req.cookies);
  res.cookie('xxxxx', 'xxxxxx', {
    domain: 'localhost',
    path: '/'
  })
  res.render('home')
})

module.exports = router
