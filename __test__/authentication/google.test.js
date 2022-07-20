require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

describe("Login (/api/v1/auth/google)", () => {
  it("jika status respon code 200", () => {
    return request(app)
      .post("/api/v1/auth/google")
      .send({
        name: "ina",
        email: "ina@binar.co.id",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it("jika status respon code 500", () => {
    return request(app)
      .post("/api/v1/auth/google")
      .send({})
      .then((res) => {
        expect(res.status).toBe(500);
      });
  });
});
