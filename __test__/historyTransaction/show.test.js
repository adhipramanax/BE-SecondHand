require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

describe("GET /api/v1/history", () => {
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
      .get("/api/v1/offer/history?id_product=1")
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("should response with 200 as status code", () => {
    return request(app)
      .get("/api/v1/offer/history?id_product=1&order=true")
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("should response with 404 as status code", () => {
    return request(app)
      .get("/api/v1/offer/history?id_product=6")
      .set("Authorization", `Bearer ${accessToken}`)
      .then((res) => {
        expect(res.status).toBe(404);
      });
  });

//   Belum
//   it("should response with 500 as status code", () => {
//     return request(app)
//       .get("/api/v1/wishlist")
//       .set("Authorization", `Bearer ${accessToken}`)
//       .then((res) => {
//         expect(res.status).toBe(500);
//       });
//   });
});
