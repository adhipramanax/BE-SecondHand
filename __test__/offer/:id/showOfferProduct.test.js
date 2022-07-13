require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
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

  it("should response with 200 as status code", async () => {
    return request(app)
      .get('/api/v1/offer/' + 1)
      .set("Authorization", `Bearer ${await accessToken}`)
      .then((res) => {
        expect(res.body.meta.code).toBe(200);
      })
  })

  it("should response with 500 as status code", async () => {
    return request(app)
      .get('/api/v1/offer/' + undefined)
      .set("Authorization", `Bearer ${await accessToken}`)
      .then((res) => {
        expect(res.body.meta.code).toBe(500);
      })
  })
 
});
