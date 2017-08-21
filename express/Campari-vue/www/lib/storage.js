/**
 * Created by 斌 on 2017/4/7.
 */
const multer = require('multer');
const path = require('path');
const fs = require('fs');

let dataDir = path.resolve(__dirname, '../public/') + '/images',
  proPics = dataDir + '/pro-pics';
fs.existsSync(dataDir) || fs.mkdirSync(dataDir);
fs.existsSync(proPics) || fs.mkdirSync(proPics);

const proStorage = multer.diskStorage({
  destination(req, file, cb) {
    console.log('xxxx--------------------------------------')
    cb(null, proPics);
  },
  filename(req, file, cb) {
    cb(null, +Date.now() + '.jpg');
  }
});

const upload = {
  pro: multer({storage: proStorage}),
  empty() {
    return multer().array();
  }
};
module.exports = upload;