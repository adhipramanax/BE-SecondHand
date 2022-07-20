require("dotenv").config();
const request = require("supertest");
const app = require("../../../../app");
jest.setTimeout(100000);

describe("PUT /api/v1/seller/product/status/:id", () => {
  let accessToken;

  beforeEach(async () => {
    accessToken = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: "bagus@binar.co.id",
        password: "123456",
      })
      .then((res) => {
        return res.body.data.token;
      });
  });

  it("should response with 200 as status code", () => {
    return request(app)
      .put("/api/v1/seller/product/status/1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status_product: true
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("should response with 200 as status code", () => {
    return request(app)
      .put("/api/v1/seller/product/status/1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status_sell: true
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("should response with 404 as status code", () => {
    return request(app)
      .put("/api/v1/seller/product/status/8")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status_sell: true
      })
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

  it("should response with 403 as status code", () => {
    return request(app)
      .put("/api/v1/seller/product/status/3")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        status_sell: true
      })
      .then((res) => {
        expect(res.status).toBe(403);
      });
  });
});
