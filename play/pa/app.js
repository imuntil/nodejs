const fs = require('fs')
const superagent = require('superagent')
const cheerio = require('cheerio')
const async = require('async')

const uri = 'http://www.llss.cool/wp/category/all/anime/page/1/'
// const uri = 'http://www.llss.cool/wp/category/all/anime/'
const magnet = /(熟|生)?[A-z\d]{20,}/g
let totalsPages = 0
let currentPage = 68

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
      } else {
        cb(null, false)
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
  if (!totalsPages) {
    totalsPages = getTotalPages($)
    console.log('total-pages is ', totalsPages)
  }
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
  console.log(Array.from(eros))
  return new Promise((resolve, reject) => {
    return async.mapLimit(Array.from(eros).filter(v => v.title), 5, fetchUrl, (err, result) => {
      if (err) {
        reject(err)
      }
      resolve(result.filter(v => !!v))
    })
  })
}

async function run() {
  const steam = fs.createWriteStream('./magnet.txt', {
    flags: 'a',
    encoding: 'utf8',
    mode: 0o666
  })
  do {
    try {
      const v = await fetchPage(++currentPage)
      console.log('current-page:', currentPage)
      steam.write(JSON.stringify(v), 'utf8')

    } catch (e) {
      console.log('error:', e)
    }
  } while (currentPage < totalsPages);
  // console.log(list)
}

run()