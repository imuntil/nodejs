/**
 * Created by 斌 on 2017/2/28.
 */
var sum = 0;
var array = new Array(1000000);

for (var i = 0; i < array.length; i++) {
    array[i] = Math.random();
}

console.time('for-loop-1');
for (var i in array) {
    sum += array[i];
}
console.timeEnd('for-loop-1');

console.time('for-loop-2');
for (var i = 0; i < array.length; i++) {
    sum += array[i];
}
console.timeEnd('for-loop-2');