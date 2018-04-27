const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')

const readLocalFile = async () => {
  try {
    const data = fs.readFileSync('./temp.html', 'utf-8')
    return data
  } catch (error) {
    console.log(error)
  }
}

const request = async () => {
  const url =
    'http://v.t.sina.com.cn/widget/widget_blog.php?uid=5238762936&height=500&skin=wd_01&showpic=1'
  try {
    const res = await superagent.get(url)
    return res.text
  } catch (error) {
    console.log(error)
  }
}

const reptile = async text => {
  if (!text) {
    text = await readLocalFile()
  }
  const $ = cheerio.load(text)
  const fans = /(\d+)/.exec($('.userfans a').text())[1]
  const res = $('.wgtCell_con').map((i, el) => {
    const _ = cheerio.load(el)
    const date = _('.link_d')
    const obj = {
      content: _('.wgtCell_txt')
        .text()
        .trim()
        .replace(/\s|\n/g, ''),
      date: date.text().trim(),
      link: date.attr('href')
    }
    return obj
  })
  return { fans, list: res.get() }
}

reptile()
