/**
 * Created by 斌 on 2017/4/24.
 */
const sys = require('express').Router()
const ueditor = require('ueditor')
const path = require('path')

sys.use('/ue',
  ueditor(path.resolve(__dirname, '../public/'), (req, res, next) => {
    if (req.query.action === 'uploadimage') {
      let imgUrl = '/images/detail/'
      res.ue_up(imgUrl)
      res.setHeader('Content-Type', 'text/html')
    }
    else if (req.query.action === 'listimage') {
      let dirUrl = '/images/detail'
      res.ue_list(dirUrl)
    }
    else {
      res.setHeader('Content-Type', 'application/json')
      res.redirect('/ueditor/jsp/config.json')
    }
  }))

module.exports = sys;