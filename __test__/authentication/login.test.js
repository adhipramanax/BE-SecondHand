require('dotenv').config();
const request = require('supertest');
const app = require('../../app')
jest.setTimeout(100000)

describe('Login (/api/v1/auth/login)', () => {
    it('jika status respon code 200', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                email: 'panji@binar.co.id',
                password: '123456'
            })
            .then(res => {
                expect(res.status).toBe(200)
            })
    });

    it('jika status respon code 404', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                name: 'bari',
                email: 'bari@binar.co.id',
                password: '123456'
            })
            .then(res => {
                expect(res.status).toBe(404)
            })
    });

    it('jika status respon code 403', () => {
        return request(app)
            .post('/api/v1/auth/login')
            .send({
                name: 'panji ',
                email: 'panji@binar.co.id',
                password: '1434'
            })
            .then(res => {
                expect(res.status).toBe(403)
            })
    });
})

