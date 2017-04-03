/**
 * Created by 斌 on 2017/2/25.
 */
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('post-name', {'title':'Express-post.name'});
});

module.exports = router;