// const fs = require('fs')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')
const Li = require('../models/li')

const url = 'http://www.llss.cool/wp/category/all/anime/'
const magnet = /(熟|生)?[A-z\d]{20,}/g

let newCount = 0
let prevTime = 0

const delay = ms => new Promise((resolve, reject) => {
  setTimeout(resolve, ms)
})

function fetchLi(li, cb) {
  return superagent
    .get(li.link)
    .end((err, res) => {
      if (err) {
        cb(null, false)
      } else {
        const content = cheerio
          .load(res.text)('.entry-content')
          .text()
        const mgs = content.match(magnet)
        cb(null, {
          ...li,
          magnet: mgs
        })
      }
    })
}

/* 获取总页数 */
function getTotalPages($) {
  return Number.parseInt($('.wp-pagenavi span.pages').text().match(/共(.+)页/)[1].trim())
}

/* 获取每页内容 */
function fetchPage() {
  return new Promise((resolve, reject) => {
    superagent
      .get(url)
      .end((err, res) => {
        if (err) {
          return reject(err)
        }
        resolve(parseText(res.text))
      })
  })
}

function parseText(text) {
  const $ = cheerio.load(text)
  const eros = $('.type-post').map((idx, element) => {
    const el = $(element).find('.entry-title a')
    return {
      title: el
        .text()
        .trim(),
      link: el.attr('href'),
      img: $(element)
        .find('.entry-content img')
        .eq(0)
        .attr('src')
    }
  })
  return new Promise((resolve, reject) => {
    return async.mapLimit(Array.from(eros).filter(v => v.title), 5, fetchLi, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result.filter(v => !!v))
    })
  })
}

/* 对比新数据和数据库中的数据 */
async function contrast(newData) {
  while (newData.length) {
    const li = newData.shift()
    const dbLi = await Li
      .findOne({title: li.title})
      .exec()
    if (dbLi) {
      console.log('旧资源')
      continue
    } else {
      console.log(`有新的资源:${li.title}`)
      await Li.create(li)
      newCount++
    }
  }
}

/* 定时重复爬, 2h */
async function run() {
  // newCount += 10
  while (true) {
    const now = Date.now()
    if (now - prevTime > 1000 * 60 * 60 * 24) {
      const v = await fetchPage()
      await contrast(v)
      prevTime = Date.now()
    }
    await delay(1000 * 60 * 60)
  }
}

/* 强制刷新 */
async function forceRefresh() {
  console.log('强制刷新')
  prevTime = Date.now()
  const v = await fetchPage()
  await contrast(v)
  prevTime = Date.now()
}

module.exports = {
  crawlPer2h: run,
  forceRefresh,
  getCount() {
    return newCount
  }
}