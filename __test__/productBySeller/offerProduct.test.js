require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

// get product offer
describe('GET /api/v1/seller/product/offer', () => { 
    let accessToken;

    beforeEach(async () => {
        accessToken = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "bagus@binar.co.id",
                password: "123456"
            }).then((res)=>{
                return res.body.data.token;
            });
    });

    it("should response with 200 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product/offer")
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(200);
            }).catch((err) => {
                console.log(err);
            });
        });
    it("should response with 500 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product/offer" + undefined)
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
        });
});

// get offer product by id
describe('GET /api/v1/seller/product/offer/:id', () => { 
    let accessToken;

    beforeEach(async () => {
        accessToken = await request(app)
            .post("/api/v1/auth/login")
            .send({
                email: "bagus@binar.co.id",
                password: "123456"
            }).then((res)=>{
                return res.body.data.token;
            });
    });
    it("should response with 200 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product/offer/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(200);
            }).catch((err) => {
                console.log(err);
            });
        });
    
    it("should response with 500 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product/offer/1" + undefined)
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
        });
});
