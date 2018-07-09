const Proxy = require('../models/proxy')
const superagent = require('superagent')
const cheerio = require('cheerio')
const {ApiError, ApiErrorNames} = require('../app/error/ApiError')
require('superagent-proxy')(superagent)

class DmhyCrawler {

  async getProxies() {
    try {
      this.proxies = await Proxy
        .find()
        .where('failed')
        .lte(5)
        .lean()
        .exec()
    } catch (e) {
      console.log(e)
      setTimeout(() => {
        this.getProxies()
      }, 1000 * 60)
    }
  }

  /**
   * 爬
   * sort [2, 31, 7]
   * page
   * @param {string} name
   * @param {number} sort
   * @param {number} page
   */
  async crawlDmhy(name, sort = 2, page = 1) {
    console.log(typeof page)
    const url = `https://share.dmhy.org/topics/list/${page}?keyword=${name ? encodeURI(name) : ''}&sort_id=${sort}`
    console.log(url)
    return superagent
      .get(url)
      .set('User-Agent', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_5) AppleWebKit/537.36 (KHTML, like ' +
          'Gecko) Chrome/67.0.3396.99 Safari/537.36')
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
    const $ = this.$ = cheerio.load(text)
    const state = this.getPages($)
    const data = $('#topic_list tbody tr').map((i, el) => {
      const tds = $(el).find('td')
      const {
        date,
        type,
        title,
        magnet,
        size,
        subtitle
      } = {
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
          .trim()
      }
      return {
        date,
        type,
        title,
        magnet,
        size,
        subtitle
      }
    }).get()
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
    const text = el
      .text()
      .trim()
    if (text === '只有一頁') {
      return {current: 1, next: false}
    }
    const v = /第(\d+)頁/.exec(text)
    const current = v && v[1]
    if (!current) {
      return {current: 1, next: false}
    }
    const l = el
      .find('.fl a')
      .length === 2
    if (!l && + current !== 1) {
      return {current, next: false}
    }
    return {current, next: true}
  }
}

const dmhy = new DmhyCrawler()
module.exports = dmhy