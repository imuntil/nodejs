/**
 * Created by 斌 on 2017/4/8.
 */
const Customer = require('../models/user');
const Orders = require('../models/orders');
const Vacations = require('../models/vacation');
const _ = require('lodash');

function smartJoin(arr, seperator = ' ') {
    return arr
        .filter(elt => (elt !== undefined || elt !== null || elt.toString().trim() !== ''))
        .join(seperator);
}
const status = {
    '0': '未支付',
    '1': '已支付',
}

function getCustomerViewModel(customer) {
    return _.assign(customer._doc, ['password']);
}

function getUserOrdersViewModel(id) {

    return Orders.find({customID: id})
        .then(orders => {
            if (orders) {
                let _orders = orders.map( order => {
                    return {
                        orderNumber: order.orderNumber,
                        date: order.date.toDateString(),
                        status: order.status,
                        textStatus: status[order.status],
                        url:'/orders/' + order.orderNumber,
                        money: order.money,
                        count: order.count,
                        sku: order.sku,
                    }
                });

                if (!_orders) { return []; }
                let promises = _orders.map(order => {
                    return Vacations.findOne({sku: order.sku})
                        .then(doc => {
                            return _.assign(order, {
                                vacation:doc
                            })
                        })
                        .catch(err => {
                            return err;
                        });
                });

                return Promise.all(promises)
                    .then(orders => {
                        return orders;
                    })
                    .catch(err => {
                        console.error(err);
                        return [];
                    })
            }
        })
        .catch(err => {
            return err;
        });
}

module.exports = {
    getCustomerViewModel,
    getUserOrdersViewModel,
};
