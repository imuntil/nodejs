/**
 * Created by 斌 on 2017/4/3.
 */
suite('Global Tests', () => {
    test(`page has a valid title`, () => {
        assert(document.title && document.title.match(/\S/) &&
                document.title.toUpperCase() !== 'TODO');
    })
})