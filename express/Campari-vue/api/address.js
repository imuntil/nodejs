/**
 * Created by 斌 on 2017/4/16.
 */
const api = require('express').Router();
const Address = require('../models/address');
const _ = require('lodash');


function errHandle(err, res) {
    res.json({code:2, msg:'database err', detail: err});
}

function validate(req) {
    req.checkBody('province', 'invalid province').len(2, 12);
    req.checkBody('city', 'invalid city').len(2, 8);
    req.checkBody('detail', 'invalid detail').len(2, 40);
    req.checkBody('name', 'invalid name').len(2, 30);
    req.checkBody('phone', 'invalid phone').isPhone();
    req.checkBody('isDefault', 'invalid default').isBoolean();
}

/**
 * id ?
 */
api.get('/:id?', (req, res) => {
    let user = req.session.isLogin;
    if (!user) {
        return res.json({code: -1, msg:'the user is not logged in'});
    }
    let params = req.params;
    if (!params.id) {
        //获取全部的地址
        Address.find({_owner: user})
            .sort('-date')
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
api.post('/:id?/:action?', (req, res, next) => {
    let user = req.session.isLogin;
    if (!user) {
        return res.json({code: -1, msg:'the user is not logged in'});
    }
    let params = req.params;

    if (!params.id) {
        return res.json({code:-1, msg:'id must be passed'});
    }

    console.log('params:', params);

    //新增地址
    if (params.id === 'add' || (+params.id === 0 && params.action === 'add')) {
        validate(req);
        let errors = req.validationErrors();
        if (errors) {
            return res.json({code:-1, msg:'参数有误', detail:errors});
        }
        let body = req.body;
        let adr = new Address(_.assign({
            _owner:req.session.isLogin,
            date:Date.now()
        }, body));
        adr.save((err) => {
            if (err) {
                return errHandle(err, res);
            }
            res.json({code:1, msg:'添加成功', result: adr})
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

    else {
        res.json({code:2, msg:'invalid action'});
    }
});

module.exports = api;