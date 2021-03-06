const MetalSmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync
const path = require('path')

module.exports = function (metadata = {}, src, dest = '.') {
  if (!src) {
    return Promise.reject(new Error(`无效的source: ${src}`))
  }
  return new Promise((resolve, reject) => {
    MetalSmith(path.resolve(process.cwd()))
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
      .use((files, metalsmith, done) => {
        const meta = metalsmith.metadata()
        // Object.keys(files).forEach(filename => {
        //   const t = files[filename].contents.toString()
        //   files[filename].contents = new Buffer(Handlebars.compile(t)(meta))
        // })
        const handle = files['package.json']
        const t = handle.contents.toString()
        handle.contents = new Buffer(Handlebars.compile(t)(meta))
        done()
      })
      .build(err => {
        rm(src)
        err ? reject(err) : resolve(dest)
      })
  })
}