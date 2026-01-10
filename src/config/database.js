const mongoose = require('mongoose');

//Connecting to the Cluster

const ConnectDB = async()=>{
 await mongoose.connect("mongodb+srv://prakharsri246_db_user:vRxJzfSNaXCOhTbb@devtinder.uafcgpf.mongodb.net/devTinder");
}


//EXPORTING THIS connectdb to the app.js
module.exports = ConnectDB;


