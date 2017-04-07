/**
 * Created by 斌 on 2017/4/7.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let dataDir = path.resolve(__dirname, '../') + '/data',
    vacationPhotoDir = dataDir + '/vacation-photo';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);


const storage = multer.diskStorage({
    destination(req, file, cb) {
        let dir = vacationPhotoDir + '/' + Date.now();
        fs.existsSync(dir) || fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({storage: storage});
module.exports = upload;