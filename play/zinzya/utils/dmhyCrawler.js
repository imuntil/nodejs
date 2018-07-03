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

  async crawlDmhy(name) {
    superagent
      .get(`https://share.dmhy.org/topics/list?keyword=${name}`)
      .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)' +
          ' Chrome/67.0.3396.79 Safari/537.36')
      // .proxy(`http://118.212.137.135:31288`)
      .timeout(15000)
      .then(res => {
        if (res.statusCode === 200) {
          this.parseDOM(res.text)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  async parseDOM(text) {
    const $ = this.$ = cheerio.load(text)
    return $('#topic_list tr').map((i, el) => {
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
          .find('.tag+a')
          .text()
          .trim(),
        magnet: tds
          .eq(3)
          .find('a')
          .attr('href'),
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
  }
}

const dmhy = new DmhyCrawler()
module.exports = dmhy