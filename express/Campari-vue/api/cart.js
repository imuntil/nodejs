/**
 * Created by 斌 on 2017/4/16.
 */
const api = require('express').Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const _ = require('lodash');

/**
 * 获取购物车
 * params {action?}  null||add||update||delete
 * query {sku,by,chosen}
 */
api.get('/', (req, res, next) => {
    let user = req.session.isLogin;
    if (!user) {
        return res.json({code:-1, msg:'the user is not logged in'});
    }

    Cart.findOne({_owner: user})
        .exec((err, doc) => {
            if (err) {
                return errHandle(err, res);
            }
            res.json({code:1, msg:'success', result:doc.products})
        });
});

/**
 * adu
 */
api.post('/:action?', (req, res, next) => {
    let user = req.session.isLogin;
    if (!user) {
        return res.json({code:-1, msg:'the user is not logged in'});
    }
    let action = req.params.action;
    let query = Cart.findOne({_owner:user});
    if (!action) {
        query
            .exec((err, doc) => {
                if (err) {
                    return errHandle(err, res);
                }
                res.json({code:1, msg:'success', result: doc.products})
            });
    } else {
        let search = req.body;

        switch (action) {
            case 'add':
                query.exec((err, doc) => {
                    //是否出错
                    if (err) {
                        return errHandle(err, res);
                    }
                    //是否有sku
                    if (!search.sku) {
                        return res.json({code:0, msg:'sku must be passed'});
                    }

                    //cart中是否已经存在该商品
                    let p = doc.products || [];
                    let has = _.findIndex(p, {sku: search.sku});
                    //cart中有此商品
                    if (has > -1) {
                        //count +1
                        p[has].count += 1;
                        //修改更新时间
                        doc.lastDate = Date.now();
                        doc.save((err, doc) => {
                            if (err) {
                                return errHandle(err, res);
                            }
                            res.json({code:1, msg:'购物车中本商品数量+1'});
                        });
                        return;
                    }

                    //cart中没有此商品
                    //product表中是否存在该商品
                    Product.findOne({sku: search.sku})
                        .exec((err, pro) => {
                            if (err) {
                                return errHandle(err, res);
                            }
                            if (!pro) {
                                // 不存在
                                return res.json({code:-1, msg: `invalid sku, sku for ${search.sku} do not exist`});
                            }
                            // 存在
                            doc.lastDate = Date.now();
                            !doc.products && (doc.products = []);
                            doc.products.push({sku:search.sku, count:1, chosen: true});
                            doc.save((err, doc) => {
                                if (err) {
                                    return errHandle(err, res);
                                }
                                res.json({code:1, msg:'添加成功'});
                            })
                        });
                });
                break;
            case 'update':
                query.exec((err, doc) => {
                    //是否出错
                    if (err) {
                        return errHandle(err, res);
                    }
                    //是否有sku
                    if (!search.sku) {
                        return res.json({code:0, msg:'sku must be passed'});
                    }

                    //是否有by或者chosen
                    if(!+search.by || search.chosen === undefined) {
                        return res.json({code:0, msg:'by or chosen must be passed, and search must be a number'});
                    }

                    //cart中是否已经存在该商品
                    let p = doc.products || [];
                    let has = _.findIndex(p, {sku: search.sku});
                    if (has === -1) {
                        //没有，update失败
                        return res.json({code:0, msg:'购物车中没有此商品，更新失败'})
                    }

                    //有此商品
                    p[has].count += (+search.by);
                    if (p[has].count < 1) {
                        p[has].count = 1;
                    }
                    if (search.chosen !== undefined || search.chosen !== '') {
                        p[has].chosen = !!search.chosen;
                    }
                    doc.lastDate = Date.now();
                    doc.save(err => {
                        if (err) {
                            return errHandle(err, res);
                        }
                        res.json({code:1, msg:'更新成功'});
                    });
                });
                break;
            case 'delete':
                query.exec((err, doc) => {
                    //是否出错
                    if (err) {
                        return errHandle(err, res);
                    }
                    //是否有sku
                    if (!search.sku) {
                        return res.json({code:0, msg:'sku must be passed'});
                    }

                    //cart中是否已经存在该商品
                    let p = doc.products || [];
                    let has = _.findIndex(p, {sku: search.sku});
                    if (has === -1) {
                        //没有，update失败
                        return res.json({code:0, msg:'购物车中没有此商品，删除失败'})
                    }
                    //有此商品
                    p.splice(has, 1);
                    doc.save(err => {
                        if (err) {
                            return errHandle(err, res);
                        }
                        res.json({code:1, msg:'删除成功'});
                    });
                });
                break;
            default:
                res.json({code:4, msg:'invalid action'});
        }
    }
});

function errHandle(err, res) {
    res.json({code:2, msg:'database err', detail: err});
}

module.exports = api;