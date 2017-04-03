/**
 * Created by 斌 on 2017/2/25.
 */
var express = require('express'),
    router = express.Router(),
    Task = require('Task');

router.get('/', function (req, res, next) {
    Task.find({}, function (err, docs) {

        res.render('task/tasks',{
            title:'Express',
            docs: docs
            //,
            //flash:{info:'success'}
        });
    });
});
module.exports = router;