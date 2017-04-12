/**
 * Created by 斌 on 2017/4/8.
 */
const User = require('../models/user');
const customerViewModel = require('../viewModels/user');

module.exports = {
    registerRouter(app) {
        app.get('/user/home', this._fetchUser, this.home);
        app.get('/user/edit', this._fetchUser, this.edit);
        app.get('/user/safe', this._fetchUser, this.safe);
        app.get('/user/orders', this._fetchOrder, this.orders);
    },

    _fetchUser(req, res, next) {
        User.findById(req.session.isLogin, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {return next()}
            res.locals.user = customerViewModel.getCustomerViewModel(user);
            next();
        })
    },

    _fetchOrder(req, res, next) {
        customerViewModel.getUserOrdersViewModel(req.session.isLogin)
            .then(orders => {
                res.locals.orders = orders;
                next();
            })
            .catch(err => next(err));
    },

    home(req, res, next) {
        res.render('user/home', {
            home: 'active',
            h1:'javascript:;',
            h2:'/user/orders',
            h3:'/user/safe'
        });
    },

    edit(req, res, next) {
        res.render('user/edit')
    },

    orders(req, res, next) {
        res.render('user/orders', {
            order:'active',
            h1:'/user/home',
            h2:'javascript:',
            h3:'/user/safe',
        });
    },

    safe(req, res, next) {
        res.render('user/safe', {
            safe:'active',
            h1:'/user/home',
            h2:'/user/orders',
            h3:'javascript:;',
        });
    },

};