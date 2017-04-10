/**
 * Created by 斌 on 2017/4/8.
 */
const User = require('../models/user');
const customerViewModel = require('../viewModels/user');

module.exports = {
    registerRouter(app) {
        app.get('/user/home', this._fetchUser, this.home);
        app.get('/user/edit', this._fetchUser, this.edit);
        app.get('/user/preferences', this.preferences);
        app.get('/user/orders', this.orders);
    },

    _fetchUser(req, res, next) {
        User.findById(req.session.isLogin, (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {return next()}
            customerViewModel(user)
                .then(user => {
                    res.locals.user = user;
                    next();
                })
                .catch(err => next(err));
        })
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

    preferences(req, res, next) {

        User.findById(req.session.isLogin, (err, user) => {
            if (err) {return next(err)}
            if (!user) {return next()}
            customerViewModel(user)
                .then(user => {
                    res.render('user/preferences', {user: user});
                })
                .catch(err => next(err));
        });
    },
    orders(req, res, next) {

        User.findById(req.session.isLogin, (err, user) => {
            if (err) {return next(err)}
            if (!user) {return next()}
            customerViewModel(user)
                .then(user => {
                    res.render('user/orders', {user: user});
                })
                .catch(err => next(err));
        });
    },
};