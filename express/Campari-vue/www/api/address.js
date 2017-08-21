/**
 * Created by 斌 on 2017/4/16.
 */
const api = require('express').Router();
const Address = require('../models/address');
const _ = require('lodash');
const ensureAuthorized = require('../lib/ensureAuthorized')


function errHandle(err, res) {
  res.json({code:2, msg:'database err', detail: err});
}

function validate(req) {
  req.checkBody('province', 'invalid province').len(2, 6);
  req.checkBody('city', 'invalid city').len(2, 12);
  req.checkBody('detail', 'invalid detail').len(2, 40);
  req.checkBody('name', 'invalid name').len(2, 30);
  req.checkBody('phone', 'invalid phone').isPhone();
  req.checkBody('isDefault', 'invalid default').isBoolean();
}

function setDefault(user) {
  Address.findOne({_owner: user, isDefault: true})
    .exec((err, doc) => {
      if (err) {
        console.log(err);
      }
      if (doc) {
        doc.isDefault = false
        doc.save()
      }
    })
}

/**
 * id ?
 */
api.get('/:id?', ensureAuthorized, (req, res) => {
  let user = req.query._id;
  if (!user) {
    return res.json({code: -1, msg:'the user is not logged in'});
  }
  let params = req.params;
  if (!params.id) {
    //获取全部的地址
    Address.find({_owner: user})
      .sort('-date')
      .select('-_owner -date -__v')
      .lean()
      .exec((err, docs) => {
        if (err) {return errHandle(err, res)}
        res.json({code:1, msg:'success', result:docs});
      });
  } else {
    //获取某个地址
    Address.findById(params.id, (err, doc) => {
      if (err) {return errHandle(err, res)}
      if (!doc) {
        return res.json({code:0, msg:'invalid id'})
      }
      res.json({code:1, msg: 'success', result: doc});
    });
  }
});


/**
 * action {delete || update || add}
 */
api.post('/:id?/:action?', ensureAuthorized, (req, res, next) => {
  let user = req.body._id;
  if (!user) {
    return res.json({code: -1, msg:'the user is not logged in'});
  }
  let params = req.params;

  if (!params.id) {
    return res.json({code:-1, msg:'id must be passed'});
  }


  //新增地址
  if (params.id === 'add' || (+params.id === 0 && params.action === 'add')) {
    validate(req);
    let errors = req.validationErrors();
    if (errors) {
      return res.json({code:-1, msg:'参数有误', detail:errors});
    }
    let body = req.body;
    let adr = new Address(_.assign({
      _owner: user,
      date: Date.now()
    }, _.omit(body, '_id')));
    if (body.isDefault) {
      setDefault(user)
    }
    adr.save((err) => {
      if (err) {
        return errHandle(err, res);
      }
      res.json({code:1, msg:'添加成功'})
    });
  }

  //更新
  else if (params.action === 'update') {
    validate(req);
    let errors = req.validationErrors();
    if (errors) {
      return res.json({code:-1, msg:'参数有误', detail:errors});
    }
    let body = req.body;
    if (body.isDefault) {
      setDefault(user)
    }
    Address.findByIdAndUpdate(
      params.id,
      {$set: _.assign(body, {date: Date.now()})},
      (err, doc) => {
        if (err) {return errHandle(err, res)}
        res.json({code: 1, msg:'更新成功'})
      });
  }


  //删除
  else if (params.action === 'delete') {
    Address.findByIdAndRemove(
      params.id,
      err => {
        if (err) {return errHandle(err, res)}
        res.json({code:1, msg:'删除成功'});
      }
    )
  }
  //  设置默认地址
  else if (params.action === 'set-default') {
    setDefault(user)
    Address.findByIdAndUpdate(
      params.id,
      {$set: {isDefault: true}},
      err => {
        if (err) return errHandle(err, res)
        res.json({code: 1, msg:'更新成功'})
      }
    )
  }

  else {
    res.json({code:2, msg:'invalid action'});
  }
});

module.exports = api;