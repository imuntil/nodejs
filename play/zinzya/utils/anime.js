const superagent = require('superagent')
const cheerio = require('cheerio')
const Anime = require('../models/anime')
const GB2312UTF8 = require('./gb2312-utf8-convert')

const parseDOM = plain => {
  const $ = cheerio.load(plain)
  console.log(GB2312UTF8.GB2312ToUTF8($('#anime table tr').eq(0).text()))
}

const crawlAnimeByYear = async(year = 2018) => {
  try {
    const res = await superagent
      .get(`http://www.acwind.net/icdb/year/${year}/`)
      .timeout(5000)
      .then(res => res.text)
    parseDOM(res)
  } catch (e) {
    console.log(e)
  }
}

crawlAnimeByYear()