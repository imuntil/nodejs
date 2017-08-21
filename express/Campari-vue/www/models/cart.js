/**
 * Created by 斌 on 2017/4/13.
 */
const mongoose = require('mongoose');
const Products = require('./product');
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

cartSchema.methods.getCart = function () {
  let promises = [], self = this;
  if (!self.products) {
    return Promise.resolve([])
  }
  promises = _.map(self.products, pro => {
    return Products.findOne({sku: pro.sku})
      .select('-introduce -alcoholic -origin -weight -sales -stock -date')
      .lean()
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