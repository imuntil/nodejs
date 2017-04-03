/**
 * Created by 斌 on 2017/2/18.
 */
var events = require('events');
var emitter = new events.EventEmitter();
emitter.on('someEvent', function (arg1, arg2) {
    console.log('listen1', arg1, arg2);
});
emitter.on('someEvent', function (arg1, arg2) {
    console.log('listen2', arg1, arg2);
});
emitter.emit('someEvent', '参数1', '参数2');