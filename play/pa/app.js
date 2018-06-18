const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

const uri = 'http://www.llss.cool/wp/category/all/anime/page/1/'
// const uri = 'http://www.llss.cool/wp/category/all/anime/'
const magnet = /(熟|生)?[A-z\d]{20,}/g
const totalsPages = 1
let currentPage = 0

/* 获取每条信息内容 */
function fetchUrl(url, cb) {
  return superagent
    .get(url.link)
    .end((err, res) => {
      if (!err) {
        const content = cheerio
          .load(res.text)('.entry-content')
          .text()
        const mgs = content.match(magnet)
        cb(null, {
          ...url,
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
function fetchPage(currentPage = 1) {
  return new Promise((resolve, reject) => {
    superagent
      .get(`http://www.llss.cool/wp/category/all/anime/page/${currentPage}/`)
      .end((err, res) => {
        if (err) {
          reject(err)
        }
        resolve(parseText(res.text))
      })
  })
}
function parseText(text) {
  const $ = cheerio.load(text)
  getTotalPages($)
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
    return async.mapLimit(Array.from(eros).filter(v => v.title), 5, fetchUrl, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result)
    })
  })
}

async function run() {
  // while (currentPage < totalsPages) {
  // }
  const v = await fetchPage()
  
}

run()