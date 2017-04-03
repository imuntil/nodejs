/**
 * Created by 斌 on 2017/2/25.
 */
var express = require('express');
var router = express.Router();

/*GET about listing.*/
router.get('/', function (req, res, next) {
    res.render('about', {title:'Express-about'})
});

module.exports = router;