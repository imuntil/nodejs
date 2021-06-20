import * as fs from 'fs'
import * as vm from 'vm'
import * as path from 'path'

const templateContext = vm.createContext({})
// const renderList = createTemplate(__dirname + '/index.htm')

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

// console.log(renderList({ courses: listData }));
export default createTemplate
