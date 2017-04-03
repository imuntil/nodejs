/**
 * Created by 斌 on 2017/3/13.
 */
var express = require('express');
var superagent = require('superagent');
var cheerio = require('cheerio');

var app = express();
app.get('/', function (req, res, next) {
    superagent.get('http://cnodejs.org/')
        .end(function (err, sres) {
            if (err) {
                return next(err);
            }

            var $ = cheerio.load(sres.text);
            var items = [];
            // $('#topic_list .topic_title').each(function (idx, element) {
            //     var $element = $(element);
            //     items.push({
            //         title: $element.attr('title'),
            //         href: $element.attr('href')
            //     });
            // });
            $('#topic_list>div').each(function (idxm, element) {
                var el1 = $(element).find('.topic_title'),
                    el2 = $(element).find('.user_avatar');
                items.push({
                    title:el1.attr('title'),
                    href:el1.attr('href'),
                    author:el2.attr('href').replace(/\/user\//, '')
                });
            });
            res.send(items);

        });
});

app.listen(3000, function (req, res) {
    console.log('app is running at port 3000');
});