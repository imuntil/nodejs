/**
 * Created by 斌 on 2017/4/24.
 */
const sys = require('express').Router()
const upload = require('../lib/storage')
const Product = require('../models/product')
const pagination = require('pagination')
const _ = require('lodash')

sys.get('/', (req, res, next) => {
  res.render('welcome')
})
sys.get('/login', (req, res, next) => {
  res.render('login', {title: '管理系统'})
})
sys.post('/login', (req, res, next) => {
  res.redirect(303, '/sys')
})
sys.get('/user-list', (req, res, next) => {
  const list = [
    {
      no: 1,
      nick: 'Jack',
      phone: '13045454563',
      date: Date.now(),
    },
    {
      no: 2,
      nick: 'Tome',
      phone: '1395444463',
      date: Date.now(),
    },
    {
      no: 3,
      nick: 'Kitty',
      phone: '1356424563',
      date: Date.now(),
    },
    {
      no: 4,
      nick: 'Sim',
      phone: '1743554563',
      date: Date.now(),
    }
  ]
  res.render('user-list', {list: list})
})

sys.get('/product-list', (req, res, next) => {

  let start = req.query.page || 1
  let itemsPerPage = 4

  console.log(req.query)

  let conditions = {}
  if (req.query.category && req.query.key) {
    conditions = {[req.query.category]: new RegExp(req.query.key, 'i')}
  }
  res.locals.category = req.query.category || ''
  res.locals.key = req.query.key || ''

  Product.count(conditions, (err, count) => {
    res.locals.count = count
    res.locals.current = start
    let _temp = count / itemsPerPage
    if (_temp === parseInt(_temp, 10)) {
      res.locals.totalPage = _temp
    } else {
      res.locals.totalPage = _temp + 1
    }
  })

  Product.find(conditions)
    .sort('-date')
    .skip((start - 1) * itemsPerPage)
    .limit(itemsPerPage)
    .select('-_id -__v')
    .exec((err, docs) => {
      if (!err) {
        res.render('product-list', {list: docs})
      }
    })
})
sys.post('/product-list/del', (req, res, next) => {
  console.log(req.query)
  Product.findOneAndRemove({sku: req.query.sku}, (err) => {
    console.log(err)
  })
  res.json({code: 1})
})

sys.get('/add-product', (req, res, next) => {
  if (req.query.sku) {
    Product.findOne({sku: req.query.sku})
      .select('-_id -__v')
      .lean()
      .exec((err, doc) => {
        if (!err) {
          res.locals.pro = doc
          res.render('add-product', {scrollAble: true})
        }
      })
  } else {
    res.locals.pro = {}
    res.render('add-product', {scrollAble: true})
  }
})
//  添加商品
sys.post('/add-product',
  upload.pro.array('pics', {maxCount: 5}),
  (req, res, next) => {
    let pics = []
    _.forEach(req.files, file => {
      pics.push(file.filename)
    })
    console.log(req.body)
    console.log(pics)

    new Product(_.assign({
      date: +Date.now()
    }, req.body, {pics: pics, introduce: req.body.editorValue}))
      .computed()
      .save(err => {
        if (err) {

        } else {
          // res.redirect(303, '/sys/add-product')
          res.json({code: 1})
        }
      })
})
//  更新商品
sys.post('/update-product', upload.pro.array('pics', {maxCount: 5}), (req, res, next) => {

})


module.exports = sys