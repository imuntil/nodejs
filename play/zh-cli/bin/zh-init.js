#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob')
const inquirer = require('inquirer')
const latestVersion = require('latest-version')
const userHome = require('user-home')
const download = require('../lib/download')
const generator = require('../lib/generator')

program.usage('<project-name>').parse(process.argv)

const projectName = program.args[0]
if (!projectName) {
  program.help()
  return
}

// 遍历当前目录
const list = glob.sync('*')
let next
let rootName = path.basename(process.cwd())
if (list.length) {
  // 如果当前目录不为空
  if (list.filter(name => {
      const fileName = path.resolve(process.cwd(), path.join('.', name))
      const isDir = fs.statSync(fileName).isDirectory()
      return name.indexOf(projectName) !== -1 && isDir
    }).length !== 0) {
    console.log(`项目${projectName}已经存在`)
    return
  }
  // rootName = projectName
  next = Promise.resolve(projectName)
} else if (rootName === projectName) {
  // rootName = ''
  next = inquirer.prompt([{
    name: 'buildInCurrent',
    message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
    type: 'confirm',
    default: true
  }]).then(ans => {
    return Promise.resolve(ans.buildInCurrent ? '.' : projectName)
  })
} else {
  // rootName = projectName
  next = Promise.resolve(projectName)
}

go()

function go() {
  // console.log(path.resolve(process.cwd(), path.join('.', rootName)))
  next.then(projectRoot => {
      if (projectRoot !== '.') {
        fs.mkdirSync(projectRoot)
      }
      return download(projectRoot)
        .then(target => {
          return {
            name: projectRoot,
            root: projectRoot,
            download: target
          }
        })
    }).then(context => {
      return inquirer.prompt([{
          name: 'projectName',
          message: '项目名称',
          default: context.name
        },
        {
          name: 'projectVersion',
          message: '项目版本号',
          default: '1.0.0'
        },
        {
          name: 'projectDescription',
          message: '项目简介',
          default: `A project named ${context.name}`
        }
      ]).then(answers => {
        return latestVersion('zh-cli').then(version => {
          answers.supportUiVersion = version
          return {
            ...context,
            metadata: {
              ...answers
            }
          }
        }).catch(err => {
          return Promise.reject(err)
        })
      })
    }).then(context => {
      return generator(context)
    }).then(context => {
      console.log('创建成功')
    }).catch(err => {
      console.log(`创建失败:${err.message}`)
    })
}