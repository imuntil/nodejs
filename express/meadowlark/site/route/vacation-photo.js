/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');


let dataDir = path.resolve(__dirname, '../') + '/data',
    vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);

router.get(`/vacation-photo`, (req, res) => {
    let now = new Date();
    res.render(`contest/vacation-photo`, {
        year: now.getFullYear(),
        month: now.getMonth()
    })
});

module.exports = router;