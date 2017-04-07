/**
 * Created by 斌 on 2017/4/6.
 */
const express = require('express'),
    router = express.Router();

router.get('/', (req, res) => {
    res.render('notify-me-when-in-season', {sku: req.query.sku})
})

module.exports = router;