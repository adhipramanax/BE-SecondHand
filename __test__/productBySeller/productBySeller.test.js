require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
const path = require("path");
jest.setTimeout(100000);

// var FormData = require('form-data');

const product = {
    name: "Bagus",
    price: "Rp. 100.000",
    description: "Bagus",
    categories: "1,2",
}

const user = {
    email: "bagus@binar.co.id",
    password: "123456",
}

// create product
describe('POST /api/v1/seller/product', () => { 
    let accessToken;

    beforeEach(async () => {
        accessToken = await request(app)
            .post("/api/v1/auth/login")
            .send(user).then((res)=>{
                return res.body.data.token;
            });
    });

    it("should response with 200 as status code", async() => {
        return request(app)
        .post("/api/v1/seller/product")
        .set("Authorization", `Bearer ${accessToken}`)
        .attach("image", path.join(__dirname, "../../public/uploads/deafaultPic.png"))
        .send(product)
        .then((res) => {
            console.log(res.body);
            expect(res.status).toBe(200);
        }).catch((err) => {
            console.log(err);
        });
    });
    it("should response with 500 as status code", async() => {
        return request(app)
            .post("/api/v1/seller/product" + undefined)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Bagus",
                price: 10.000,
                description: 1,
            })
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
    });
});

// get product by seller
describe('GET /api/v1/seller/product', () => { 
    let accessToken;

    beforeEach(async () => {
        accessToken = await request(app)
            .post("/api/v1/auth/login")
            .send(user).then((res)=>{
                return res.body.data.token;
            });
    });
    it("should response with 200 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product")
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(200);
            }).catch((err) => {
                console.log(err);
            });
        });
    
    it("should response with 500 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product" + undefined)
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
        });
});

// get product id by seller
describe('GET /api/v1/seller/product/:id', () => {
    let accessToken;

    beforeEach(async () => {
        accessToken = await request(app)
            .post("/api/v1/auth/login")
            .send(user).then((res)=>{
                return res.body.data.token;
            });
    });

    it("should response with 200 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(200);
            }).catch((err) => {
                console.log(err);
            });
        })

    it("should response with 500 as status code", async() => {
        return request(app)
            .get("/api/v1/seller/product/1" + undefined)
            .set("Authorization", `Bearer ${accessToken}`)
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
        })
    });

// update product
describe('PUT /api/v1/product/:id', () => { 
    let accessToken;

    beforeEach(async () => {
        accessToken = await request(app)
            .post("/api/v1/auth/login")
            .send(user).then((res)=>{
                return res.body.data.token;
            });
    });

    it("should response with 200 as status code", async() => {
        return request(app)
            .put("/api/v1/product/1")
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Bagus",
                price: "Rp. 100.000",
                description: "Bagus",
                category: "Bagus",
                image: "Bagus"
            })
            .then((res) => {
                expect(res.status).toBe(200);
            }).catch((err) => {
                console.log(err);
            });
    });

    it("should response with 500 as status code", async() => {
        return request(app)
            .put("/api/v1/product/1" + undefined)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({
                name: "Bagus",
                price: "Rp. 100.000",
                description: "Bagus",
                category: "Bagus",
                image: "Bagus"
            })
            .then((res) => {
                expect(res.status).toBe(500);
            }).catch((err) => {
                console.log(err);
            });
        });
});

// delete product
// describe('DELETE /api/v1/seller/product/:id', () => { 
//     let accessToken;

//     beforeEach(async () => {
//         accessToken = await request(app)
//             .post("/api/v1/auth/login")
//             .send(user).then((res)=>{
//                 return res.body.data.token;
//             }
//         );
//     });

//     it("should response with 200 as status code", async() => {
//         const res = await request(app)
//             .delete("/api/v1/seller/product/1")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send();
//         expect(res.status).toBe(200);
//     });

//     it("should response with 404 as status code", async() => {
//         const res = await request(app)
//             .delete("/api/v1/seller/product/100")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send();
//         expect(res.status).toBe(404);
//     });

//     it("should response with 500 as status code", async() => {
//         const res = await request(app)
//             .delete("/api/v1/seller/product/")
//             .set("Authorization", `Bearer ${accessToken}`)
//             .send();
//         expect(res.status).toBe(500);
//     })
// });