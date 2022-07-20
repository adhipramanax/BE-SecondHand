require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

describe("POST /api/v1/wishlist", () => {
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

  it("should response with 201 as status code", () => {
    return request(app)
      .post("/api/v1/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id_product: 3
      })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("should response with 400 as status code", () => {
    return request(app)
      .post("/api/v1/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        id_product: 3
      })
      .then((res) => {
        expect(res.status).toBe(400);
      });
  });

  it("should response with 500 as status code", () => {
    return request(app)
      .post("/api/v1/wishlist")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({})
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});
