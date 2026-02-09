const http = require('http');
const app = require('./app')

const { getPlanetsData } = require('./models/planets.model')

const PORT = process.env.PORT || 8000;

console.log(PORT)

const server = http.createServer(app);

async function startServer() {
    await getPlanetsData()

    server.listen(PORT, ()=> {
    console.log(`Server is listening on PORT ${PORT}`)
})
}


startServer();
