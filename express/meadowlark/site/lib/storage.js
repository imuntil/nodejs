/**
 * Created by 斌 on 2017/4/7.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let dataDir = path.resolve(__dirname, '../public/') + '/data',
    vacationPhotoDir = dataDir + '/vacation-photo',
    userAvatarDir = dataDir + '/avatar';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(vacationPhotoDir) || fs.mkdirSync(vacationPhotoDir);
fs.existsSync(userAvatarDir) || fs.mkdirSync(userAvatarDir);


const photoStorage = multer.diskStorage({
    destination(req, file, cb) {
        let dir = vacationPhotoDir + '/' + Date.now();
        fs.existsSync(dir) || fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename(req, file, cb) {
        cb(null, file.originalname)
    }
});

const avatarStorage = multer.diskStorage({
    destination(req, file, cb) {
        // let dir = userAvatarDir + '/' + req.session.isLogin;
        // fs.existsSync(dir) || fs.mkdirSync(dir);
        cb(null, userAvatarDir);
    },
    filename(req, file, cb) {
        cb(null, req.session.isLogin + '.jpg');
    }
 });
const upload = {
    photo: multer({storage: photoStorage}),
    avatar: multer({storage: avatarStorage}),
};
module.exports = upload;