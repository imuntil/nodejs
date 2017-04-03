/**
 * Created by 斌 on 2017/2/25.
 */
var express = require('express');
var router = express.Router();

router.get('/:id', function (req, res, next) {
    var user = {
        name: 'zhin',
        age:25,
        gender:'male',
        birthday:'1991-12-17'
    };
    res.render('user', {title:'Express-user', id:req.params.id, user:user});
});
module.exports = router;