/**
 * Created by 斌 on 2017/4/8.
 */
const passport = require('passport');
const User = require('../models/user');
const LocalStategy = require('passport-local').Strategy;

passport.serializeUser( (user, done) => {
    console.log('serialize',user);
    done (null, user._id);
});

passport.deserializeUser( (id, done) => {
    User.findById(id, (err, user) => {
        if (err || !user) {
            return done(err, null);
        }
        done(null, user);
    });
});

passport.use('local.sign', new LocalStategy({
    usernameField:'email',
    passwordField: 'password',
    passReqToCallback: true,
}, (req, email, password, done) => {
    req.checkBody('email', 'invalid email').isEmail();
    req.checkBody('password', 'invalid password').len(6, 20);
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(error => {
            messages.push(error);
        });
        return done(null, false, {code:-1, msg:'密码或邮箱不合法', detail: messages});
    }
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err);
        }
        if (user) {
            return done(null, false, {code:-1, msg:'邮箱已被注册'});
        }
        let newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.created = Date.now();
        newUser.save()
            .then(() => {
                return done(null, newUser, {code:1, msg:'success'});
            })
            .catch(err => {
                return done(err, false, {code:2, msg:'数据库出错'});
            });
    });
}));

passport.use('local.login', new LocalStategy({
    usernameField:'email',
    passwordField:'password',
    passReqToCallback:true,
}, (req, email, password, done) => {
    req.checkBody('password', 'invalid password').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        let messages = [];
        errors.forEach(err => {
            messages.push(err);
        });
        return done(messages, false, {code:-1, msg:'密码或邮箱不合法', detail: messages});
    }
    User.findOne({'email': email}, (err, user) => {
        if (err) {
            return done(err, false, {code:2, msg:'数据库出错'});
        }
        if (!user) {
            return done(null, false, {code:-1, msg: '用户名有误'});
        }
        if (!user.validPassword(password)) {
            return done(null, false, {code:-1, msg: '密码错误'});
        }
        return done(null, user, {code:1, msg: 'success'});
    });
}));

