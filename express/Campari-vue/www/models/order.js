/**
 * Created by 斌 on 2017/4/13.
 */
const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    customerId: String,
    orderNumber: String,        //订单号
    date: Date,                 //日期
    products:[],
    total: Number,              //总共数量
    amount: Number,             //总金额
    status: {
        type:Number,
        enum: [0, 1, 2]            //0:未支付，1：已支付，2：已完成
    },             //订单状态
});

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;


// {
//     sku: String,
//     ENName: String,
//     CNName: String,
//     pics: [String],
//     discounted: Number,
//     price: Number,
//     alcoholic: Number,
//     content: Number,
//     weight: Number,
//     origin: Number,
//     type: Number,
//     count: Number,           //数量
// }