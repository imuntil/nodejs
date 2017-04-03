/**
 * Created by 斌 on 2017/2/25.
 */
var express = require('express'),
    router = express.Router(),
    Task = require('Task');

router.all('/:id/edit', function (req, res, next) {
    console.log(req.body);
    next();
});
router.get('/:id/edit', function (req, res, next) {
    Task.findById(req.params.id, function (err, doc) {
        res.render('task/edit', {
            title:'Edit Task View',
            task: doc,
        });
    });
});

router.post('/:id/edit', function (req, res, next) {
    console.log('post-----post----------;.');
    next();
});

router.put('/:id/edit', function (req, res, next) {
    console.log('put-------------------------------');
    Task.findById(req.params.id, function (err, doc) {
        console.log(req.body);
        doc.task = req.body.task;
        doc.save(function (err) {
            if (!err) {
                flash = {info: 'Task updated'};
                res.redirect('/tasks');
            } else {
                flash = {warning: err};
                console.error('error!');
            }
        });
    });
});

//router.del('/:id/edit', function (req, res, next) {
//    Task.findById(req.params.id, function (err, doc) {
//        if (!doc) {
//            return next(new NotFound('Document not found!'));
//        }
//        doc.remove(function () {
//            res.redirect('/tasks');
//        });
//    });
//});


module.exports = router;