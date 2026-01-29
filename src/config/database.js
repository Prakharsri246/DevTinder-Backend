const mongoose = require('mongoose');

//Connecting to the Cluster
const ConnectDB = async () => {
    await mongoose.connect("mongodb+srv://prakharsri246_db_user:hDEKpbnzWJt4f5jV@cluster0.t2f9yxp.mongodb.net/devTinder");
}


//EXPORTING THIS connectdb to the app.js
module.exports = ConnectDB;


