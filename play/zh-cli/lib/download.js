const path = require('path')
const download = require('download-git-repo')

module.exports = function (target) {
  target = path.join(target || '.', '.download-temp')
  return new Promise((resolve, reject) => {
    download('imuntil/vue-ts-template#master', target, {
      clone: true
    }, err => {
      if (err) {
        reject(err)
      } else {
        resolve(target)
      }
    })
  })
}