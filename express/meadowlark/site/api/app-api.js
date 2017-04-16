/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();
const reg = require('../lib/common-reg');
const _ = require('lodash');
const Attraction = require('../models/attraction');
const NewsletterSignedListener = require('../models/newsletter-signup');
const VacationInSeasonListener = require('../models/vacation-in-season-listener')
const Orders = require('../models/orders');
const User = require('../models/user');
const upload = require('../lib/storage');
const passport = require('passport');
const path = require('path');
const fs = require('fs');

//获取所有attractions（景点）
router.get('/attractions', (req, res) => {
    Attraction.find({approved: true}, (err, attractions) => {
        if (err) {
            return res.send(500, 'Error occurred: database error.');
        }
        console.log(attractions);
        res.json(attractions.map(a => {
            return {
                name: a.name,
                id: a._id,
                description: a.description,
                location: a.location,
            }
        }));
    });
});

//新增景点
router.post('/attraction', (req, res) => {
    let a = new Attraction({
        name: req.body.name,
        description: req.body.description,
        location: {lat: req.body.lat, lng: req.body.lng},
        history: {
            event:'created',
            email:req.body.email,
            date:new Date(),
        },
        approved: false,
    });
    a.save()
        .then(() => {
            res.json({id: a._id});
        })
        .catch(e => res.send(500, 'Error occurred: database error'));
});

//获取某个景点
router.get('/attraction/:id', (req, res) => {
    Attraction.findById(req.params.id, (err, a) => {
        if (err) {
            return res.send(500, 'Error occurred: database error');
        }
        res.json({
            name: a.name,
            id: a._id,
            description: a.description,
            location: a.location,
        });
    });
});

//订阅,接受网站的新闻，活动推送
router.post('/process', (req, res) => {
    //验证邮箱和姓名
    req.checkBody('email', 'invalid email').isEmail();
    req.checkBody('name', 'invalid name').len(2, 30);
    let errors = req.validationErrors();
    if (errors) {
        return res.json({code: -1, msg: '邮箱或姓名不合法'});
    }

    //验证通过
    new NewsletterSignedListener({name: name, email: email})
        .save()
        .then(() => {
            res.json({ code:1, msg:'success' });
        })
        .catch(err => {
            res.json({ code:2, msg:'数据库出错!' })
        })
});

//保存或更新用户的信息（notify-me-when-in-season）
router.post('/notify-me', (req, res) => {

    req.checkBody('email', 'invalid email').notEmpty().isEmail();
    let errors = req.validationErrors();
    if (errors) {
        return res.json({code: -1, msg: '邮箱不和法'});
    }

    VacationInSeasonListener.update(
        {email: email},
        {$push: {skus: req.body.sku}},
        {upsert: true},
        err => {
            if (err) {
                res.json({ code:2, msg:'数据库出错' })
            } else {
                res.json({ code:1, msg:'success' })
            }
        }
    )
});


//保存用户的货币偏好
router.get('/set-currency/:currency', (req, res) => {
    req.session.currency = req.params.currency || 'USD';
    req.session.save();
    // res.json({ code:1, msg:'success' })
    res.redirect(303, '/vacation/all')
});

//报名参加tours


//contest/vacation-photo,上传图片
router.post(`/contest/vacation-photo`, upload.photo.single('photo'), (req, res, next) => {
    if (req.file) {
        res.json({ code:1, msg:'success' })
    } else {
        res.json({ code:3,  msg:'上传失败' })
    }
});


//user login | signup

router.post(
    '/user/sign-up',
    (req, res, next) => {
        passport.authenticate('local.sign', (err, user, info) => {
            if (!user) {
                //认证未通过
                res.json(info);
            } else {
                res.json(info);
            }
        })(req, res, next);
    }
);

router.post(
    '/user/login',
    (req, res, next) => {
        passport.authenticate('local.login', (err, user, info) => {
            console.log(user);
            if (user) {
                //建立登录会话
                req.session.isLogin = user._id;
                req.session.save();
            }
            res.json(info);
        })(req, res, next);
    }
);

router.get(
    '/user/logout',
    (req, res, next) => {
        req.session.isLogin = false;
        res.redirect('/home');
    }
);

//user 更新信息
router.post(
    '/user/update',
    (req, res) => {
        let id = req.session.isLogin;
        User.findByIdAndUpdate(id, {$set: _.omit(req.body, '_csrf')}, (err, doc) => {
            if (err) {
                return res.json({ code:2, msg:'数据库出错', });
            }
            return res.json({ code: 1, msg:'success', });
        });
    }
);

//user 更新头像
router.post(
    '/user/avatar',
    upload.avatar.single('avatar'),
    (req, res, next) => {
        if (req.file) {
            User.findByIdAndUpdate(req.session.isLogin, {$set: {avatar: '/data/avatar/' + req.file.filename}}, (err, doc) => {
                if (err) {
                    res.json({ code:2, msg:'数据库出错', detail: err })
                } else {
                    res.json({ code:1, msg:'success' })
                }
            });

        } else {
            res.json({ code:3, msg:'上传失败' })
        }
    }
);
router.post('/user/avatar-base64', upload.avatar.single('avatar'), (req, res, next) => {

    //接收前台POST过来的base64
    let imgData = req.body.avatar;
    let imgName = req.session.isLogin;
    console.log('img-name:', imgName);
    //过滤data:URL
    let base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
    let dataBuffer = new Buffer(base64Data, 'base64');
    fs.writeFile("./public/data/avatar/" + imgName + '.jpg' , dataBuffer, function(err) {
        if(err){
            res.json({code: -1});
        }else{
            return res.json({code:1, msg:'success'});
        }
    });
});

//修改密码
router.post(
    '/user/modify-password',
    upload.empty(),
    (req, res, next) => {

        //核对两次密码是否一致
        //code.....
        //核对新密码是否合法，字符、长度等
        req.checkBody('old', 'invalid pass').len(6, 20);
        req.checkBody('_new', 'invalid pass').len(6, 20);
        let errors = req.validationErrors();
        console.log(errors);
        if (errors) {
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
                return res.json({
                    code:3,
                    msg:'未知错误',
                    detail: err,
                });
            }

            //核对旧密码
            if (!doc.validPassword(req.body.old)) {
                return res.json({
                    code: 0,
                    msg:'原密码有误,修改失败',
                });
            }

            //修改密码
            doc.password = doc.encryptPassword(req.body._new);
            doc.save()
                .then(() => res.json({code:1, msg:'修改成功'}))
                .catch(err => {
                    console.error(err);
                    res.json({code:-1, msg:'修改失败', detail: err})
                })
        });
    }
);


//order 提交订单
router.post(
    '/vacation/join',
    upload.empty(),
    (req, res, next) => {
        console.log(req.body);
        let order = new Orders();
        order.date = new Date();
        order.orderNumber = +order.date + '-' + Math.floor(Math.random()*10000);
        order.customID = req.session.isLogin;
        order.money = req.body.money;
        order.count = req.body.count;
        order.sku = req.body.sku;
        order.status = 0;
        order.save()
            .then(() => {
                res.json({code:1, msg: 'success'});
            })
            .catch(err => {
                res.json({code:2, msg:'数据库出错', detail: err});
            });
    }
);


router.get(
    '/test/download',
    (req, res, next) => {
        // // res.links({
        // //     next:'/',
        // //     last:'vacation/all'
        // // });
        // res.location('http://www.baidu.com');
        // // res.download('public/img/logo.jpg');
        // res.end();

        let options = {
            root: path.resolve(__dirname, '../') + '/public/',
            dotfiles: 'allow',
            headers:{
                'x-timestamp': Date.now(),
                'x-sent': true,
            }
        };
        res.sendFile('img/logo.png', options, err => {
            if (err) {
                console.log(err);
                res.status(err.status).end();
            } else {
                console.log('success');
            }
        })
    }
);
module.exports = router;