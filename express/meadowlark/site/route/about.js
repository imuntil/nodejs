/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();
const fortune = require('../lib/fortune')
router.get('/', (req, res) => {
    res.render('about', {
        fortune:fortune.getFortune(),
        pageTestScript:'../qa/tests-about.js'
    })
})
module.exports = router;