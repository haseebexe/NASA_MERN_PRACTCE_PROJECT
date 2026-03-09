const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");

// const launches = new Map();

let DEFAULT_FLIGHT_NUMBER = 100;



const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading launches data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if(response.status !== 200 ){
    console.log('Error downloading launches');
    throw new Error('Launched download failed')
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customer = payloads.flatMap((payload) => {
      return payload.customers;
    });

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
      customer,
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchesData() {
  const firstLaunch = await findLaunch({
    flight_number: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launches has already been loaded");
  } else {
    await populateLaunches();
  }
}

// launches.set(launch.flightNumber, launch);

async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

async function existLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getLatestFlightNumber() {
  let latestFlightNumber = await launchesDatabase
    .findOne()
    .sort("-flightNumber");

  if (!latestFlightNumber) {
    return DEFAULT_FLIGHT_NUMBER;
  }

  return latestFlightNumber.flightNumber;
}

async function getAllLaunches(skip, limit) {
  return await launchesDatabase.find(
    {},
    {
      _id: 0,
      __v: 0,
    },
  )
  .sort({ flightNumber: 1 })
  .skip(skip)
  .limit(limit);
}

async function saveLaunch(launch) {
  return await launchesDatabase.findOneAndUpdate(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    },
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No such planet found");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;

  const newLaunch = Object.assign(launch, {
    upcoming: true,
    success: true,
    customer: ["ZTM", "NASA"],
    flightNumber: newFlightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    },
  );

  return aborted.modifiedCount === 1;
}

module.exports = {
  loadLaunchesData,
  existLaunchWithId,
  getAllLaunches,
  scheduleNewLaunch,
  abortLaunchById,
};
