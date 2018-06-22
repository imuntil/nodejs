const superagent = require('superagent')
const cheerio = require('cheerio')
require('superagent-proxy')(superagent)
const Proxy = require('../models/proxy')

const ipReg = /((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)/

let totalsPages = 0
const pool = new Set()

const parseDOM = res => {
  const $ = cheerio.load(res)
  const ips = []
  const body = $('table').eq(1)
  if (!totalsPages) {
    totalsPages = body
      .find('tr b a')
      .length
  }
  body
    .find('tr')
    .each((i, el) => {
      const html = $(el)
        .find('script')
        .html()
      if (html) {
        const str = html.match(/unescape\('(.+)'\)/)[1]
        const ip = unescape(str).match(ipReg)[0]
        const port = $(el)
          .find('td')
          .eq(1)
          .text()
          .trim()
        ips.push(`${ip}:${port}`)
      }
    })
  return ips
}

const fetchIPS = async(page = 0) => {
  try {
    const res = await superagent
      .get(`http://www.proxylists.net/cn_${page}.html`)
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like ' +
          'Gecko) Chrome/67.0.3396.87 Safari/537.36')
      .then(res => res.text)
      .catch(e => {
        throw e
      });
    return parseDOM(res)
  } catch (e) {
    console.log(e)
    return []
  }
}

const filterUseful = ips => {
  const q = ips.map(ip => {
    return superagent
      .get('http://share.dmhy.org/')
      .timeout(5000)
      .proxy(`http://${ip}`)
      .then(res => {
        if (res.statusCode === 200) {
          pool.add(ip)
          // 保存到数据库
          saveToDB(ip)
        } else {}
      })
      .catch(e => {
        console.log(e)
      })
  })
  return Promise.all(q)
}

const saveToDB = async(server) => {
  try {
    await Proxy.create({server})
  } catch (e) {
    console.log(e)
  }
}

/* 删除失败次数大于3次的ip */
const delServer = async (fail = 3) => {
  await Proxy.find().where('failed').gt(fail).remove()
}

const run = async() => {
  delServer()
  let currentPage = 0
  do {
    console.log('currentPage:', currentPage)
    const ips = await fetchIPS(currentPage)
    await filterUseful(ips)
    currentPage++
  } while (currentPage < totalsPages);
  console.log([...pool])
}

module.exports = {
  fetchIpPool: run
}
