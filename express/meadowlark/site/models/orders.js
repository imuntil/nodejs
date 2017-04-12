/**
 * Created by 斌 on 2017/4/8.
 */
const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    orderNumber: String,
    customID:String,
    date: Date,
    status: Number,
    money: String,
    count: Number,
    sku:String
});

const Orders = mongoose.model('Orders', ordersSchema);

Orders.find((err, orders) => {
    if (orders.length) {return}
    new Orders({
        customID:'58e9103c738b32379cc82a86',
        orderNumber:'1111111111111111111',
        date: Date.now(),
        status: 1,
        money:'$111',
        count:2,
        sku:'HR198'
    }).save();
    new Orders({
        customID:'58e9103c738b32379cc82a86',
        orderNumber:'222222222222222222',
        date: Date.now(),
        status: 0,
        money:'$222',
        count:3,
        sku:'HR199'
    }).save();
});
module.exports = Orders;