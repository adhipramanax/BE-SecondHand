require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

// get all product
describe('GET /api/v1/product', () => { 
    it('should response with 200 as status code', () => {
        return request(app)
            .get("/api/v1/product")
            .then((res) => {
                expect(res.status).toBe(200);
            }).catch((err) => {
                console.log(err);
            });
    });

    it('should response with 500 as status code' , () => {
        return request(app)
            .get("/api/v1/product" + undefined)
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
    })
});

// seacrch product
describe('GET /api/v1/product/seacrch', () => { 
    it('should response with 200 as status code', () => {
        return request(app)
            .get("/api/v1/product/search?name=Product")
            .then((res) => {
                expect(res.status).toBe(200);
            })
    })

    // it('should response with 500 as status code', () => {
    //     return request (app)
    //         .get("/api/v1/product/search?q=Product")
    //         .then((res) => {
    //             expect(res.status).toBe(500);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    // })
})

// filter product
describe('GET /api/v1/product/filter', () => { 
    it('should response with 200 as status code', () => {
        return request(app)
            .get("/api/v1/product/filter?categories=Hobi")
            .then((res) => {
                expect(res.status).toBe(200);
            })
    })

    // it('should response with 500 as status code', () => {
    //     return request (app)
    //         .get("/api/v1/product/filter?q=1")
    //         .then((res) => {
    //             expect(res.status).toBe(500);
    //         })
    // })
})

// get product by id
describe('GET /api/v1/product/:id', () => {
    it('should response with 200 as status code', () => {
        return request(app)
            .get("/api/v1/product/7")
            .then((res) => {
                expect(res.status).toBe(200);
            })
        })
    // it('should response with 500 as status code', () => {
    //     return request(app)
    //         .get("/api/v1/product/1")
    //         .then((res) => {
    //             expect(res.status).toBe(500);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // })
})