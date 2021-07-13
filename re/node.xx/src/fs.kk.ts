import fs from 'fs'
import fp from 'fs/promises'
import path from 'path'

fs.access(path.resolve(`${__dirname}`, '../yarn.lock'), (err) => {
  console.log(err ? err : 'is exist')
})

async function isExist(path: string): Promise<boolean> {
  try {
    await fp.access(path)
    console.log('xxxx')
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

isExist(path.resolve(`${__dirname}`, '../yarn.lock')).then((res) => {
  console.log(res)
})
isExist(path.resolve(`${__dirname}`, '../yarn.locks'))
  .then((res) => {
    console.log(res)
  })