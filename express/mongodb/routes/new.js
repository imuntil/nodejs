/**
 * Created by 斌 on 2017/2/25.
 */
var express = require('express'),
    router = express.Router();

router.get('/', function (req, res, next) {
    res.render('task/new', {
        title: 'New Task'
    });
});
module.exports = router;