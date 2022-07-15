require('dotenv').config();
const request = require('supertest');
const app = require('../../app')
jest.setTimeout(100000)

describe('Register (/auth/register)', () => {
    it('jika status respon code 201', () => {
        return request(app)
            .post('/auth/register')
            .send({
                name: 'rayi',
                email: 'rayi@binar.co.id',
                password: '123456'
            })
            .then(res => {
                expect(res.status).toBe(201)
            })
    });
})