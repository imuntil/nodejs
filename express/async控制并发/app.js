const async = require('async');
const fs = require('fs')

let concurrencyCount = 0;
let fetchUrl = function (url, callback) {
    let delay = parseInt((Math.random() * 100000000) % 2000, 10);
    concurrencyCount ++;
    console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
    setTimeout(() => {
        concurrencyCount--;
        callback(null, url + ' html content');
    }, delay)
};

let urls = [];
for (let i = 0; i < 30; i++) {
    urls.push('http://datasource_' + i);
}

async.mapLimit(urls, 5, (url, callback) => {
    fetchUrl(url, callback)
}, (err, result) => {
    console.log('final');
    console.log(result);
});