require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

describe("GET /api/v1/categories", () => {

  it("should response with 200 as status code", () => {
    return request(app)
      .get("/api/v1/categories")
      .then((res) => {
        expect(res.status).toBe(200);
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
