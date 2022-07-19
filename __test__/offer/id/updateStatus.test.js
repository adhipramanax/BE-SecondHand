require("dotenv").config();
const request = require("supertest");
const app = require("../../../app");
jest.setTimeout(100000);

describe("POST /api/v1/offer", () => {
  let accessToken;
  let offer;

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

  beforeEach(async () => {
    offer = request(app)
      .post("/api/v1/offer")
      .set("Authorization", `Bearer ${await accessToken}`)
      .send({
        offer_price: 2000000,
        id_product: 1,
      })
      .then((res) => {
        return res.body.data.id;
      });
  });

  it("should response with 200 as status code", async () => {
    return request(app)
      .put('/api/v1/offer/' + await offer)
      .set("Authorization", `Bearer ${await accessToken}`)
      .send({
        offer_status: true,
      })
      .then((res) => {
        expect(res.body.meta.code).toBe(200);
      })
  })

  it("should response with 500 as status code", async () => {
    return request(app)
      .put('/api/v1/offer/' + await offer.id)
      .set("Authorization", `Bearer ${await accessToken}`)
      .send({
        offer_status: true,
      })
      .then((res) => {
        expect(res.body.meta.code).toBe(500);
      })
  })
 
});
