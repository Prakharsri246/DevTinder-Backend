const express = require("express");
const cookieParser = require("cookie-parser");
// First we connect to the database then we start the server
const ConnectDB = require("./config/database");
const app = express();

// this allow the data to be read in json format
// Reads the json data and converts it into a javascript object.
app.use(express.json());

// Added cookie parser to read the cookie
app.use(cookieParser());

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

//  
app.use('/', authRouter)
app.use('/', profileRouter);
app.use('/', requestRouter);


// Connecting it to the DB
ConnectDB().then(() => {
    console.log("Database Connected Successfully"); //First we connect to the database then we start the server
    app.listen(3000, () => {
        console.log("Server is running on port 3000");  // Server has started listining to the requests
    })
}).catch(err => {
    console.log("Database Connection Failed", err);
})


