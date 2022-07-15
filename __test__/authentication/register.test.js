require('dotenv').config();
const request = require('supertest');
const app = require('../../app')
jest.setTimeout(100000)

describe('Register (/api/v1/auth/register)', () => {
    it('jika status respon code 201', () => {
        return request(app)
            .post('/api/v1/auth/register')
            .send({
                name: 'jenny',
                email: 'jenny@binar.co.id',
                password: '123456'
            })
            .then(res => {
                expect(res.status).toBe(201)
            })
    });
})