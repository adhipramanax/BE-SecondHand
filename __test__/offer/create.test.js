require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

describe("POST /api/v1/offer", () => {
  let accessToken;

  beforeEach(() => {
    accessToken = request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "bagus@binar.co.id",
        password: "123456",
      })
      .then((res) => {
        return res.body.data.token;
      });
  });

  it("should response with 201 as status code", async () => {
    return request(app)
      .post("/api/v1/offer")
      .set("Authorization", `Bearer ${await accessToken}`)
      .send({
        offer_price: 2000000,
        id_product: 1,
      })
      .then((res) => {
        expect(res.body.meta.code).toBe(201);
      })
  })

  it("should response with 422 as status code", async () => {
    return request(app)
      .post("/api/v1/offer")
      .set("Authorization", `Bearer ${await accessToken}`)
      .send({})
      .then((res) => {
        expect(res.body.meta.code).toBe(422);
      })
  })
 
});

