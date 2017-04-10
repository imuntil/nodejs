/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();

router.get('/', (req, res) => {
    res.render(`newsletter`, {csrfToken: res.locals._csrfToken});
});

module.exports = router;