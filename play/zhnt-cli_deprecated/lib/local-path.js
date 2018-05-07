const path = require('path')

module.exports = {
  isLocalPath (templatePath) {
    return /^[./]|(^[A-z]:)/.test(templatePath)
  },

  getTemplatePath (templatePath) {
    return path.isAbsolute(templatePath)
      ? templatePath
      : path.normalize(path.join(process.cwd(), templatePath))
  }
}