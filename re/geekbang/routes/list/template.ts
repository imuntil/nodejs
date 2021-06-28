import fs from 'fs'
import vm from 'vm'
import path from 'path'

const templateContext = vm.createContext({})

function createTemplate(templatePath: string) {
  return vm.runInContext(
    `(function render(template) {
            return function (data) {
                with (data) {
                    return \`${fs.readFileSync(templatePath, 'utf-8')}\`
                }
            }
        })`,
    templateContext
  )(function (relativePath: string, data: any) {
    return createTemplate(path.dirname(templatePath) + '/' + relativePath)(data)
  })
}

export default createTemplate
