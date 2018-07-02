const Proxy = require('../models/proxy')
const superagent = require('superagent')
const {ApiError, ApiErrorNames} = require('../app/error/ApiError')
require('superagent-proxy')(superagent)
require('superagent-charset')(superagent)

class DmhyCrawler {
  constructor() {
    console.log('________________dmhy init______________')
    // 队列索引
    this.index = -1
    this.getProxies()
  }

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
    if (!this.crawlAble) {
      throw new ApiError(ApiErrorNames.NO_PROXY_AVAILABLE)
    }
    this.index >= this.proxies.length
      ? (this.index = 0)
      : (this.index++)
    const p = this.proxies[this.index].server
    console.log(p)
    superagent
      .get('http://share.dmhy.org/')
      .proxy(`http://118.212.137.135:31288`)
      .charset('gbk')
      .timeout(5000)
      .then(res => {
        if (res.statusCode === 200) {
          console.log(res.text)
        }
      })
      .catch(e => {
        console.log(e.message)
        // this.crawlDmhy(name)
      })
  }

  get crawlAble() {
    return this.proxies && this.proxies.length
  }
}

const dmhy = new DmhyCrawler()
module.exports = dmhy