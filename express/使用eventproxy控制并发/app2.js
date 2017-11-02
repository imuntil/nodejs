/**
 * Created by 斌 on 2017/3/13.
 */
const  eventproxy = require( 'eventproxy');
const superagent = require( 'superagent');
const cheerio = require( 'cheerio');
const url = require('url');

let cnodeUrl = 'https://takigen.com';

superagent.get(cnodeUrl)
    .end((err, res) => {
        if (err) {
            return console.error(err)
        }

        let topicUrls = [];
        let $ = cheerio.load(res.text);

        $('.Index__Solution .List__Horizontal a').each((idx, element) => {
            let $element = $(element);
            let href = $element.attr('href').slice(10, -5)
            // let href = url.resolve(cnodeUrl, $element.attr('href'));
            topicUrls.push(href);
        });
        // topicUrls.splice(2, 38);
        console.log(topicUrls.join(' '));

        let ep  = new eventproxy();

        // ep.after('user-points', topicUrls.length, function (users) {
        //     users = users.map(user => {
        //         let title = user[0].title,
        //             href = user[0].href,
        //             comment1 = user[0].comment1,
        //             $ = cheerio.load(user[1]);
        //
        //         let temp = $('#sidebar .user_card');
        //         return ({
        //             title:title,
        //             href:href,
        //             comment1:comment1,
        //             user:temp.find('.user_name .dark').text().trim(),
        //             points: temp.find('.floor .big').text().trim()
        //         })
        //     })
        //     console.log('_______________________________________');
        //     console.log(users);
        // })
        //
        ep.after('topic_html', topicUrls.length, function (topics) {

            topics = topics.map(topicPair => {
                let topicUrl = topicPair[0],
                    topicHtml = topicPair[1],
                    $ = cheerio.load(topicHtml);

                return ({
                    // title: $('.topic_full_title').text().trim(),
                    // href:topicUrl,
                    // comment1:$('.reply_content').eq(0).text().trim(),
                    // author_link: url.resolve(cnodeUrl, $('.author_content').eq(0).find('.user_avatar').attr('href')),
                  bg: $('#Content .HeadGroup .Caption').eq(0).text().trim()
                  // bg: url.resolve(cnodeUrl, $('#Content .HeadGroup:first-child').css('backgroundUrl'))
                })
            })
            console.log('final');
            console.log(topics);

            // topics.forEach(item => {
            //     superagent.get(item.author_link).end((err, res) => {
            //         ep.emit('user-points',[item, res.text])
            //     })
            // })
        })

        // topicUrls.forEach(topicUrl => {
        //     superagent.get(topicUrl).end((err, res) => {
        //         console.log('fetch ' + topicUrl + ' successful');
        //         ep.emit('topic_html', [topicUrl, res.text])
        //     })
        //     // superagent.get(topicUrl).end(ep.group('topic_html'));
        // })
    });

