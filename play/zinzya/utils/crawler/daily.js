const superagent = require('superagent')
const cheerio = require('cheerio')

const parse = html => {
  const $ = cheerio.load(html)
  const daily = {}
  $('.change .wrp>li').each((i, el) => {
    const li = $(el)
    const cls = li.attr('class')
    const day = li
      .find('ul li')
      .map((j, l) => {
        let s = $(l)
          .text()
          .trim()
        if (!s) {
          return false
        }
        let r = s.match(/第\d+?话/)
        return {
          name: r ? s.replace(/\s第\d+?话/, '') : s,
          wa: r ? r[0] : ''
        }
      })
      .get()
    day.length && (daily[cls] = day)
  })
  return daily
}

module.exports = async () => {
  const url = 'http://www.dilidili.wang/'
  try {
    const res = await superagent
      .get(url)
      .timeout(5000)
      .then(res => res.text)
    return parse(res)
  } catch (err) {
    throw new Error('获取日更失败')
  }
}
