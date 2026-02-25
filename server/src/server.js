const http = require('http');
const app = require('./app');
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const { getPlanetsData } = require('./models/planets.model')

const PORT = process.env.PORT || 8000;

const MONGO_URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@nasacluster.zwawkr6.mongodb.net/${process.env.DB_NAME}?appName=NasaCluster`

mongoose.connection.once('open', ()=> {
    console.log('Database is ready!')
})
mongoose.connection.on('error', (err) => {
    console.error(err)
})

console.log(PORT)

const server = http.createServer(app);

async function startServer() {
    await mongoose.connect(MONGO_URL)

    await getPlanetsData()

    server.listen(PORT, ()=> {
    console.log(`Server is listening on PORT ${PORT}`)
})
}


startServer();
