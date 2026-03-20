const request = require("supertest");
const app = require("../../app");
const { connectToMongo, disconnectFromMongo } = require('../../services/mongo')
const {
  getPlanetsData
} = require('../../models/planets.model')

describe("Test launches API", () => {

  beforeAll( async () => {
     await connectToMongo();
     await getPlanetsData();
  });

  afterAll ( async () => {
    await disconnectFromMongo();
  })

  describe("Test GET /lauches ", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/v1/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  }, 15000);
});

describe("Test POST /v1/launches", () => {
  const completeLaunchData = {
    mission: "Testing Mission",
    rocket: "Explorer IS1",
    target: "Kepler-442 b",
    launchDate: "December 27, 2030",
  };

  const dataWithWrongDate = {
    mission: "Testing Mission",
    rocket: "Explorer IS1",
    target: "Kepler-442 b",
    launchDate: "Zoo",
  };

  const dataWithoutLaunchDate = {
    mission: "Testing Mission",
    rocket: "Explorer IS1",
    target: "Kepler-442 b",
  };

  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/v1/launches")
      .send(completeLaunchData)
      .expect("Content-Type", /json/)
      .expect(201);

    const requestDate = new Date(completeLaunchData.launchDate).valueOf();
    const responseDate = new Date(response.body.launchDate).valueOf();

    expect(responseDate).toBe(requestDate);

    expect(response.body).toMatchObject(dataWithoutLaunchDate);
  });

  test("It should catch missing required properties", async () => {
    const response = await request(app)
      .post("/v1/launches")
      .send(dataWithoutLaunchDate)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });
  test("It should check for valid date", async () => {
    const response = await request(app)
      .post("/v1/launches")
      .send(dataWithWrongDate)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});


})



