/**
 * Created by 斌 on 2017/2/28.
 */
var assert = require('assert'),
    fs = require('fs');

describe('Async testing', function () {
    describe('when using fs.stat on a file', function () {
        it('should not be empty', function (done) {
            fs.stat('test.txt', function (err, stat) {
                assert.notStrictEqual(stat.size, 0);
                done();
            });
        });
    });
});