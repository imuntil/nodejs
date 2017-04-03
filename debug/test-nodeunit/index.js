/**
 * Created by 斌 on 2017/2/28.
 */
exports.firstText = function (test) {
    test.expect(1);
    test.strictEqual('here', 'here');
    test.done();
};

exports.secondText = function (test) {
    test.expect(2);
    test.strictEqual('here', 'hera');
    test.done();
};