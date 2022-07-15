require('dotenv').config();
const request = require('supertest');
const app = require('../../app')
jest.setTimeout(100000)

describe('Login (/auth/login)', () => {
    it('jika status respon code 201', () => {
        return request(app)
            .post('/auth/login')
            .send({
                email: 'panji@binar.co.id',
                password: '123456'
            })
            .then(res => {
                expect(res.status).toBe(201)
            })
    });

    it('jika status respon code 404', () => {
        return request(app)
            .post('/auth/login')
            .send({
                name: 'bari',
                email: 'bari@binar.co.id',
                password: '123456'
            })
            .then(res => {
                expect(res.status).toBe(404)
            })
    });

    it('jika status respon code 401', () => {
        return request(app)
            .post('/auth/login')
            .send({
                name: 'panji ',
                email: 'panji@binar.co.id',
                password: '1434'
            })
            .then(res => {
                expect(res.status).toBe(401)
            })
    });
})

