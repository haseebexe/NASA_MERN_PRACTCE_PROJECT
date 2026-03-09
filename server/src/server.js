const http = require('http');
require('dotenv').config();
const app = require('./app');
const { connectToMongo } = require('./services/mongo')
const { getPlanetsData } = require('./models/planets.model')
const { loadLaunchesData } = require('./models/launches.model')


const PORT = process.env.PORT || 8000;




console.log(PORT)

const server = http.createServer(app);

async function startServer() {
    await connectToMongo();
    await getPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, ()=> {
    console.log(`Server is listening on PORT ${PORT}`)
})
}


startServer();
