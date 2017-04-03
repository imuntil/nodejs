/**
 * Created by 斌 on 2017/2/18.
 */
process.on('exit', function (code) {
    setTimeout(function () {
        console.log('改代码不会执行');
    }, 0);
    console.log('退出码为：', code);
});
console.log('程序执行结束');


process.stdout.write('Hello World' + '\n');
process.argv.forEach(function (val, index, array) {
    console.log(index + ':' + val);
});
console.log('node.exe:' + process.execPath);
console.log('平台系统:' + process.platform);
console.log(process.version);
console.log(process.arch);

console.log('---------------------------');

console.log('当前目录:' + process.cwd());
console.log(process.memoryUsage());