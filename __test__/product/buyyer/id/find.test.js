require("dotenv").config();
const request = require("supertest");
const app = require("../../../../app");
jest.setTimeout(100000);

describe("GET /api/v1/product/:id", () => {
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
      .get("/api/v1/product/1")
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("should response with 500 as status code", () => {
    return request(app)
      .get("/api/v1/product/8")
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});
