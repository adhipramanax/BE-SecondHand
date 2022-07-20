require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
jest.setTimeout(100000);

// update profile
describe("PUT /api/v1/profile/:id", () => {
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

  it("should response with 200 as status code", async () => {
    return request(app)
      .put("/api/v1/profile/1")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Bagus",
        city: "Jakarta",
        address: "Jakarta",
        phone_number: "081234567890",
      })
      .then((res) => {
        expect(res.status).toBe(200);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  it("should response with 404 as status code", async () => {
    return request(app)
      .put("/api/v1/profile/9")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        name: "Bagus",
        city: "Jakarta",
        address: "Jakarta",
        phone_number: "081234567890",
      })
      .then((res) => {
        expect(res.status).toBe(404);
      })
      .catch((err) => {
        console.log(err);
      });
  }); 
});
