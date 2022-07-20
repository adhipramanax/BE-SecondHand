require("dotenv").config();
const request = require("supertest");
const app = require("../../app");
jest.setTimeout(100000);

describe("Register (/api/v1/auth/register)", () => {
  it("jika status respon code 201", () => {
    return request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "una",
        email: "una@binar.co.id",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });

  it("jika status respon code 422", () => {
    return request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "",
        email: "",
        password: "",
      })
      .then((res) => {
        expect(res.status).toBe(422);
      });
  });

  it("jika status respon code 501", () => {
    return request(app)
      .post("/api/v1/auth/register")
      .send({
        name: "bagus",
        email: "bagus@binar.co.id",
        password: "123456",
      })
      .then((res) => {
        expect(res.status).toBe(501);
      });
  });

  // Belum Beres
  // it("jika status respon code 500", () => {
  //   return request(app)
  //     .post("/api/v1/auth/register")
  //     .send({})
  //     .then((res) => {
  //       expect(res.status).toBe(500);
  //     });
  // });
});
