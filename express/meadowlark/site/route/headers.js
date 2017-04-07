/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router()

router.get('/', (req, res) => {
    res.set(`Content-Type`, `text/plain`)
    let s = ``;
    for (let [name, value] of Object.entries(req.headers)) {
        s += `${name} : ${value} \n`
    }
    res.send(s);
})

module.exports = router;