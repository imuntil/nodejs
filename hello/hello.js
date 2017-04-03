/**
 * Created by 斌 on 2017/2/18.
 */
function Hello() {
    var name ;
    this.setName = function (thyName) {
        name = thyName;
    };
    this.sayHello = function () {
        console.log('Hello ' + name);
    };
}
module.exports = Hello;