/**
 * Created by 斌 on 2017/3/1.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('register')
});
module.exports = router;