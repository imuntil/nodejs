const path = require('path')
const download = require('download-git-repo')
const ora = require('ora')
const rm = require('rimraf').sync
const exists = require('fs').existsSync

module.exports = function (target) {
  if (exists(target)) {
    console.log(`rm ${target}`)
    rm(target)
  }
  return new Promise((resolve, reject) => {
    const url = 'imuntil/vue-ts-template#master'
    const spinner = ora(`正在下载项目模板，源地址:${url}`)
    spinner.start()
    download(url, target, {
      clone: true
    }, err => {
      if (err) {
        spinner.fail()
        reject(err)
      } else {
        spinner.succeed()
        resolve(target)
      }
    })
  })
}