#!/usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const path = require('path')
const exists = require('fs').existsSync
const inquirer = require('inquirer')
const ora = require('ora')
const userHome = require('user-home')
const download = require('download-git-repo')
const tildify = require('tildify')
const logger = require('./lib/logger')
const localPath = require('./lib/local-path')

const { isLocalPath, getTemplatePath } = localPath

program
  .usage('<template-name> [project-name]')
  .option('-t --typescript', 'use typescript')
  .option('-s --scss', 'use scss')

/**
 * Help
 */
program.on('--help', () => {
  console.log('    Examples:')
  console.log()
  console.log(chalk('    # create a new project default'))
  console.log('    $ zhnt init')
  console.log()
  console.log(chalk('    # create a new project with typescript'))
  console.log('    $ zhnt init -t')
})

function help() {
  program.parse(process.argv)
  if (program.args.length < 1) return program.help()
}
help()

/**
 * Settings
 */
console.log(program.args)
let [, template = 'nodejs', rawName] = program.args
const inPlace = !rawName || rawName === '.'
const name = inPlace ? path.relative('../', process.cwd()) : rawName
const to = path.resolve(rawName || '.')
console.log('---------------')
console.log(template, name, to)

// 暂存目录
const tmp = path.join(userHome, '.zh-templates', template.replace(/\//g, '-'))
console.log(tmp)
if (program.offline) {
  console.log(`> Use cached template at ${chalk.yellow(tildify(tmp))}`)
  template = tmp
}
/**
 * Padding
 */
console.log()
process.on('exit', () => {
  console.log()
})

if (exists(to)) {
  inquirer.prompt([{
    type: 'confirm',
    message: inPlace
      ? 'Generate project in current directory'
      : 'Target directory exists. Continue?',
    name: 'ok'
  }]).then(answers => {
    if (answers.ok) {
      run()
    }
  }).catch(logger.fatal)
} else {
  run()
}

/**
 * Check, download and generate the project
 */
function run () {
  console.log('run')
  if (isLocalPath(template)) {
    const templatePath = getTemplatePath(template)
    if (exists(templatePath)) {
      // x
    }
  }
}

// function downloadAndGenerate (template) {
//   const spinner = ora('download template')
//   spinner.start()
// }