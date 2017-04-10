/**
 * Created by 斌 on 2017/4/8.
 */
const mongoose = require('mongoose');

const ordersSchema = mongoose.Schema({
    customID:String,
    orders:[{
        orderNumber: String,
        date: Date,
        status: String,
    }],
});

const Orders = mongoose.model('Orders', ordersSchema);

Orders.find((err, orders) => {
    if (orders.length) {return}
    new Orders({
        customID:'58e9103c738b32379cc82a86',
        orders:[
            {
                orderNumber:'1111111111111111111',
                date: Date.now(),
                status: 'complete',
            },
            {
                orderNumber:'222222222222222222222',
                date: Date.now(),
                status:'processing',
            }
        ]
    }).save();
});
module.exports = Orders;