/**
 * Created by 斌 on 2017/3/1.
 */
var socket = io.connect('http://localhost:8080');
socket.on('change', function (data) {
    console.log('user ' + data.pageIndex + ' got in');
});
socket.on('welcome', function (data) {
    console.log(data.text);
});