/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();

router.get('/hood-river', (req, res) => {
    res.render('tours/hood-river')
});
router.get(`/request-group-rate`, (req, res) => {
    res.render(`tours/request-group-rate`)
});

module.exports = router;