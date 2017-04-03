/**
 * Created by 斌 on 2017/3/9.
 */
$(function () {
    // $.ajax({
    //
    //     type: "GET",
    //
    //     url: "/api/v1/tasks",
    //
    //     success: function(msg){
    //
    //         console.log(msg);
    //
    //     }
    //
    // });

    // $.ajax({
    //
    //     type: "POST",
    //
    //     url: "/api/v1/tasks",
    //
    //     data:{task:Math.random()},
    //
    //     success: function(msg){
    //
    //         console.log(msg);
    //
    //     }
    //
    // });

    $.ajax({
        type:'GET',
        url:'/api/v1/tasks/task',
        data:{id:'58c162ee8e21992dacefcbd5'},
        success:function (msg) {
            console.log(msg);
        }
    });
    // $.ajax({
    //     type:'GET',
    //     url:'/api/v1/tasks/58b4f0589e2e333e54e8788b',
    //     success:function (msg) {
    //         console.log(msg);
    //     }
    // })

    // $.ajax({
    //     type:'PUT',
    //     url:'/api/v1/tasks/58b4f0589e2e333e54e8788b',
    //     data:{task:Math.random()},
    //     success:function (msg) {
    //         console.log(msg);
    //     }
    // })

    // $.ajax({
    //     type:'DELETE',
    //     url:'/api/v1/tasks/58b4f0589e2e333e54e8788b',
    //     success:function (msg) {
    //         console.log(msg);
    //     }
    // })
});