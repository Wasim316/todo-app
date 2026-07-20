const express = require('express');
const dbConnection = require('./dbConfig');
const app = express();
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const dns = require("node:dns");
const router = require('./routes/todoRoutes');
const userRoutes = require('./routes/userRouter');

app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser());


dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

app.use(cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  }))

const port = process.env.PORT;

dbConnection();

// app.get('/ping', (req,res)=>{
//     res.send("PONG")
// })

app.use('/todos',router)
app.use('/user',userRoutes)

app.listen(port, ()=>{
    console.log(`app is listening to port ${port} `)
})