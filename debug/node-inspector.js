/**
 * Created by 斌 on 2017/2/28.
 */
var foo = function(){
    var a = 3, b = 5;
    var bar = function() {
        var b = 7, c = 11;
        a += b + c;
    };
    bar ();
};
foo();
