var counter1 = require('./counter');
var counter2 = require('./counter');
console.log(counter1.count());
console.log(counter2.count());
console.log(counter2.count());

var Hello = require('./hello');
hello = new Hello();
hello.setName('jack');
hello.sayHello();