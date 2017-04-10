/**
 * Created by 斌 on 2017/4/8.
 */
const Customer = require('../models/user');
const _ = require('lodash');

function smartJoin(arr, seperator = ' ') {
    return arr
        .filter(elt => (elt !== undefined || elt !== null || elt.toString().trim() !== ''))
        .join(seperator);
}

function getCustomerViewModel(customer) {

    return customer.getOrders()
        .then((orders) => {
            let _orders = [];
            if (orders) {
                _orders = orders.orders.map( order => {
                    return {
                        orderNumber: order.orderNumber,
                        date: order.date,
                        status: order.status,
                        url:'/orders/' + order.orderNumber,
                    }
                });
            }


            let vm = _.omit(customer._doc, ['password']);

            return _.assign(vm, {
                orders: _orders,
            });

        })
        .catch(err => {
            return err;
        });
}

module.exports = getCustomerViewModel;
