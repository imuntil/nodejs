/**
 * Created by 斌 on 2017/4/13.
 */
const mongoose = require('mongoose');
const Products = require('./product');
const User = require('../models/user');
const _ = require('lodash');

const cartSchema = mongoose.Schema({
    _owner:String,
    lastDate: Date,
    products:[{
        sku: String,

        count: Number,
        chosen: Boolean
    }],
});

cartSchema.methods.getCart = function (id) {
    let promises = [], self = this;
    if (!self.products) {
        return [];
    }
    promises = _.map(self.products, pro => {
        return promises.push(Products.findOne({sku: pro.sku}))
            .select('-introduce -alcoholic -origin -weight -sales -stock -date')
            .then(doc => {
                return _.assign(doc, {count: pro.count, chosen: pro.chosen})
            })
            .catch(err => {
                console.error(err);
                return null;
            });
    });

    return Promise.all(promises);
};


const Cart = mongoose.model('Cart', cartSchema);
module.exports = Cart;