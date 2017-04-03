/**
 * Created by 斌 on 2017/2/18.
 */
var server = require('./server');
var router = require('./router');

server.start(router.route);

