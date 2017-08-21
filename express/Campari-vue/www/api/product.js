/**
 * Created by 斌 on 2017/4/15.
 */
const api = require('express').Router()
const Product = require('../models/product')

/**
 * type 1-7
 * flag 1:date, 2:sales, 3:price
 * sort 1:asc, 2:desc
 */

function query ({flag = 1, sort = 1} = {}) {
  let s1, s2
  switch (+flag) {
    case 1:
      s1 = 'date'
      break
    case 2:
      s1 = 'sales'
      break
    case 3:
      s1 = 'discounted'
      break
    default:
      s1 = 'date'
  }

  s2 = +sort === 1 ? '' : '-'
  return s2 + s1
}

api.get('/query', (req, res, next) => {
  let params = req.query
  let limit = +params.limit || 0
  if (!+params.flag || !+params.sort) {
    return res.json({code: -1, msg: 'invalid params'})
  }
  let s = query(params)
  if (!params.type || +params.type <= 0 || +params.type > 7) {
    Product
      .find()
      .select('-introduce -sales -stock')
      .sort(s)
      .limit(limit)
      .exec(handler)
    return
  }

  Product
    .find({_type: +params.type})
    .select('-introduce -sales -stock')
    .sort(s)
    .limit(limit)
    .exec(handler)

  function handler (err, docs) {
    if (err) {
      return res.json({code: 2, msg: '数据库出错', detail: err})
    }
    return res.json({code: 1, msg: 'success', result: docs})
  }
})

api.get('/query/discount', (req, res, next) => {
  let limit = +req.query.limit || 0
  Product
    .find()
    .select('-introduce -sales -stock')
    .$where(function () {
      return this.discounted <= this.price
    })
    .limit(limit)
    .exec((err, docs) => {
      if (err) {
        return res.json({code: 2, msg: '数据库出错', detail: err})
      }
      if (!docs || !docs.length) {
        return res.json({code: 1, msg: 'success', result: []})
      }
      res.json({code: 1, msg: 'success', result: docs})
    })
})

/**
 * 查询某个商品
 */
api.get('/:sku', (req, res, next) => {
  let sku = req.params.sku
  if (!sku) {
    return res.json({code: -1, msg: 'need sku'})
  }
  Product.findOne({sku: sku})
    .select('-sales -stock')
    .exec((err, doc) => {
      if (err) {
        return res.json({code: 2, msg: '数据库出错', detail: err})
      }
      if (!doc) {
        return res.json({code: -1, msg: `invalid sku, there is no pro with sku =${sku}`})
      }
      return res.json({code: 1, msg: 'success', result: doc})
    })
})

module.exports = api
