const superagent = require('superagent')
const cheerio = require('cheerio')
const Anime = require('../../models/bangumi')
require('superagent-charset')(superagent)

class AnimeCrawler {
  /**
   * 解析html，提取番剧信息
   * @param {string} plain
   */
  static parseDOM(plain) {
    const $ = cheerio.load(plain)
    return $('#anime tr').map(((i, el) => {
      const [dateStr,
        name,
        maker,
        kantoku] = $(el)
        .find('td')
        .map((j, em) => {
          return $(em).text()
        })
        .get()
      if (dateStr) {
        let date = new Date(dateStr)
        if (isNaN(date.getTime())) {
          date = new Date(`${dateStr.slice(0, 4)}-01-01`)
        }
        return {
          date,
          name: name.replace(/《(.+)》/, '$1'),
          maker,
          kantoku,
          visible: true
        }
      }
    })).get()
  }

  /**
   * 爬取对应年份的番剧列表
   * @param {number} year
   */
  static async crawlAnimeByYear(year = 2018) {
    try {
      const res = await superagent
        .get(`http://www.acwind.net/icdb/year/${year}/`)
        .charset('gbk')
        .timeout(5000)
        .then(res => res.text)
      return AnimeCrawler.parseDOM(res)
    } catch (e) {
      console.log('====================================');
      console.log(`year:${year}`)
      console.log(e);
      console.log('====================================');
    }
  }

  /**
 * 根据年份爬取对应年份的番剧列表并插入数据库
 * @param {number} year
 */
  static async insertAnimeToDB(year) {
    console.log(`开始爬取${year}年的番剧列表`)
    const animes = await AnimeCrawler.crawlAnimeByYear(year)
    console.log(`${year}年共${animes.length}部番剧， 开始插入数据库`)

    return new Promise((resolve, reject) => {
      Anime
        .collection
        .insert(animes, (err, docs) => {
          err
            ? reject(err)
            : resolve(docs)
        })
    })
  }

  /**
 * 循环爬取数据并插入db
 */
  static async runQueue() {
    let y = 1990
    while (y <= 2018) {
      console.log('————————————————————————————start————————————————————————')
      try {
        await AnimeCrawler.insertAnimeToDB(y)
        console.log(`${y}年番剧插入数据库成功`)
      } catch (e) {
        console.log(`${y}年番剧插入数据库失败`)
        console.log(e)
      }
      console.log('————————————————————————————end————————————————————————')
      console.log('\n')
      y++
    }
    console.log('insert complete')
  }

  /**
 * 强制更新数据库，默认更新当前年份。传入false表示更新整个表。传入具体年份更新对应年份
 * @param {boolean|number} currentYear
 */
  static async forceUpdate(currentYear = true) {
    if (typeof(currentYear) === 'boolean' && !currentYear) {
      console.log(`删除所有番剧数据`)
      await Anime
        .find()
        .remove()
      // 更新全部数据
      await AnimeCrawler.runQueue()
    } else {
      currentYear = typeof(currentYear) === 'number'
        ? currentYear
        : (new Date()).getFullYear()
      console.log(`删除${currentYear}年的番剧`)
      await Anime
        .find()
        .where('date')
        .gte(new Date(`${currentYear}-01-01`))
        .lte(new Date(`${currentYear}-12-31`))
        .remove()
      try {
        await AnimeCrawler.insertAnimeToDB(currentYear)
        console.log(`${currentYear}年番剧插入数据库成功`)
      } catch (e) {
        console.log(`${currentYear}年番剧插入数据库失败`)
        console.log(e)
      }
    }
  }
}

module.exports = AnimeCrawler