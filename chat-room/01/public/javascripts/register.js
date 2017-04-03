/**
 * Created by 斌 on 2017/3/1.
 */
var socket = io.connect();
$(function () {
    var nickname = $('#nickname');
    $('.register').submit(function (e) {
        socket.emit('nickname', nickname.val(), function (data) {
            if (data) {
                console.log('nickname set successfully');
                $('.register').hide();
                $('.register-warn')
                    .text('nickname set successfully, your nickname is ' + nickname.val())
                    .css('visibility', 'visible');
                $('.chat-box').show();
            } else {
                if (data === 0) {
                    $('.register-warn')
                        .text('the nickname can not be empty')
                        .css('visibility','visible');
                } else {
                    $('.register-warn')
                        .text('the nickname has been used')
                        .css('visibility','visible');
                }
            }
        });
        //e.preventDefault;
        return false;
    });

    var chartContent = $('#chatting');
    $('.chat-box').submit(function (e) {
        e.preventDefault();
        socket.emit('chatting-content', chartContent.val());
        chartContent.val('').focus();
    });

    var list = $('.nicknames-list'),
        ri = $('.register-info');
    var logo = 0;
    socket.on('pull-nicknames', function (data) {
        logo ++;
        console.log(data);
        var html = '';
        data.nicknames.forEach(function (item, index) {
            html += '<li class="list-group-item">' + item + '</li>';
        });
        list
            .empty()
            .append(html);

        var _class = 'logo-' + logo;
        if (data._in) {
            ri.append('<div class="alert alert-info '+ _class +'">' +
                data.changeChatter + ' gets in the room</div>');
            $('.' + _class).fadeOut(2000);
        } else  {
            ri.append('<div class="alert alert-info '+ _class +'">' +
                data.changeChatter + ' leave the room</div>');
            $('.' + _class).fadeOut(2000);
        }
    });

    var room = $('.chat-room');
    socket.on('chatting-content', function (data) {
        var html = '<div class="panel panel-info">' +
            '<div class="nick panel-heading">' + data.nick + ':</div>' +
            '<div class="message panel-body">' + data.message + '</div>' +
            '</div>';
        room.append(html);
    });
});