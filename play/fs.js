/* eslint-disable */
const fs = require('fs')
const path = require('path')

function getLoadFile(dir) {
  const list = []

  function read(dir = './src/assets/') {
    const stat = fs.statSync(dir)
    const v = stat.isDirectory()
    if (v) {
      fs
        .readdirSync(dir)
        .map(f => {
          read(path.join(dir, f))
        })
    } else if (/\.(png|jpg)$/.test(dir)) {
      if (stat.size > 10000) {
        list.push(dir)
      }
    }
  }
  read(dir)

  const defs = [...Array(list.length).keys()].map(v => `i${v + 1}`)
  const imps = list.map((v, i) => {
    return `import i${i + 1} from '${v.replace("src", "@")}'`
  })
  const exps = `export default [
    ${defs.join(',\n')}
  ]`

  fs.writeFileSync('imgs.ts', imps.join('\n') + '\n\n' + exps)
}

getLoadFile()