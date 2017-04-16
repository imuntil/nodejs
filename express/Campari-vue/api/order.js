/**
 * Created by 斌 on 2017/4/16.
 */
const api = require('express').Router();
const Product = require('../models/product');
const Order = require('../models/order');
const _ = require('lodash');


function errHandle(err, res) {
    res.json({code:2, msg:'database err', detail: err});
}

/**
 * 下单
 * sku [],
 * counts []
 */
api.post('/placeOrder', (req, res, next) => {
    let user = req.session.isLogin;
    if (!user) {
        return res.json({code:-1, msg:'the user is not logged in'});
    }
    let body = req.body;
    req.checkBody('sku' ,'must be array').isArray();
    req.checkBody('counts', 'must be array').isArray();
    let errors = req.validationErrors();
    if (errors || body.sku.length !== body.counts.length || !body.sku.length) {
        return res.json({code:-1, msg:'sku, counts must be array and not empty'});
    }

    Product.find({"sku":{"$in":body.sku}})
        .select('-stock -sales -introduce -date -_id -__v')
        .lean()
        .exec((err, docs) => {

            if (err) {return errHandle(err, res)}
            let products = docs, amount = 0, total = 0;
            _.forEach(products, (pro, index) => {
                pro.count = body.counts[index];
                total += pro.count;
                amount += (pro.count * pro.discounted);
            });
            console.log(products);
            let date = Date.now();
            let order = new Order({
                customerId: user,
                orderNumber: + date + '-' + Math.floor(Math.random()*1000),
                date: date,
                total: total,
                amount: amount,
                status: 0,
                products: products
            });
            order.save(err => {
                if (err) {return errHandle(err, res)}
                res.json({code:1, msg:'下单完成', result:{orderNumber: order.orderNumber}})
            });
        })
});

/**
 * /            全部
 * /-1/orderNumber  某个
 * /0           所有未支付
 * /1           所有已支付
 */

api.get('/:status?/:orderNumber?', (req, res, next) => {
    let user = req.session.isLogin;
    if (!user) {
        return res.json({code:-1, msg:'the user is not logged in'});
    }
    let params = req.params;
    if (_.indexOf([-1,0,1], +params.status) === -1) {
        //查询全部
        Order.find({customerId: user})
            .select('-customerId -_id -__v')
            .exec((err, docs) => {
                if (err) {return errHandle(err, res)}
                return res.json({code:1, msg:'success', result: docs});
            });
    }
    //根据订单号查询某一个
    else if (+params.status === -1 && params.orderNumber) {
        Order.findOne({orderNumber: params.orderNumber})
            .select('-customerId -_id -__v')
            .exec((err, doc) => {
                if (err) {return errHandle(err, res)}
                if (!doc) {
                    return res.json({code:0, msg:'订单号有误'});
                }
                return res.json({code:1, msg:'success', result: doc});
            });
    }

    //查询所有未支付
    else if (+params.status === 0) {
        Order.find({customerId:user})
            .where('status').equals(0)
            .select('-customerId -_id -__v')
            .exec((err, docs) => {
                if (err) {return errHandle(err, res)}
                return res.json({code:1, msg:'success', result: docs});
            });
    }

    //查询所有已支付
    else if (+params.status === 1) {
        Order.find({customerId: user})
            .where('status').gte(1)
            .select('-customerId -_id -__v')
            .exec((err, docs) => {
                if (err) {return errHandle(err, res)}
                return res.json({code:1, msg:'success', result: docs});
            });
    }
    else {
        res.json({code:-1, msg:'unknown error'});
    }
});

_.forEach([{a:1}, {a:2}], (item, index) => {
    console.log(item);
});

module.exports = api;