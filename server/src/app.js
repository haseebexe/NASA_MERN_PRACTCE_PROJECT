const express =  require('express');
const cors = require('cors');
const path = require("path");
const morgan =  require('morgan');
require('dotenv').config({ path: '../.env' });
const api = require('./routes/api')

const app = express();



// app.use(cors({
//     origin: 'http://localhost:3000'
// }))
app.use(cors());
app.use(morgan('combined'))
app.use(express.json())
app.use('/v1', api)
// app.use('v2', versionTwoRouter)
app.use(express.static(path.join(__dirname, "..", "public")))
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public" , "index.html"))
})
app.use((req, res, next) => {
  console.log('Request IP is', req.ip);
  next();
});



module.exports = app;