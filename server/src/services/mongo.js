const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nasacluster.zwawkr6.mongodb.net/${process.env.DB_NAME}?appName=NasaCluster`;


mongoose.connection.once("open", () => {
  console.log("Database is ready!");
});
mongoose.connection.on("error", (err) => {
  console.error(err);
});


async function connectToMongo() {
    await mongoose.connect(MONGO_URL)
}

async function disconnectFromMongo() {
    await mongoose.disconnect()
}

module.exports = {
    connectToMongo,
    disconnectFromMongo,
}