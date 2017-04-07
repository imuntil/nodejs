/**
 * Created by 斌 on 2017/4/3.
 */
suite(`'About' Page Tests`, () => {
    test(`page should contain link to contact page`, () => {
        assert($(`a[href='/contact/']`).length);
    })
})