/**
 * Created by 斌 on 2017/4/6.
 */
const assert = require('chai').assert;
const http = require('http');
const rest = require('restler');

suite('API tests', () => {
    let attraction = {
        lat: 45.516011,
        lng: -122.682062,
        name: 'Portland Art Museum',
        description: 'Founded in 1892, the Portland .............',
        email: 'test@meadowlarktravel.com',
    };

    let base = 'http://localhost:3000';
    test('should be able to add an attraction', done => {
        rest.post(base + '/api/attraction', {data: attraction})
            .on('success', data => {
                assert.match(data.id, /\w/, 'id must be set');
                done();
            });
    });
    test('should be able to retrieve an attraction', done => {
        rest.post(base + '/api/attraction', {data: attraction})
            .on('success', data => {
                rest.get(base + '/api/attraction/' + data.id)
                    .on('success', data => {
                        assert(data.name === attraction.name);
                        assert(data.description === attraction.description);
                        done();
                    });
            });
    });
});