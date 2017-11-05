const request = require('supertest')
const expect = require('chai').expect
const app = require('../app.js')

describe('user-api', () => {

    it('getUser', done => {

        request(app.listen())
            .get('/api/users/getUser?id=1')
            .expect(200)
            .end((err, res) => {
                console.log(res.body)
                //断言data属性是一个对象
                expect(res.body.data).to.be.an('object')
                done()
            })
    })

    it('registerUser', done => {
        const user = {
            username: 'zhin',
            age: 20
        }
        request(app.listen())
            .post('/api/users/registerUser')
            .send(user)
            .set('Content-Type', 'application/json')
            .expect(200)
            .end((err, res) => {
                console.log(res.body)
                // 断言返回的code是0
                expect(res.body.code).to.be.equal(0)
                done()
            })
    })
})