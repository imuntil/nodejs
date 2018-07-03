const router = require('koa-router')()
const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const nodemailer = require('nodemailer')
const dateformat = require('dateformat')
const isEqual = require('lodash.isequal')

let json = null
let date = new Date()
const transporter = nodemailer.createTransport({
  service: 'qq',
  port: 465,
  secure: true,
  auth: {
    user: 'zhaobin@jtuntech.com',
    pass: '1xx1UOH3'
  }
})
const mailOptions = {
  from: 'zhaobin@jtuntech.com', // sender address
  to: 'imuntil@qq.com', // list of receivers
  subject: 'Hello ✔', // Subject line
  text: 'Hello world?' // plain text body
}

const sendMail = async (content, now) => {
  transporter.sendMail(
    {
      ...mailOptions,
      subject: 'TAKIGEN微博更新-' + dateformat(now, 'isoDateTime'),
      html: `<p>${JSON.stringify(content, '', 2)}</p>`
    },
    (err, info) => {
      if (err) {
        return console.log(err)
      }
      console.log('success')
    }
  )
}

const readLocalFile = async () => {
  try {
    const data = fs.readFileSync('../takigen-webo/temp.html', 'utf-8')
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
    // text = await readLocalFile()
    return ''
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
  return { fans, list: res.get().slice(0, 5) }
}

router.get('/', async (ctx, next) => {
  const now = new Date()
  /* time 2 hours */
  if (!json || now - date >= 1000 * 60 * 60 * 2) {
    console.log('timeout ...........')
    const html = await request()
    const newJson = await reptile(html)
    /* 比较两次的数据，如果不一致则发送邮件 */
    if (!isEqual(newJson, json)) {
      sendMail(newJson, now)
      json = newJson
    }
    date = now
  }
  ctx.body = json
})

// router.get('/string', async (ctx, next) => {
//   ctx.body = 'koa2 string'
// })

// router.get('/json', async (ctx, next) => {
// ctx.body = {
//   title: 'koa2 json'
// }
// })

module.exports = router
