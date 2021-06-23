import  fs from 'fs'
import  vm from 'vm'

const templateCache: Record<string, any> = {}

const templateContext = vm.createContext({
  include(name: string, data: any) {
    const template = templateCache[name] || createTemplate(name)
    return template(data)
  },
})

function createTemplate(templatePath: string) {
  templateCache[templatePath] = vm.runInContext(
    `
    (function (data) {
      with (data) {
        return \`${fs.readFileSync(templatePath, 'utf-8')}\`
      }
    })
    `,
    templateContext
  )
  return templateCache[templatePath]
}

export default createTemplate
