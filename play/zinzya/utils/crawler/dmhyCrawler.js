const superagent = require('superagent')
const cheerio = require('cheerio')
const Dmhy = require('../../models/dmhy')
const { delay, transformSize } = require('../ct')
const { ApiError, ApiErrorNames } = require('../../app/error/ApiError')
require('superagent-proxy')(superagent)

const hyUrl = 'https://share.dmhy.org'

class DmhyCrawler {
  /**
   * 爬
   * sort [2, 31, 7]
   * page
   * @param {string} name
   * @param {number} sort
   * @param {number} page
   */
  async crawlDmhy(name, sort = 2, page = 1) {
    const url = `https://share.dmhy.org/topics/list/page/${page}?keyword=${
      name ? encodeURI(name) : ''
    }&sort_id=${sort}`
    return superagent
      .get(url)
      .set(
        'User-Agent',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like ' +
          'Gecko) Chrome/67.0.3396.99 Safari/537.36'
      )
      .timeout(15000)
      .then(res => {
        if (res.statusCode === 200) {
          return this.parseDOM(res.text)
        }
        throw res.statusType
      })
  }

  /**
   * 解析dom
   * @param {string} text
   */
  async parseDOM(text) {
    const $ = (this.$ = cheerio.load(text))
    const state = this.getPages($)
    const data = $('#topic_list tbody tr')
      .map((i, el) => {
        const tds = $(el).find('td')
        const { date, type, title, magnet, size, subtitle, link } = {
          date: tds
            .eq(0)
            .find('span')
            .text()
            .trim(),
          type: tds
            .eq(1)
            .text()
            .trim(),
          subtitle: tds
            .eq(2)
            .find('.tag')
            .text()
            .trim(),
          title: tds
            .eq(2)
            .children('a')
            .text()
            .trim(),
          magnet: tds
            .eq(3)
            .find('a')
            .attr('href')
            .split('&')[0],
          size: tds
            .eq(4)
            .text()
            .trim(),
          link:
            hyUrl +
            tds
              .eq(2)
              .children('a')
              .attr('href')
        }
        return {
          date,
          type,
          title,
          magnet,
          size,
          subtitle,
          link,
          real_date: new Date(date),
          real_size: transformSize(size)
        }
      })
      .get()
    return {
      count: data.length,
      ...state,
      res: data
    }
  }

  /**
   * 获取当前页数，下一页是否存在
   * @param {$} $
   */
  getPages($) {
    const el = $('.nav_title').eq(1)
    const text = el.text().trim()
    if (text === '只有一頁') {
      return { page: 1, next: false }
    }
    const v = /第(\d+)頁/.exec(text)
    const page = +(v && v[1])
    if (!page) {
      return { page: 1, next: false }
    }
    const l = el.find('.fl a').length === 2
    if (!l && +page !== 1) {
      return { page, next: false }
    }
    return { page, next: true }
  }

  async runQueue() {
    let [hasNext, page] = [true, 1]
    while (hasNext) {
      const { page, next, res } = await this.crawlDmhy('', 2, page)
      hasNext = next
      next && page++
      console.log(`current page is ${page}`)
      await this.insertToDB(res)
      await delay(4000)
    }
  }

  async insertToDB(data) {
    return new Promise((resolve, reject) => {
      Dmhy.collection.insert(data, (err, docs) => {
        err ? reject(err) : resolve(docs)
      })
    })
  }
}

const dmhy = new DmhyCrawler()
module.exports = dmhy
