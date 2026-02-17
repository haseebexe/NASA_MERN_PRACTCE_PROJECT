const request = require("supertest");
const app = require("../../app");

describe("Test GET /lauches ", () => {
  test("It should respond with 200 success", async () => {
    const response = await request(app)
      .get("/launches")
      .expect("Content-Type", /json/)
      .expect(200);
  });
});

describe("Test POST /launches", () => {
  const completeLaunchData = {
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    target: "Kelper-442 b",
    launchDate: "December 27, 2030",
  };

  const dataWithWrongDate = {
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    target: "Kelper-442 b",
    launchDate: "Zoo",
  };

  const dataWithoutLaunchDate = {
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    target: "Kelper-442 b",
  };

  test("It should respond with 201 success", async () => {
    const response = await request(app)
      .post("/launches")
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
      .post("/launches")
      .send(dataWithoutLaunchDate)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Missing required launch property",
    });
  });
  test("It should check for valid date", async () => {
    const response = await request(app)
      .post("/launches")
      .send(dataWithWrongDate)
      .expect(400);

    expect(response.body).toStrictEqual({
      error: "Invalid launch date",
    });
  });
});
