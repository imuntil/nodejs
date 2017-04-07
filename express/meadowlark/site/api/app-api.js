/**
 * Created by 斌 on 2017/4/6.
 */
const router = require('express').Router();
const reg = require('../lib/common-reg');
const _ = require('lodash');
const Attraction = require('../models/attraction');
const NewsletterSignedListener = require('../models/newsletter-signup');
const VacationInSeasonListener = require('../models/vacation-in-season-listener')
const upload = require('../lib/storage')

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
    let {name, email} = req.body;
    if (!email.match(reg.email) || !_.trim(name)) {
        //验证失败
        return res.json({
            code:-1,
            msg:'邮箱或姓名不合法'
        });
    }

    //验证通过
    new NewsletterSignedListener({name: name, email: email})
        .save()
        .then(() => {
            res.json({
                code:1,
                msg:'success'
            });
        })
        .catch(err => {
            res.json({
                code:2,
                msg:'数据库出错!'
            })
        })
});

//保存或更新用户的信息（notify-me-when-in-season）
router.post('/notify-me', (req, res) => {
    console.log(req.body);
    let {email} = req.body;
    if (!email.match(reg.email)) {
        return res.json({
            code:-1,
            msg:'邮箱不合法'
        });
    }

    VacationInSeasonListener.update(
        {email: email},
        {$push: {skus: req.body.sku}},
        {upsert: true},
        err => {
            if (err) {
                res.json({
                    code:2,
                    msg:'数据库出错'
                })
            } else {
                res.json({
                    code:1,
                    msg:'success'
                })
            }
        }
    )
});


//保存用户的货币偏好
router.get('/set-currency/:currency', (req, res) => {
    req.session.currency = req.params.currency || 'USD';
    res.json({
        code:1,
        msg:'success'
    })
});

//报名参加tours


//contest/vacation-photo,上传图片
router.post(`/contest/vacation-photo`, upload.single('photo'), (req, res, next) => {
    if (req.file) {
        res.json({
            code:1,
            msg:'success'
        })
    } else {
        res.json({
            code:3,
            msg:'上传失败'
        })
    }
});


module.exports = router;