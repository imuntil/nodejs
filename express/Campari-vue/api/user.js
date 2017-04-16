/**
 * Created by 斌 on 2017/4/15.
 */
const api = require('express').Router();
const passport = require('passport');
const upload = require('../lib/storage');
const User = require('../models/user');
const fs = require('fs');

/**
 * 注册
 * phone， password
 */
api.post('/sign-up', (req, res, next) => {
    passport.authenticate('local.sign', (err, user, info) => {
        res.json(info);
    })(req, res, next);
});

/**
 * 登录
 * phone， password
 */
api.post('/login', (req, res, next) => {
    passport.authenticate('local.login', (err, user, info) => {
        if (user) {
            //建立登录会话
            req.session.isLogin = user.id;
            req.session.save();
        }
        res.json(info);
    })(req, res, next);
});

//登出
api.get('/logout', (req, res, next) => {
    req.session.isLogin = false;
    req.session.save();
    res.redirect('/');
});

/**
 * 修改密码
 * params
 * old, _new, _newRepeat
 */
api.post('/modify-password', (req, res, next) => {
    if (req.body._new !== req.body._newRepeat) {
        return res.json({code:-1, msg:'两次输入的密码不一致'});
    }
    req.checkBody('old', 'invalid pass').len32();
    req.checkBody('_new', 'invalid pass').len32();
    let errors = req.validationErrors();
    if (errors) {
        console.error(errors);
        return res.json({
            code:-1,
            msg:'密码格式有误',
        });
    }
    if (req.body.old === req.body._new) {
        return res.json({
            code: -1,
            msg:'新旧密码不能一样',
        });
    }

    User.findById(req.session.isLogin, (err, doc) => {
        if (err || !doc) {
            console.error(err);
            return res.json({code:3, msg:'未知错误', detail: err});
        }
        if (!doc.validPassword(req.body.old)) {
            return res.json({code: 0, msg:'原密码有误'});
        }

        doc.password = doc.encryptPassword(req.body._new);
        doc.save()
            .then(() => res.json({code:1, msg:'修改成功'}))
            .catch(err => {
                console.error(err);
                res.json({code:-1, msg:'修改失败', detail: err})
            });
    })
});

/**
 * 忘记密码
 * _new, _newRepeat
 */
api.post('/forget', (req, res, next) => {
    if (req.body._new !== req.body._newRepeat) {
        return res.json({code:-1, msg:'两次输入的密码不一致'});
    }
    req.checkBody('_new', 'invalid pass').len32();
    if (req.validationErrors()) {
        return res.json({code:-1, msg:'密码格式有误'});
    }

    User.findById(req.session.isLogin, (err, doc) => {
        if (err || !doc) {
            console.error(err);
            return res.json({code:3, msg:'未知错误', detail: err});
        }
        doc.password = doc.encryptPassword(req.body._new);
        doc.save()
            .then(() => res.json({code:1, msg:'修改成功'}))
            .catch(err => {
                console.error(err);
                res.json({code:2, msg:'修改失败', detail: err})
            });
    });
});

/**
 * 修改昵称
 * nick
 */
api.post('/modify-nick', (req, res, next) => {
    req.checkBody('nick', 'invalid nick').len(2, 30);
    if (req.validationErrors()) {
        return res.json({code:-1, msg: '昵称长度为2-30个字符'});
    }
    User.findById(req.session,isLogin, (err, doc) => {
        if (err || !doc) {
            console.error(err);
            return res.json({code:3, msg:'未知错误', detail: err});
        }
        doc.nick = req.body.nick;
        doc.save()
            .then(() => res.json({code:1, msg:'修改成功'}))
            .catch(err => {
                console.error(err);
                res.json({code:2, msg:'修改失败', detail: err})
            });
    });
});

/**
 * 修改头像
 * FormData
 */
api.post('/modify-avatar', (req, res, next) => {
    let imgData = req.body.avatar;
    let base64 = imgData.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64, 'base64');
    fs.writeFile('./public/data/avatar/' + req.session.isLogin + '.jpg', dataBuffer, err => {
        if (err) {
            return res.json({code:-1, msg:'上传失败', detail: err});
        }
        res.json({code: 1, msg:'success', path:'/data/avatar/' + req.session.isLogin + '.jpg'});
    });
});

module.exports = api;