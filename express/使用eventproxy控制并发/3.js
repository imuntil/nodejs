/**
 * Created by 斌 on 2017/3/13.
 */
const eventproxy = require('eventproxy');
const superagent = require('superagent');
const cheerio = require('cheerio');
const url = require('url');

// let cnodeUrl = 'https://takigen.com';
let cnodeUrl = 'http://api.jtuntech.com/event/2018/Q2/chuo/about3.html';

superagent
  .get(cnodeUrl)
  .end((err, res) => {
    if (err) {
      return console.error(err)
    }
    let topicUrls = [];
    let $ = cheerio.load(res.text, {decodeEntities: false});

    const a = []
    const b = []
    $('.col-lg-3.col-md-6 dd').each((idx, element) => {
      a.push($(element).text())
    })
    $('.col-lg-9.col-md-6 dd').each((idx, element) => {
      b.push($(element).html())
    })
    const vv = a.map((v, i) => {
      return `<div class="row">
                <div class="col-md-3 col-xs-3">${v}</div>
                <div class="col-md-9 col-xs-9">${b[i]}</div>
              </div>`
    })
    console.log(vv)
  });
