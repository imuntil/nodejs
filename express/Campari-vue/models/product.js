/**
 * Created by 斌 on 2017/4/13.
 */
const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    sku: String,            //库存单位
    ENName: String,
    CNName: String,
    pics: [String],
    price: {
        type: Number,
        min: 0.01,
    },
    discounted: {
        type: Number,
        min: 0.01,
    },
    alcoholic: Number,
    stock: Number,          //库存余量
    sales: Number,
    content: Number,
    weight: Number,
    origin: String,
    type: Number,
    introduce: String,
    date: Date,
});

productSchema.methods.computed = function () {
    if (!this.discounted || this.discounted > this.price) {
        this.discounted = this.price;
    }
    return this;
};

const Product = mongoose.model('Product', productSchema);

Product.find((err, docs) => {
    if (docs.length) {return}
    new Product({
        sku:'xx1',
        price:100,
        sales:100,
        date: Date.now(),
    }).computed().save();
    new Product({
        sku:'xx2',
        price:10000,
        sales:10000,
        date: Date.now(),
    }).computed().save();
    new Product({
        sku:'xx3',
        price:1000,
        sales:1000,
        date: Date.now(),
    }).computed().save();
});

module.exports = Product;